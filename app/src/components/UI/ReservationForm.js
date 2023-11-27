import { useEffect, useState } from "react";
import SelectRoom from "../Reservation/SelectRoom";
import SearchCustomer from "../Search/SearchCustomer";
import { useActionData, useLoaderData } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import AddRoom from "../Reservation/AddRoom";
import RemoveRoom from "../Reservation/RemoveRoom";
import AddInvoice from "../Reservation/AddInvoice";
import { axiosPrivate } from "../../utils/axiosConfig";
import { Form } from "react-router-dom";
import ViewInvoice from "../Reservation/ViewInvoice";
import dayjs from "dayjs";
import EditInvoice from "../Reservation/EditInvoice";
import StatusInvoice from "../Reservation/StatusInvoice";
import CancelInvoice from "../Reservation/CancelInvoice";
import VisitorModal from "../Reservation/VisitorModal";
import PaymentModal from "../Reservation/PaymentModal";

function ReservationForm(props) {
  const { customers, prices, categories } = useLoaderData();
  const actionData = useActionData();
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
  // console.log(allPrices);
  const [openAddRoomModal, setOpenAddRoomModal] = useState(false);
  const [openAddInvoiceModal, setOpenAddInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [printInvoice, setPrintInvoice] = useState(false);
  const [openViewInvoiceModal, setOpenViewInvoiceModal] = useState(false);
  const [openEditInvoiceModal, setOpenEditInvoiceModal] = useState(false);
  const [openStatusInvoiceModal, setOpenStatusInvoiceModal] = useState(false);
  const [openDeleteInvoiceModal, setOpenDeleteInvoiceModal] = useState(false);
  const [removeRoomModal, setRemoveRoomModal] = useState(null);
  const [listInvoices, setListInvoices] = useState(null);
  const [listCustomers, setListCustomers] = useState(null);
  const [openVisitorModal, setOpenVisitorModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [customer, setCustomer] = useState(
    reservation ? reservation.reservation.customer : null
  );
  // console.log(customer);
  let priceByCateRoom = null;
  let priceById = null;
  if (reservation) {
    priceById = allPrices.find(
      (price) =>
        price.PriceList.priceListId ===
        reservation.reservation.priceList.priceListId
    );
    if (!priceById) {
      priceById = allPrices[0];
    }
    priceByCateRoom = priceById.ListPriceListDetail.find(
      (details) =>
        details.RoomClass.roomCategoryId ===
        reservation.listReservationDetails[0].room.roomCategory.roomCategoryId
    ).PriceListDetailWithDayOfWeek;
  }
  // console.log(priceByCateRoom);
  // console.log(listInvoices);
  const [roomActive, setRoomActive] = useState(
    reservation ? reservation.listReservationDetails[0] : null
  );
  const [priceBook, setPriceBook] = useState(priceById);
  const [price, setPrice] = useState(priceByCateRoom);
  // console.log(roomActive);

  const handlePriceBookChange = (event) => {
    const priceById = allPrices.find(
      (price) => price.PriceList.priceListId === event.target.value
    );
    if (roomActive) {
      setPrice(
        priceById.ListPriceListDetail.find(
          (details) =>
            details.RoomClass.roomCategoryId ===
            roomActive.room.roomCategory.roomCategoryId
        ).PriceListDetailWithDayOfWeek
      );
    }
    setPriceBook(priceById);
  };
  useEffect(() => {
    async function fetchListInvoices() {
      try {
        if (reservation) {
          const response1 = await axiosPrivate.get(
            "order/reservation/" + roomActive.reservationDetailId
          );
          setListInvoices(response1.data.result);
          const response2 = await axiosPrivate.get(
            "reservation-detail/list-customers/" +
              roomActive.reservationDetailId
          );
          setListCustomers(response2.data.result);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchListInvoices();
  }, [actionData, roomActive]);
  const handleRoomChange = (room) => {
    setRoomActive(room);
  };

  const handleCustomerClick = (customerId) => {
    setCustomer(customers.find((cus) => cus.customerId === customerId));
  };

  const handleCustomerRemove = () => {
    setCustomer(null);
  };

  // console.log(listCustomers);

  return (
    <>
      <div className="px-4 w-full py-2 h-1/6 print:hidden">
        <div className="flex">
          <SearchCustomer
            customers={customers}
            customer={customer}
            handleCustomerClick={handleCustomerClick}
            handleCustomerRemove={handleCustomerRemove}
          />
          <button
            type="button"
            className="ml-4 rounded-lg px-2 border bg-white hover:border-green-500"
          >
            <i className="fa-solid fa-user-tie ml-2"></i>
            <span className="mx-2">
              {reservation ? reservation.reservation.totalAdults : 0}
            </span>
            {" | "}
            <i className="fa-solid fa-child ml-2"></i>
            <span className="mx-2">
              {reservation ? reservation.reservation.totalChildren : 0}
            </span>
          </button>
          <div className="ml-auto">
            <Select
              sx={{ width: 200, height: 40, backgroundColor: "white" }}
              value={
                priceBook
                  ? priceBook.PriceList.priceListId
                  : allPrices[0].PriceList.priceListId
              }
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
      </div>
      {reservation ? (
        <>
          <Form method="PUT" className="h-[41.5rem] px-5 print:hidden">
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
                      className={`pl-2 pr-1 py-1 ${
                        room.reservationDetailId ===
                        roomActive.reservationDetailId
                          ? "bg-orange-500 text-white"
                          : "text-orange-500 hover:bg-orange-200"
                      } rounded`}
                      onClick={() => handleRoomChange(room)}
                    >
                      {room.room.roomName}
                      <i
                        className="fa-solid fa-xmark ml-1 p-1 px-1.5 hover:bg-orange-300 hover:rounded-full"
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
                  <button className="px-4 py-2 ml-auto rounded-lg text-white bg-green-500 hover:bg-green-600">
                    Nhận phòng
                  </button>
                  <button className="px-4 py-2 ml-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600">
                    Đổi phòng
                  </button>
                </>
              )}
              {roomActive.status === "CHECK_IN" && (
                <>
                  <button className="px-4 py-2 ml-auto rounded-lg text-white bg-blue-500 hover:bg-blue-600">
                     Trả phòng
                  </button>
                  <button className="px-4 py-2 ml-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600">
                    Đổi phòng
                  </button>
                </>
              )}
            </div>
            {roomActive && listCustomers && (
              <>
                <input type="hidden" name="isReservation" defaultValue={true} />
                <input
                  type="hidden"
                  name="reservationId"
                  defaultValue={reservation.reservation.reservationId}
                />
                {customer && (
                  <input
                    type="hidden"
                    name="customerId"
                    value={customer.customerId}
                    onChange={() => console.log()}
                  />
                )}
                <input
                  type="hidden"
                  name="priceListId"
                  value={priceBook.PriceList.priceListId}
                  onChange={() => console.log()}
                />
                <input
                  type="hidden"
                  name="numberRoom"
                  defaultValue={reservation.listReservationDetails.length}
                />
                <div className="w-full py-2 h-5/6 overflow-y-auto">
                  {reservation.listReservationDetails.map((room, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          roomActive.reservationDetailId !==
                            room.reservationDetailId && "hidden"
                        }`}
                      >
                        <SelectRoom
                          room={room}
                          listRoomByRes={reservation.listReservationDetails.filter(
                            (res) => res.room.roomId !== room.room.roomId
                          )}
                          price={price}
                          visitors={listCustomers}
                          handleVisitModalOpen={() => setOpenVisitorModal(true)}
                        />
                      </div>
                    );
                  })}
                  {listInvoices && listInvoices.length > 0 && (
                    <div className="bg-white p-4 mt-4 flex">
                      <div className="w-3/12">Mã hoá đơn</div>
                      <div className="w-3/12">Trạng thái</div>
                      <div className="w-3/12">Tổng tiền</div>
                      <div className="w-3/12">Hoạt động</div>
                    </div>
                  )}
                  {listInvoices &&
                    listInvoices.length > 0 &&
                    listInvoices.map((invoice, index) => {
                      return (
                        <div key={index} className="bg-white p-4 mt-1 flex">
                          <div className="w-3/12">{invoice.order.orderId}</div>
                          <div
                            className={`w-3/12 ${
                              invoice.order.status === "UNCONFIRMED" &&
                              "text-orange-500"
                            } ${
                              invoice.order.status === "CONFIRMED" &&
                              "text-blue-500"
                            } ${
                              invoice.order.status === "PAID" &&
                              "text-green-500"
                            } ${
                              invoice.order.status === "CANCEL_ORDER" &&
                              "text-gray-500"
                            }`}
                          >
                            {invoice.order.status === "UNCONFIRMED" &&
                              "Chưa xác nhận"}
                            {invoice.order.status === "CONFIRMED" && "Xác nhận"}
                            {invoice.order.status === "PAID" && "Đã trả"}
                            {invoice.order.status === "CANCEL_ORDER" &&
                              "Huỷ hoá đơn"}
                          </div>
                          <div className="w-3/12">
                            {invoice.order.totalPay.toLocaleString()}
                          </div>
                          <div className="w-3/12">
                            <button
                              className="mr-4 px-1 rounded-full hover:bg-gray-200"
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setOpenViewInvoiceModal(true);
                              }}
                            >
                              <i className="fa-solid fa-eye"></i>
                            </button>
                            <button
                              className="mr-4 px-1 rounded-full hover:bg-gray-200"
                              onMouseOver={() => {
                                setSelectedInvoice(invoice);
                                setPrintInvoice(true);
                              }}
                              onMouseOut={() => {
                                setPrintInvoice(false);
                              }}
                              onClick={() => {
                                window.print();
                              }}
                            >
                              <i className="fa-solid fa-print"></i>
                            </button>
                            {invoice.order.status === "UNCONFIRMED" && (
                              <>
                                <button
                                  type="button"
                                  className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setOpenEditInvoiceModal(true);
                                  }}
                                >
                                  <i className="fa-solid fa-pen"></i>
                                </button>
                                <button
                                  className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setOpenStatusInvoiceModal(true);
                                  }}
                                >
                                  <i className="fa-solid fa-check"></i>
                                </button>
                                <button
                                  className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setOpenDeleteInvoiceModal(true);
                                  }}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </>
                            )}
                            {invoice.order.status === "CONFIRMED" && (
                              <button
                                className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setOpenStatusInvoiceModal(true);
                                }}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            )}
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
                    <button type="button">
                      <i className="fa-solid fa-trash fa-lg"></i>
                    </button>
                  </div>
                  <div className="ml-auto">
                    <button
                      type="button"
                      className="px-4 py-2 bg-white border border-green-500 rounded-lg text-green-500 mr-2 hover:bg-gray-100"
                      onClick={() => {
                        window.print();
                      }}
                    >
                      In
                    </button>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white border border-green-500 rounded-lg text-green-500 mr-2 hover:bg-gray-100">
                      Lưu
                    </button>
                  </div>
                  <div>
                    <button
                      className="px-4 py-2 bg-green-500 rounded-lg text-white mr-2 hover:bg-green-600"
                      onClick={() => setOpenPaymentModal(true)}
                    >
                      Thanh toán
                    </button>
                  </div>
                </div>
              </>
            )}
          </Form>
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
              onClose={() => {
                setOpenAddInvoiceModal(false);
              }}
              reservationDetail={roomActive}
            />
          )}
          {selectedInvoice && printInvoice && (
            <div className="hidden print:block">
              <p>Tên cửa hàng: Khách sạn Thành Công</p>
              <p>Điện thoại: 0981987625</p>
              <div className="mt-4 border-t border-black border-dotted">
                Ngày xuất HĐ: {dayjs().format("DD/MM/YYYY HH:mm")}
              </div>
              <div className="mt-4">
                <div className="font-bold text-center">
                  <h2>HOÁ ĐƠN BÁN HÀNG</h2>
                  <p className="text-sm">{selectedInvoice.order.orderId}</p>
                </div>
                <div>
                  <p>Khách hàng: {customer.customerName}</p>
                  <p>Mã đặt phòng: {reservation.reservation.reservationId}</p>
                  <p>Thu ngân: </p>
                </div>
                <table className="text-center min-w-full border border-gray-300 divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <td>Nội dung</td>
                      <td>Đơn vị</td>
                      <td>SL</td>
                      <td>Thành tiền</td>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.OrderDetail.map((goods, index) => {
                      return (
                        <tr key={index}>
                          <td>{goods.OrderDetail.goods.goodsName}</td>
                          <td>{goods.OrderDetail.goodsUnit.goodsUnitName}</td>
                          <td>{goods.OrderDetail.quantity}</td>
                          <td>{goods.OrderDetail.price}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="flex mt-4">
                  <div className="ml-auto mr-10">Tổng tiền hàng: </div>
                  <div className="w-32 text-right">
                    {selectedInvoice.order.totalPay}
                  </div>
                </div>
                <div className="flex">
                  <div className="ml-auto mr-10">Chiếu khấu: </div>
                  <div className="w-32 text-right">0</div>
                </div>
                <div className="flex">
                  <div className="ml-auto mr-10">Tổng cộng: </div>
                  <div className="w-32 text-right">
                    {selectedInvoice.order.totalPay}
                  </div>
                </div>
              </div>
              <div className="text-center mt-10 text-sm">
                Cảm ơn và hẹn gặp lại
              </div>
            </div>
          )}
          {selectedInvoice && openViewInvoiceModal && (
            <ViewInvoice
              open={openViewInvoiceModal}
              onClose={() => setOpenViewInvoiceModal(false)}
              invoice={selectedInvoice}
            />
          )}
          {selectedInvoice && openEditInvoiceModal && (
            <EditInvoice
              open={openEditInvoiceModal}
              onClose={() => setOpenEditInvoiceModal(false)}
              invoice={selectedInvoice}
              reservationDetail={roomActive}
            />
          )}
          {selectedInvoice && openStatusInvoiceModal && (
            <StatusInvoice
              open={openStatusInvoiceModal}
              onClose={() => setOpenStatusInvoiceModal(false)}
              invoice={selectedInvoice}
            />
          )}
          {selectedInvoice && openDeleteInvoiceModal && (
            <CancelInvoice
              open={openDeleteInvoiceModal}
              onClose={() => setOpenDeleteInvoiceModal(false)}
              invoice={selectedInvoice}
            />
          )}
          {listCustomers && openVisitorModal && (
            <VisitorModal
              open={openVisitorModal}
              onClose={() => setOpenVisitorModal(false)}
              room={roomActive}
              visitors={listCustomers}
            />
          )}
          {removeRoomModal && (
            <RemoveRoom
              open={removeRoomModal ? true : false}
              onClose={() => setRemoveRoomModal(null)}
              room={removeRoomModal}
            />
          )}
          {openPaymentModal && (
            <PaymentModal
              open={openPaymentModal}
              onClose={() => setOpenPaymentModal(false)}
              reservation={reservation}
            />
          )}
        </>
      ) : (
        <>
          <div className="flex">
            <button
              className="mx-auto mt-10 text-green-500 px-4 py-2 rounded-lg border border-green-500 hover:bg-green-100"
              type="button"
              onClick={() => setOpenAddRoomModal(true)}
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Phòng
            </button>
          </div>
          {openAddRoomModal && (
            <AddRoom
              open={openAddRoomModal}
              onClose={() => setOpenAddRoomModal(false)}
              addReservation={true}
              priceListId={
                priceBook
                  ? priceBook.PriceList.priceListId
                  : allPrices[0].PriceList.priceListId
              }
              customerId={customer ? customer.customerId : null}
            />
          )}
        </>
      )}
    </>
  );
}

export default ReservationForm;
