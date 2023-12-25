import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Modal from "../UI/Modal";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { Form, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getTimePrice,
  getSoonCheckin,
  getlateCheckout,
} from "../../utils/getTimePrice";

function ReceiveRoomModal(props) {
  const { timeUsing } = useLoaderData();
  const priceNightStart = timeUsing.startTimeNight.split(":")[0];
  const priceNightEnd = timeUsing.endTimeNight.split(":")[0];
  const priceDayStart = timeUsing.startTimeDay.split(":")[0];
  const priceDayEnd = timeUsing.endTimeDay.split(":")[0];
  const timeBonusDay = timeUsing.timeBonusDay;
  const timeBonusHour = timeUsing.timeBonusHour;
  const roomActive = props.roomActive;
  // console.log(roomActive);
  const listPrice = props.price;
  const from = dayjs(roomActive.checkInEstimate);
  const to = dayjs(roomActive.checkOutEstimate);
  const type =
    roomActive.reservationType === "HOURLY"
      ? 1
      : roomActive.reservationType === "DAILY"
      ? 2
      : 3;
  const [fromTime, setFromTime] = useState(from);
  const [toTime, setToTime] = useState(to);
  useEffect(() => {
    setFromTime(dayjs(roomActive.checkInEstimate));
    setToTime(dayjs(roomActive.checkOutEstimate));
  }, [roomActive]);
  let time = 0;
  const [listPrices, setListPrices] = useState([]);
  useEffect(() => {
    let listPrice = [];
    if (fromTime.diff(from) <= 0 && toTime.diff(to) >= 0) {
      listPrice = [
        ...props.listPriceRoom.PriceHistoryOverTime.map((priceRoom) => {
          return priceRoom.time + "|" + priceRoom.price;
        }),
      ];
      listPrice = [
        ...getTimePrice(type, fromTime, from, timeUsing, props.price).list,
        ...listPrice,
        ...getTimePrice(type, to, toTime, timeUsing, props.price).list,
      ];
    } else if (fromTime.diff(from) > 0) {
      listPrice = [
        ...props.listPriceRoom.PriceHistoryOverTime.filter((priceRoom) =>
          type === 1
            ? dayjs(priceRoom.time).diff(fromTime, "minute") >= -timeBonusHour
            : dayjs(priceRoom.time).diff(fromTime, "date") >= -timeBonusDay
        ).map((priceRoom) => {
          return priceRoom.time + "|" + priceRoom.price;
        }),
      ];
      listPrice = [
        ...listPrice,
        ...getTimePrice(type, to, toTime, timeUsing, props.price).list,
      ];
    } else if (toTime.diff(to) < 0) {
      listPrice = [
        ...props.listPriceRoom.PriceHistoryOverTime.filter((priceRoom) =>
          type === 1
            ? dayjs(toTime).diff(priceRoom.time, "minute") >= timeBonusHour
            : dayjs(toTime).diff(priceRoom.time, "date") >= timeBonusDay
        ).map((priceRoom) => {
          return priceRoom.time + "|" + priceRoom.price;
        }),
      ];
      listPrice = [
        ...getTimePrice(type, fromTime, from, timeUsing, props.price).list,
        ...listPrice,
      ];
    }
    console.log(listPrice);
    setListPrices(listPrice);
  }, [fromTime, toTime]);
  let surchargeTime = 0;
  if (roomActive.reservationType === "HOURLY") {
    let timePrice = getTimePrice(1, fromTime, toTime, timeUsing, listPrice);
    time = timePrice.time;
  } else if (roomActive.reservationType === "DAILY") {
    let timePrice = getTimePrice(2, fromTime, toTime, timeUsing, listPrice);
    time = timePrice.time;
    surchargeTime += getSoonCheckin(2, fromTime, timeUsing);
    surchargeTime += getlateCheckout(2, fromTime, toTime, timeUsing);
  } else {
    let timePrice = getTimePrice(3, fromTime, toTime, timeUsing, listPrice);
    time = timePrice.time;
    surchargeTime += getSoonCheckin(3, fromTime, timeUsing);
    surchargeTime += getlateCheckout(3, fromTime, toTime, timeUsing);
  }

  const handleErrorToTime = (error) => {
    if (roomActive.reservationType === "HOURLY") {
      setToTime(fromTime.add(1, "hour"));
    } else if (roomActive.reservationType === "DAILY") {
      setToTime(fromTime.add(1, "day").hour(priceDayEnd));
    } else {
      setToTime(fromTime.add(1, "day").hour(priceNightEnd).minute(0));
    }
  };
  return (
    <Form
      method="PUT"
      onSubmit={() => {
        props.onClose();
        if (props.onCloseAll) {
          props.onCloseAll();
        }
      }}
    >
      <Modal
        open={props.open}
        onClose={props.onClose}
        button={true}
        size="w-8/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">
              Xác nhận nhận phòng - {roomActive.reservation.reservationId}
            </h1>
            <input type="hidden" name="isReceiveRoom" defaultValue={true} />
            <input
              type="hidden"
              name="reservationDetailId"
              defaultValue={roomActive.reservationDetailId}
            />
            <input
              type="hidden"
              name="fromTime"
              value={fromTime.format("YYYY-MM-DD HH:mm:ss")}
              onChange={() => console.log()}
            />
            <input
              type="hidden"
              name="toTime"
              value={toTime.format("YYYY-MM-DD HH:mm:ss")}
              onChange={() => console.log()}
            />
            <input
              type="hidden"
              name="historyPrice"
              value={listPrices}
              onChange={() => console.log()}
            />
          </div>
          <table className="text-center min-w-full border border-gray-300 divide-y divide-gray-300">
            <thead>
              <tr className="bg-green-100">
                <td className="py-2 w-3/12">Hạng phòng</td>
                <td className="py-2 w-1/12">Phòng</td>
                <td className="py-2 w-3/12">
                  Nhận
                  <button
                    type="button"
                    className="bg-white border border-green-500 rounded ml-2 px-2 py-1 hover:bg-green-200"
                    onClick={() => setFromTime(dayjs())}
                  >
                    Hiện tại
                  </button>
                  <button
                    type="button"
                    className="bg-white border border-green-500 rounded ml-2 px-2 py-1 hover:bg-green-200"
                    onClick={() =>
                      setFromTime(dayjs(roomActive.checkInEstimate))
                    }
                  >
                    Giờ đặt
                  </button>
                </td>
                <td className="py-2 w-2/12">Thời gian</td>
                <td className="py-2 w-3/12">Trả</td>
              </tr>
            </thead>
            <tbody>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="vi-VN"
              >
                <tr>
                  <td className="py-2 w-3/12">
                    {roomActive.room.roomCategory.roomCategoryName}
                  </td>
                  <td className="py-2 w-1/12">{roomActive.room.roomName}</td>
                  <td className="py-2 w-3/12">
                    <DateTimePicker
                      ampm={false}
                      sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                      value={fromTime}
                      onChange={(e) => {
                        setFromTime(e);
                        if (e.diff(toTime) > 0) {
                          setToTime(e.add(1, "hour"));
                        }
                      }}
                      disabled={true}
                      maxDateTime={dayjs()}
                      format="DD/MM/YYYY HH:mm"
                    />
                  </td>
                  <td className="py-2 w-2/12 text-green-600">
                    {time}
                    {roomActive.reservationType === "HOURLY"
                      ? " Giờ"
                      : roomActive.reservationType === "DAILY"
                      ? " Ngày"
                      : " Đêm"}
                    {surchargeTime > 0 && " " + surchargeTime + " Giờ"}
                  </td>
                  <td className="py-2 w-3/12">
                    <DateTimePicker
                      ampm={false}
                      {...(roomActive.reservationType !== "HOURLY"
                        ? {
                            minDate: fromTime.add(1, "day"),
                          }
                        : {
                            minDateTime: fromTime.add(1, "hour"),
                          })}
                      sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                      value={toTime}
                      onChange={(e) => {
                        setToTime(e);
                      }}
                      onError={handleErrorToTime}
                      format="DD/MM/YYYY HH:mm"
                    />
                  </td>
                </tr>
              </LocalizationProvider>
            </tbody>
          </table>
        </div>
        <div className="flex pt-5">
          <div className="ml-auto">
            <button
              type={`${fromTime.diff(dayjs()) > 0 ? "button" : ""}`}
              className="bg-green-500 py-2 px-6 text-white rounded hover:bg-green-600"
              onClick={() => {
                if (fromTime.diff(dayjs()) > 0) {
                  Swal.fire({
                    position: "bottom",
                    html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Không thể nhận phòng ở thời điểm tương lai!</button>`,
                    showConfirmButton: false,
                    background: "transparent",
                    backdrop: "none",
                    timer: 2500,
                  });
                }
              }}
            >
              Xong
            </button>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default ReceiveRoomModal;
