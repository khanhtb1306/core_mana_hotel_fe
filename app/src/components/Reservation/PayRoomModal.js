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

function PayRoomModal(props) {
  const { timeUsing } = useLoaderData();
  const priceNightStart = timeUsing.startTimeNight.split(":")[0];
  const priceNightEnd = timeUsing.endTimeNight.split(":")[0];
  const priceDayStart = timeUsing.startTimeDay.split(":")[0];
  const priceDayEnd = timeUsing.endTimeDay.split(":")[0];
  const timeBonusDay = timeUsing.timeBonusDay;
  const timeBonusHour = timeUsing.timeBonusHour;
  const roomActive = props.roomActive;
  const listPrice = props.price;
  //   console.log(props.roomActive);
  const fromTime = dayjs(roomActive.checkInActual);
  const [toTime, setToTime] = useState(dayjs(roomActive.checkOutEstimate));
  useEffect(() => {
    setToTime(dayjs(roomActive.checkOutEstimate));
  }, [roomActive]);
  let time = 0;
  let price = 0;
  let surchargeTime = 0;
  if (roomActive.reservationType === "HOURLY") {
    let timePrice = getTimePrice(1, fromTime, toTime, timeUsing, listPrice);
    time = timePrice.time;
    price = timePrice.price;
  } else if (roomActive.reservationType === "DAILY") {
    let timePrice = getTimePrice(2, fromTime, toTime, timeUsing, listPrice);
    time = timePrice.time;
    price = timePrice.price;
    surchargeTime += getSoonCheckin(2, fromTime, timeUsing);
    surchargeTime += getlateCheckout(2, fromTime, toTime, timeUsing);
  } else {
    let timePrice = getTimePrice(3, fromTime, toTime, timeUsing, listPrice);
    time = timePrice.time;
    price = timePrice.price;
    surchargeTime += getSoonCheckin(3, fromTime, timeUsing);
    surchargeTime += getlateCheckout(3, fromTime, toTime, timeUsing);
  }
  return (
    <Form method="PUT" onSubmit={props.onClose}>
      <Modal
        open={props.open}
        onClose={props.onClose}
        button={true}
        size="w-8/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">
              Xác nhận trả phòng - {roomActive.reservation.reservationId}
            </h1>
            <input type="hidden" name="isPayRoom" defaultValue={true} />
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
              name="price"
              value={price}
              onChange={() => console.log()}
            />
          </div>
          <table className="text-center min-w-full border border-gray-300 divide-y divide-gray-300">
            <thead>
              <tr className="bg-green-100">
                <td className="py-2 w-3/12">Hạng phòng</td>
                <td className="py-2 w-1/12">Phòng</td>
                <td className="py-2 w-3/12">Nhận</td>
                <td className="py-2 w-2/12">Thời gian</td>
                <td className="py-2 w-3/12">
                  Trả
                  <button
                    type="button"
                    className="bg-white border border-green-500 rounded ml-2 px-2 py-1 hover:bg-green-200"
                    onClick={() => setToTime(dayjs())}
                  >
                    Hiện tại
                  </button>
                  <button
                    type="button"
                    className="bg-white border border-green-500 rounded ml-2 px-2 py-1 hover:bg-green-200"
                    onClick={() =>
                      setToTime(dayjs(roomActive.checkOutEstimate))
                    }
                  >
                    Giờ đặt
                  </button>
                </td>
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
                      defaultValue={fromTime}
                      disabled={true}
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
                            shouldDisableTime: (date) =>
                              date.minute() % 60 !== 0,
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
                      disabled={true}
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
              type={`${toTime.diff(dayjs()) > 0 ? "button" : ""}`}
              className="bg-green-500 mr-5 py-2 px-6 text-white rounded hover:bg-green-600"
              onClick={() => {
                if (toTime.diff(dayjs()) > 0) {
                  Swal.fire({
                    position: "bottom",
                    html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Không thể trả phòng ở thời điểm tương lai!</button>`,
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

export default PayRoomModal;
