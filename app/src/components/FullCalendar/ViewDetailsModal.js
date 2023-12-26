import dayjs from "dayjs";
import Modal from "../UI/Modal";
import { Form, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getSoonCheckin,
  getTimePrice,
  getlateCheckout,
} from "../../utils/getTimePrice";
import { useEffect, useState } from "react";
import ChangeRoomModal from "../Reservation/ChangeRoomModal";
import ReceiveRoomModal from "../Reservation/ReceiveRoomModal";
import PayRoomModal from "../Reservation/PayRoomModal";
import { axiosPrivate } from "../../utils/axiosConfig";

function ViewDetailsModal(props) {
  const { timeUsing, prices, categories } = useLoaderData();
  const priceNightStart = timeUsing.startTimeNight.split(":")[0];
  const priceNightEnd = timeUsing.endTimeNight.split(":")[0];
  const priceDayStart = timeUsing.startTimeDay.split(":")[0];
  const priceDayEnd = timeUsing.endTimeDay.split(":")[0];
  const timeBonusDay = timeUsing.timeBonusDay;
  const timeBonusHour = timeUsing.timeBonusHour;
  const reservationDetail = props.reservationDetail;
  const [openChangeModal, setOpenChangeModal] = useState(false);
  const [openReceiveModal, setOpenReceiveModal] = useState(false);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [listPriceRooms, setListPriceRooms] = useState([]);
  useEffect(() => {
    async function fetchListPriceRooms() {
      try {
        const reponse = await axiosPrivate.get(
          "reservation-detail/get_price_history_over_time?reservationId=" +
            reservationDetail.reservation.reservationId
        );
        setListPriceRooms(reponse.data.result);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListPriceRooms();
  }, []);
  // console.log(reservationDetail);
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
        priceListId: "BG000000",
        priceListName: "Bảng giá chung",
        effectiveTimeStart: "2000-08-02T17:00:00.000+00:00",
        effectiveTimeEnd: "3000-08-02T17:00:00.000+00:00",
        note: "",
      },
    },
    ...pricesMore,
  ];
  const priceById = allPrices.find(
    (price) =>
      price.PriceList.priceListId ===
      reservationDetail.reservation.priceList.priceListId
  );
  const customer = reservationDetail.reservation.customer;
  let fromDate = dayjs();
  let toDate = dayjs();
  const type =
    reservationDetail.reservationType === "HOURLY"
      ? 1
      : reservationDetail.reservationType === "DAILY"
      ? 2
      : 3;
  if (reservationDetail.status === "BOOKING") {
    fromDate = dayjs(reservationDetail.checkInEstimate);
    toDate = dayjs(reservationDetail.checkOutEstimate);
  } else if (reservationDetail.status === "CHECK_IN") {
    fromDate = dayjs(reservationDetail.checkInActual);
    toDate = dayjs(reservationDetail.checkOutEstimate);
  } else {
    fromDate = dayjs(reservationDetail.checkInActual);
    toDate = dayjs(reservationDetail.checkOutActual);
  }

  let timeUse = "";
  if (type === 1) {
    if (dayjs().diff(fromDate, "hour") > 0) {
      timeUse += dayjs().diff(fromDate, "hour") + " giờ";
      timeUse += " ";
    }
    timeUse +=
      dayjs().diff(fromDate, "minute") -
      dayjs().diff(fromDate, "hour") * 60 +
      " phút";
  } else if (type === 2) {
    if (dayjs().diff(fromDate, "day") > 0) {
      timeUse += dayjs().diff(fromDate, "day") + " ngày";
      if (
        getlateCheckout(type, fromDate, dayjs(), timeUsing) +
          getSoonCheckin(type, fromDate, timeUsing) >
        0
      ) {
        timeUse += " ";
        timeUse +=
          getlateCheckout(type, fromDate, dayjs(), timeUsing) +
          getSoonCheckin(type, fromDate, timeUsing) +
          "  giờ";
      }
    } else {
      timeUse += dayjs().diff(fromDate, "hour") + " giờ";
    }
  } else {
    if (dayjs().diff(fromDate, "day") > 0) {
      timeUse += 1 + " đêm";
      if (
        getlateCheckout(type, fromDate, dayjs(), timeUsing) +
          getSoonCheckin(type, fromDate, timeUsing) >
        0
      ) {
        timeUse += " ";
        timeUse +=
          getlateCheckout(type, fromDate, dayjs(), timeUsing) +
          getSoonCheckin(type, fromDate, timeUsing) +
          "  giờ";
      }
    } else {
      timeUse += dayjs().diff(fromDate, "hour") + " giờ";
    }
  }
  return (
    <>
      <Form method="PUT" onSubmit={props.onClose}>
        <Modal
          open={props.open}
          onClose={props.onClose}
          button={true}
          size="w-4/12 h-.5/6"
        >
          <div className="p-2 w-full">
            <div className="mb-5">
              <div className="flex">
                <input
                  type="hidden"
                  name="reservationId"
                  defaultValue={reservationDetail.reservation.reservationId}
                />
                <input
                  type="hidden"
                  name="reservationDetailId"
                  defaultValue={reservationDetail.reservationDetailId}
                />
                <input
                  type="hidden"
                  name="fromTime"
                  value={fromDate}
                  onChange={() => console.log()}
                />
                <input
                  type="hidden"
                  name="toTime"
                  value={toDate}
                  onChange={() => console.log()}
                />
                <h1 className="text-lg font-bold">
                  {reservationDetail.room.roomName}
                </h1>
                {reservationDetail.status === "BOOKING" && (
                  <div className="ml-5 my-auto px-2 py-1 rounded text-orange-500 bg-orange-100 text-xs">
                    Đã đặt trước
                  </div>
                )}
                {reservationDetail.status === "CHECK_IN" && (
                  <div className="ml-5 my-auto px-2 py-1 rounded text-green-500 bg-green-100 text-xs">
                    Đang sử dụng
                  </div>
                )}
                {(reservationDetail.status === "CHECK_OUT" ||
                  reservationDetail.status === "DONE") && (
                  <div className="ml-5 my-auto px-2 py-1 rounded text-gray-500 bg-gray-100 text-xs">
                    Đã trả
                  </div>
                )}
              </div>
            </div>
            <div>
              <h2 className="font-bold">
                {reservationDetail.room.roomCategory.roomCategoryName}
              </h2>
              <div className="text-sm">
                <div className="flex mt-2">
                  <div className="w-1/6">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div className="w-5/6">
                    {reservationDetail.status === "BOOKING" && (
                      <>
                        <div>
                          {fromDate.format("DD MMM, HH:mm") +
                            " - " +
                            toDate.format("DD MMM, HH:mm") +
                            " (" +
                            getTimePrice(type, fromDate, toDate, timeUsing, [])
                              .time}
                          {type === 1 && " Giờ)"}
                          {type === 2 && " Ngày)"}
                          {type === 3 && " Đêm)"}
                        </div>
                        {dayjs().diff(fromDate) > 0 && (
                          <div className="text-red-500">
                            Quá giờ nhận phòng dự kiến
                          </div>
                        )}
                      </>
                    )}
                    {reservationDetail.status === "CHECK_IN" && (
                      <>
                        <div>
                          {fromDate.format("DD MMM, HH:mm") +
                            " - " +
                            toDate.format("DD MMM, HH:mm") +
                            " (" +
                            getTimePrice(type, fromDate, toDate, timeUsing, [])
                              .time}
                          {type === 1 && " Giờ)"}
                          {type === 2 && " Ngày)"}
                          {type === 3 && " Đêm)"}
                        </div>
                        <div>
                          Dùng đến hiện tại:{" "}
                          <span className="text-green-500">{timeUse}</span>
                        </div>
                      </>
                    )}
                    {(reservationDetail.status === "CHECK_OUT" ||
                      reservationDetail.status === "DONE") && (
                      <>
                        <div>
                          {fromDate.format("DD MMM, HH:mm") +
                            " - " +
                            toDate.format("DD MMM, HH:mm") +
                            " (" +
                            getTimePrice(type, fromDate, toDate, timeUsing, [])
                              .time}
                          {type === 1 && " Giờ)"}
                          {type === 2 && " Ngày)"}
                          {type === 3 && " Đêm)"}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex mt-2">
                  <div className="w-1/6">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="w-5/6">{customer.customerName}</div>
                </div>
                <div className="flex mt-2">
                  <div className="w-1/6">
                    <i className="fa-solid fa-key"></i>
                  </div>
                  <div className="w-5/6">
                    {reservationDetail.reservation.reservationId}
                  </div>
                </div>
                <div className="flex mt-2">
                  <div className="w-1/6">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <div className="w-5/6">
                    {reservationDetail.reservation.totalAdults +
                      " người lớn & " +
                      reservationDetail.reservation.totalChildren +
                      " trẻ em"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex pt-5">
            <div className="ml-auto">
              {reservationDetail.status === "BOOKING" && (
                <>
                  <button
                    type="button"
                    className="border border-black mr-2 py-1 px-3 text-gray-500 rounded hover:bg-gray-200"
                    onClick={() => {
                      window.location.href =
                        "/editReservation/" +
                        reservationDetail.reservation.reservationId;
                    }}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    className="border border-green-500 text-green-500 mr-2 py-1 px-3 rounded hover:bg-green-200"
                    onClick={() => setOpenChangeModal(true)}
                  >
                    Đổi phòng
                  </button>
                  <button
                    type="button"
                    className="bg-green-500 py-1 px-3 text-white rounded hover:bg-green-600"
                    onClick={() => setOpenReceiveModal(true)}
                  >
                    Nhận phòng
                  </button>
                </>
              )}
              {reservationDetail.status === "CHECK_IN" && (
                <>
                  <button
                    type="button"
                    className="border border-black mr-2 py-1 px-3 text-gray-500 rounded hover:bg-gray-200"
                    onClick={() => {
                      window.location.href =
                        "/editReservation/" +
                        reservationDetail.reservation.reservationId;
                    }}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    className="border border-green-500 text-green-500 mr-2 py-1 px-3 rounded hover:bg-green-200"
                    onClick={() => setOpenChangeModal(true)}
                  >
                    Đổi phòng
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 py-1 px-3 text-white rounded hover:bg-blue-600"
                    onClick={() => setOpenPayModal(true)}
                  >
                    Trả phòng
                  </button>
                </>
              )}
              {reservationDetail.status === "CHECK_OUT" && (
                <>
                  <button
                    type="button"
                    className="border border-black mr-2 py-1 px-3 text-gray-500 rounded hover:bg-gray-200"
                    onClick={() => {
                      window.location.href =
                        "/editReservation/" +
                        reservationDetail.reservation.reservationId;
                    }}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    className="bg-green-500 py-1 px-3 text-white rounded hover:bg-green-600"
                    onClick={() => {
                      window.location.href =
                        "/editReservation/" +
                        reservationDetail.reservation.reservationId;
                    }}
                  >
                    Thanh toán
                  </button>
                </>
              )}
              {reservationDetail.status === "DONE" && (
                <>
                  <button
                    type="button"
                    className="bg-green-500 py-1 px-3 text-white rounded hover:bg-green-600"
                    onClick={() => {
                      window.location.href =
                        "/editReservation/" +
                        reservationDetail.reservation.reservationId;
                    }}
                  >
                    Xem chi tiết
                  </button>
                </>
              )}
            </div>
          </div>
        </Modal>
      </Form>
      {openChangeModal && (
        <ChangeRoomModal
          open={openChangeModal}
          onCloseAll={() => props.onClose()}
          onClose={() => setOpenChangeModal(false)}
          roomActive={reservationDetail}
          price={
            priceById.ListPriceListDetail.find(
              (details) =>
                details.RoomClass.roomCategoryId ===
                reservationDetail.room.roomCategory.roomCategoryId
            ).PriceListDetailWithDayOfWeek
          }
        />
      )}
      {openReceiveModal && (
        <ReceiveRoomModal
          open={openReceiveModal}
          onCloseAll={() => props.onClose()}
          onClose={() => setOpenReceiveModal(false)}
          roomActive={reservationDetail}
          listPriceRoom={listPriceRooms.find(
            (priceRoom) =>
              priceRoom.ReservationDetail.reservationDetailId ===
              reservationDetail.reservationDetailId
          )}
          price={
            priceById.ListPriceListDetail.find(
              (details) =>
                details.RoomClass.roomCategoryId ===
                reservationDetail.room.roomCategory.roomCategoryId
            ).PriceListDetailWithDayOfWeek
          }
        />
      )}
      {openPayModal && (
        <PayRoomModal
          open={openPayModal}
          onCloseAll={() => props.onClose()}
          onClose={() => setOpenPayModal(false)}
          roomActive={reservationDetail}
          price={
            priceById.ListPriceListDetail.find(
              (details) =>
                details.RoomClass.roomCategoryId ===
                reservationDetail.room.roomCategory.roomCategoryId
            ).PriceListDetailWithDayOfWeek
          }
        />
      )}
    </>
  );
}

export default ViewDetailsModal;
