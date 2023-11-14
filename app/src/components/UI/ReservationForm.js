import { useEffect, useState } from "react";
import SelectRoom from "../Reservation/SelectRoom";
import SearchCustomer from "../Search/SearchCustomer";
import { useLoaderData } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import AddRoom from "../Reservation/AddRoom";
import RemoveRoom from "../Reservation/RemoveRoom";
import AddInvoice from "../Reservation/AddInvoice";
import { axiosPrivate } from "../../utils/axiosConfig";

function ReservationForm(props) {
  const { customers, prices, categories } = useLoaderData();
  const reservation = props.reservation;
  console.log(reservation);
  // console.log(categories);
  const dayInWeek = ["2", "3", "4", "5", "6", "7", "8"];
  const pricesMore = prices.map((price) => {
    // console.log(price);
    const addClassRooms = categories
      .filter(
        (cate) =>
          !price.ListPriceListDetail.map(
            (row) => row.RoomClass.roomCategoryId
          ).includes(cate.roomCategory.roomCategoryId)
      )
      .map((cate) => {
        return {
          PriceListDetailWithDayOfWeek: [
            {
              DayOfWeekList: dayInWeek,
              PriceListDetail: {
                priceByDay: cate.roomCategory.priceByDay,
                priceByHour: cate.roomCategory.priceByHour,
                priceByNight: cate.roomCategory.priceByNight,
                timeApply: null,
              },
            },
          ],
          RoomClass: cate.roomCategory,
        };
      });
    const classRooms = price.ListPriceListDetail.map((priceDetails) => {
      const dayWithPriceBook = priceDetails.PriceListDetailWithDayOfWeek.reduce(
        (all, cur) => {
          return all.concat(cur.DayOfWeekList);
        },
        []
      );
      const dayWithoutPriceBook = dayInWeek.filter(
        (day) => !dayWithPriceBook.includes(day)
      );
      // console.log(priceDetails);
      let newPriceDetails = priceDetails.PriceListDetailWithDayOfWeek;
      if (dayWithoutPriceBook.length > 0) {
        const cate = categories.find(
          (cate) =>
            cate.roomCategory.roomCategoryId ===
            priceDetails.RoomClass.roomCategoryId
        );
        newPriceDetails = [
          ...newPriceDetails,
          {
            DayOfWeekList: dayWithoutPriceBook,
            PriceListDetail: {
              priceByDay: cate.roomCategory.priceByDay,
              priceByHour: cate.roomCategory.priceByHour,
              priceByNight: cate.roomCategory.priceByNight,
              timeApply: null,
            },
          },
        ];
      }
      return {
        PriceListDetailWithDayOfWeek: newPriceDetails,
        RoomClass: priceDetails.RoomClass,
      };
    });
    return {
      ListPriceListDetail: classRooms.concat(addClassRooms),
      PriceList: price.PriceList,
    };
  });
  const allPrices = [
    {
      ListPriceListDetail: categories.map((cate) => {
        return {
          PriceListDetailWithDayOfWeek: [
            {
              DayOfWeekList: ["2", "3", "4", "5", "6", "7", "8"],
              PriceListDetail: {
                priceByDay: cate.roomCategory.priceByDay,
                priceByHour: cate.roomCategory.priceByHour,
                priceByNight: cate.roomCategory.priceByNight,
                timeApply: null,
              },
            },
          ],
          RoomClass: cate.roomCategory,
        };
      }),
      PriceList: {
        priceListId: "0",
        priceListName: "Bảng giá chung",
        effectiveTimeStart: "2000-08-02T17:00:00.000+00:00",
        effectiveTimeEnd: "3000-08-02T17:00:00.000+00:00",
        note: "",
      },
    },
    ...pricesMore,
  ];
  console.log(allPrices);
  const [openAddRoomModal, setOpenAddRoomModal] = useState(false);
  const [openAddInvoiceModal, setOpenAddInvoiceModal] = useState(false);
  const [removeRoomModal, setRemoveRoomModal] = useState(null);
  const [listInvoices, setListInvoices] = useState(null);
  let priceByCateRoom = null;
  let priceById = null;
  if (reservation) {
    priceById = allPrices.find(
      (price) =>
        price.PriceList.priceListId ===
        reservation.reservation.priceList.priceListId
    );
    priceByCateRoom = priceById.ListPriceListDetail.find(
      (details) =>
        details.RoomClass.roomCategoryId ===
        reservation.listReservationDetails[0].room.roomCategory.roomCategoryId
    ).PriceListDetailWithDayOfWeek;
  }
  useEffect(() => {
    async function fetchListInvoices() {
      try {
        if (reservation) {
          console.log(reservation.listReservationDetails[0]);
          const response = await axiosPrivate.get(
            "order/reservation/" +
              reservation.listReservationDetails[0].reservationDetailId
          );
          setListInvoices(response.data.result);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchListInvoices();
  }, []);
  // console.log(priceByCateRoom);
  console.log(listInvoices);
  const [roomActive, setRoomActive] = useState(
    reservation.listReservationDetails
      ? reservation.listReservationDetails[0]
      : null
  );
  const [priceBook, setPriceBook] = useState(priceById);
  const [price, setPrice] = useState(priceByCateRoom);
  console.log(roomActive);

  const handlePriceBookChange = (event) => {
    const priceById = allPrices.find(
      (price) => price.PriceList.priceListId === event.target.value
    );
    setPrice(
      priceById.ListPriceListDetail.find(
        (details) =>
          details.RoomClass.roomCategoryId ===
          roomActive.room.roomCategory.roomCategoryId
      ).PriceListDetailWithDayOfWeek
    );
    setPriceBook(priceById);
  };

  const handleRoomChange = async (room) => {
    console.log(room);
    const response = await axiosPrivate.get(
      "order/reservation/" + room.reservationDetailId
    );
    setListInvoices(response.data.result);
    setRoomActive(room);
  };

  return (
    <div className="h-[45.5rem] px-5">
      {roomActive && (
        <>
          <div className="w-full py-2 h-1/6">
            <div className="flex">
              <SearchCustomer customers={customers} />
              <div className="ml-auto">
                <Select
                  sx={{ width: 200, height: 40, backgroundColor: "white" }}
                  value={priceBook.PriceList.priceListId}
                  onChange={handlePriceBookChange}
                >
                  {allPrices.map((price) => {
                    const details = price.PriceList;
                    return (
                      <MenuItem
                        key={details.priceListId}
                        value={details.priceListId}
                      >
                        {details.priceListName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className="flex my-auto rounded-lg py-2">
              <div className="px-2 py-1 mr-2 rounded-lg bg-white">
                {reservation.listReservationDetails.map((room, index) => {
                  let status = 3;
                  if (room.status === "CHECK_IN") {
                    status = 2;
                  } else if (room.status === "BOOKING") {
                    status = 1;
                  }
                  return status === 1 ? (
                    <button
                      key={index}
                      type="button"
                      className={`px-2 py-1 ${
                        room.reservationDetailId ===
                        roomActive.reservationDetailId
                          ? "bg-orange-500 text-white"
                          : "text-orange-500 hover:bg-orange-200"
                      } rounded`}
                      onClick={() => handleRoomChange(room)}
                    >
                      {room.room.roomName}
                      <i
                        className="fa-solid fa-xmark ml-2 p-1 px-1.5 hover:bg-orange-300 hover:rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRemoveRoomModal(room);
                        }}
                      ></i>
                    </button>
                  ) : status === 2 ? (
                    <button
                      key={index}
                      type="button"
                      className={`px-2 py-1 ${
                        room.reservationDetailId ===
                        roomActive.reservationDetailId
                          ? "bg-green-500 text-white"
                          : "text-green-500 hover:bg-green-200"
                      } rounded`}
                      onClick={() => handleRoomChange(room)}
                    >
                      {room.room.roomName}
                    </button>
                  ) : (
                    <button
                      key={index}
                      type="button"
                      className={`px-2 py-1 ${
                        room.reservationDetailId ===
                        roomActive.reservationDetailId
                          ? "bg-gray-500 text-white"
                          : "text-gray-500 hover:bg-gray-200"
                      } rounded`}
                      onClick={() => handleRoomChange(room)}
                    >
                      {room.room.roomName}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-green-500 hover:bg-green-100"
                onClick={() => setOpenAddRoomModal(true)}
              >
                <i className="fa-solid fa-circle-plus pr-2"></i>
                Phòng
              </button>
              {roomActive.status === "BOOKING" && (
                <>
                  <button
                    type="button"
                    className="px-4 py-2 ml-auto rounded-lg text-white bg-green-500 hover:bg-green-600"
                  >
                    Nhận phòng
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 ml-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600"
                  >
                    Đổi phòng
                  </button>
                </>
              )}
              {roomActive.status === "CHECK_IN" && (
                <>
                  <button
                    type="button"
                    className="px-4 py-2 ml-auto rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                  >
                     Trả phòng
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 ml-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600"
                  >
                    Đổi phòng
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="w-full py-2 h-5/6 overflow-y-auto">
            {reservation.listReservationDetails.map((room, index) => {
              if (room.reservationDetailId === roomActive.reservationDetailId) {
                return (
                  <div key={index}>
                    <div></div>
                    <SelectRoom
                      room={room}
                      listRoomByRes={reservation.listReservationDetails.filter(
                        (res) => res.room.roomId !== room.room.roomId
                      )}
                      price={price}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={index} className="hidden">
                    <SelectRoom
                      room={room}
                      listRoomByRes={reservation.listReservationDetails.filter(
                        (res) => res.room.roomId !== room.room.roomId
                      )}
                      price={price}
                    />
                  </div>
                );
              }
            })}
            {listInvoices &&
              listInvoices.length > 0 &&
              listInvoices.map((invoice) => {
                return (
                  <div className="bg-white p-4 mt-2 flex">
                    <div className="w-3/12">
                      Mã hoá đơn: {invoice.order.orderId}
                    </div>
                    <div
                      className={`w-3/12 ${
                        invoice.order.status === "UNCONFIMRED" &&
                        "text-orange-500"
                      } ${
                        invoice.order.status === "CONFIMRED" && "text-blue-500"
                      } ${
                        invoice.order.status === "PAID" && "text-green-500"
                      } ${
                        invoice.order.status === "CANCEL_ORDER" &&
                        "text-gray-500"
                      }`}
                    >
                      Trạng thái: {invoice.order.status}
                    </div>
                    <div className="w-3/12">
                      Tổng tiền: {invoice.order.totalPay.toLocaleString()}
                    </div>
                    <div className="w-1/12">
                      <button>
                        <i className="fa-solid fa-eye"></i>
                      </button>
                    </div>
                    <div className="w-1/12">
                      <button>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </div>
                    <div className="w-1/12">
                      <button>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            <button
              className="rounded p-2 mt-2 text-white bg-green-500"
              onClick={() => setOpenAddInvoiceModal(true)}
            >
              <i className="fa-solid fa-plus mr-2"></i>Tạo hoá đơn
            </button>
          </div>
          <div className="w-full py-2 h-.5/6 flex">
            <div>
              <button>
                <i className="fa-solid fa-trash fa-lg"></i>
              </button>
            </div>
            <div className="ml-auto">
              <button
                type="button"
                className="px-4 py-2 bg-white border border-green-500 rounded-lg text-green-500 mr-2"
              >
                In
              </button>
            </div>
            <div>
              <button
                type="button"
                className="px-4 py-2 bg-white border border-green-500 rounded-lg text-green-500 mr-2"
              >
                Lưu
              </button>
            </div>
            <div>
              <button
                type="button"
                className="px-4 py-2 bg-green-500 rounded-lg text-white mr-2"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </>
      )}
      {openAddRoomModal && (
        <AddRoom
          open={openAddRoomModal}
          onClose={() => setOpenAddRoomModal(false)}
          reservationId={reservation.reservation.reservationId}
        />
      )}
      {openAddInvoiceModal && (
        <AddInvoice
          open={openAddInvoiceModal}
          onClose={() => setOpenAddInvoiceModal(false)}
        />
      )}
      {removeRoomModal && (
        <RemoveRoom
          open={removeRoomModal ? true : false}
          onClose={() => setRemoveRoomModal(null)}
          room={removeRoomModal}
        />
      )}
    </div>
  );
}

export default ReservationForm;
