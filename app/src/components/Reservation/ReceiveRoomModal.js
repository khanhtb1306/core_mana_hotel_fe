import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Modal from "../UI/Modal";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { Form } from "react-router-dom";

function ReceiveRoomModal(props) {
  const roomActive = props.roomActive;
//   console.log(props.roomActive);
  const [fromTime, setFromTime] = useState(dayjs(roomActive.checkInEstimate));
  const [toTime, setToTime] = useState(dayjs(roomActive.checkOutEstimate));
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
          </div>
          <table className="text-center min-w-full border border-gray-300 divide-y divide-gray-300">
            <thead>
              <tr className="bg-green-100">
                <td className="py-2 w-3/12">Hạng phòng</td>
                <td className="py-2 w-1/12">Phòng</td>
                <td className="py-2 w-4/12">
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
                <td className="py-2 w-1/12"></td>
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
                  <td className="py-2 w-4/12">
                    <DateTimePicker
                      ampm={false}
                      {...(roomActive.reservationType !== "HOURLY" && {
                        shouldDisableTime: (date) => date.minute() % 60 !== 0,
                      })}
                      sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                      value={fromTime}
                      onChange={(e) => {
                        setFromTime(e);
                        if (e.diff(toTime) > 0) {
                          setToTime(e.add(1, "hour"));
                        }
                      }}
                      maxDateTime={dayjs()}
                      format="DD/MM/YYYY HH:mm"
                    />
                  </td>
                  <td className="py-2 w-1/12">
                    {roomActive.reservationType === "HOURLY" &&
                      toTime.diff(fromTime, "hour") + " Giờ"}
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
                      minDateTime={dayjs()}
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
            <button className="bg-green-500 mr-5 py-2 px-6 text-white rounded hover:bg-green-600">
              Xong
            </button>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default ReceiveRoomModal;
