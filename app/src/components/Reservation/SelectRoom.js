import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";
import { MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

function SelectRoom(props) {
  const { categories } = useLoaderData();
  const room = props.room;
  const listRoomIdByRes = props.listRoomByRes.map((r) => r.room.roomId);
  const listRoomsByCate = categories.find(
    (cate) =>
      cate.roomCategory.roomCategoryId === room.room.roomCategory.roomCategoryId
  );

  const [roomByCate, setRoomByCate] = useState(
    listRoomsByCate.ListRoom.filter((r) => !listRoomIdByRes.includes(r.roomId))
  );

  console.log(room);

  const type =
    room.reservationType === "HOURLY"
      ? 1
      : room.reservationType === "DAILY"
      ? 2
      : 3;

  const [typeTime, setTypeTime] = useState(type);
  const [valueTime, setValueTime] = useState("1 giờ");

  const [fromTime, setFromTime] = useState(dayjs().add(1, "minute"));
  const [toTime, setToTime] = useState(dayjs().add(1, "hour").add(1, "minute"));

  const handleSelectRoom = (e) => {
    const value = e.target.value;
    setTypeTime(value);
  };

  const handleChangeFromTime = (value) => {
    setFromTime(value);
    if (value > toTime) {
      setToTime(value.add(1, "hour"));
    }
  };

  const handleChangeToTime = (value) => {
    setToTime(value);
    if (value <= toTime) {
      setFromTime(value);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg border p-4">
      <div>
        <div className="flex mb-2">
          <p className="my-auto mr-2">
            {room.room.roomCategory.roomCategoryName}
          </p>
          <Select
            sx={{ width: 100, height: 40 }}
            value={typeTime}
            onChange={handleSelectRoom}
          >
            <MenuItem value={1}>Giờ</MenuItem>
            <MenuItem value={2}>Ngày</MenuItem>
            <MenuItem value={3}>Đêm</MenuItem>
          </Select>
        </div>
        <div className="flex mb-2">
          <p className="text-gray-500 my-auto mr-2">Phòng:</p>
          <Select
            sx={{ width: 160, height: 40 }}
            defaultValue={room.room.roomId}
          >
            {roomByCate.map((room, index) => {
              return (
                <MenuItem key={index} value={room.roomId}>
                  {room.roomName}
                </MenuItem>
              );
            })}
          </Select>
          {room.room.bookingStatus === "ROOM_EMPTY" && (
            <div className="ml-2 p-2 bg-gray-200 rounded-lg text-gray-700">
              Đã trả
            </div>
          )}
          {room.room.bookingStatus === "ROOM_USING" && (
            <div className="ml-2 p-2 bg-green-200 rounded-lg text-green-700">
              Đang sử dụng
            </div>
          )}
          {room.room.bookingStatus === "ROOM_BOOKING" && (
            <div className="ml-2 p-2 bg-orange-200 rounded-lg text-orange-700">
              Đã đặt trước
            </div>
          )}
        </div>
        <div className="flex mb-2">
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="vi-VN"
          >
            <p className="text-gray-500 my-auto mr-2">Dự kiến:</p>
            <div className="pr-2">
              <DateTimePicker
                ampm={false}
                disablePast
                sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                value={fromTime}
                onChange={handleChangeFromTime}
              />
            </div>
            <p className="text-gray-500 my-auto mr-2">đến</p>
            <div className="pr-2">
              <DateTimePicker
                ampm={false}
                disablePast
                sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                value={toTime}
                onChange={handleChangeToTime}
              />
            </div>
          </LocalizationProvider>
          <div className="bg-gray-200 w-20 text-center my-auto py-1 px-2 rounded text-gray-500">
            {valueTime}
          </div>
        </div>
      </div>
      <div className="flex border-t pt-2">
        <p className="w-6/12">
          {room.room.roomCategory.roomCategoryName} (Ngày) {room.room.roomName}
        </p>
        <p className="w-2/12">3</p>
        <p className="w-2/12">800,000</p>
        <p className="w-2/12">2,400,000</p>
      </div>
    </div>
  );
}

export default SelectRoom;
