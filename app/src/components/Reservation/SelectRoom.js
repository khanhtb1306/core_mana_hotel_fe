import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
// require("dayjs/locale/vi");

function SelectRoom(props) {
  const { categories } = useLoaderData();
  const priceNightStart = 22;
  const priceNightEnd = 11;
  const priceDayStart = 14;
  const priceDayEnd = 12;
  const room = props.room;
  const listRoomIdByRes = props.listRoomByRes.map((r) => r.room.roomId);
  const listRoomsByCate = categories.find(
    (cate) =>
      cate.roomCategory.roomCategoryId === room.room.roomCategory.roomCategoryId
  );

  const [roomByCate, setRoomByCate] = useState(
    listRoomsByCate.ListRoom.filter((r) => !listRoomIdByRes.includes(r.roomId))
  );

  let type = 1;
  let from = dayjs();
  let to = dayjs().add(1, "hour");
  let time = 1;
  if (room.status === "BOOKING") {
    from = dayjs(room.checkInEstimate);
    to = dayjs(room.checkOutEstimate);
  } else if (room.status === "CHECK_IN") {
    from = dayjs(room.checkInActual);
    to = dayjs(room.checkOutEstimate);
  } else {
    from = dayjs(room.checkInActual);
    to = dayjs(room.checkOutActual);
  }
  if (room.reservationType === "HOURLY") {
    type = 1;
    time = to.diff(from, "hour");
  } else if (room.reservationType === "DAILY") {
    type = 2;
    time = to.diff(from, "day");
  } else {
    type = 3;
    if (to.diff(from, "day") > 1) {
      time = 1;
      console.log("Thêm phụ thu trả muộn theo giờ");
    } else {
      time = to.diff(from, "day");
    }
  }
  const [typeTime, setTypeTime] = useState(type);
  const [valueTime, setValueTime] = useState(time);
  const [price, setPrice] = useState(valueTime * room.price);

  const [fromTime, setFromTime] = useState(from);
  const [toTime, setToTime] = useState(to);
  // console.log(props.price);

  const handleSelectRoom = (e) => {
    const value = e.target.value;
    const now = dayjs();
    if (value === 1) {
      setValueTime(1);
      setFromTime(now);
      setToTime(now.add(1, "hour"));
    } else if (value === 2) {
      setValueTime(1);
      setFromTime(now.hour(priceDayStart).minute(0));
      setToTime(now.add(1, "day").hour(priceDayEnd).minute(0));
    } else {
      setFromTime(fromTime.hour(priceNightStart).minute(0));
      setToTime(toTime.add(1, "day").hour(priceNightEnd).minute(0));
      setValueTime(1);
    }
    setTypeTime(value);
  };

  const handleChangeFromTime = (value) => {
    if (typeTime === 1) {
      if (value.diff(toTime, "hour") >= 0) {
        setToTime(value.add(1, "hour"));
        setValueTime(1);
      } else {
        setValueTime(toTime.diff(value, "hour"));
      }
      setFromTime(value);
    } else if (typeTime === 2) {
      if (value.diff(toTime, "day") >= 0) {
        setToTime(value.add(1, "day"));
        setValueTime(1);
      } else {
        setValueTime(toTime.diff(value, "day"));
      }
      setFromTime(value);
      if (value.hour() < priceDayStart) {
        console.log("Phụ thu nhận phòng sớm");
      }
      if (toTime.hour() > priceDayEnd) {
        console.log("Phụ thu trả phòng muộn");
      }
    } else {
      if (value.hour() < priceNightStart) {
        setValueTime(1);
        console.log("Thêm phụ thu trả muộn theo giờ");
      }
      setFromTime(value);
    }
  };

  const handleChangeToTime = (value) => {
    if (typeTime === 1) {
      setValueTime(value.diff(fromTime, "hour"));
      setToTime(value);
    } else if (typeTime === 2) {
      setValueTime(value.date() - fromTime.date());
      setToTime(value);
      if (fromTime.hour() < priceDayStart) {
        console.log("Phụ thu nhận phòng sớm");
      }
      if (value.hour() > priceDayEnd) {
        console.log("Phụ thu trả phòng muộn");
      }
    } else {
      if (value.hour() > priceDayEnd) {
        setValueTime(1);
        console.log("Thêm phụ thu trả muộn theo giờ");
      }
      setToTime(value);
    }
  };

  const handleError = (reason) => {
    Swal.fire({
      icon: "error",
      title: "Invalid Date",
      text: "Please enter a valid date.",
    });
  };

  const isFromDateDisabled = (date) => {
    if (typeTime === 1) {
      return false;
    } else if (typeTime === 2) {
      return false;
    } else {
      return false;
    }
  };

  const isToDateDisabled = (date) => {
    if (typeTime === 1) {
      return fromTime.diff(date, "hour") > 24;
    } else if (typeTime === 2) {
      return date < fromTime;
    } else {
      return date < fromTime;
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
            disabled={room.status === "CHECK_OUT"}
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
            disabled={room.status === "CHECK_OUT"}
          >
            {roomByCate.map((room, index) => {
              return (
                <MenuItem key={index} value={room.roomId}>
                  {room.roomName}
                </MenuItem>
              );
            })}
          </Select>
          {room.status === "CHECK_OUT" && (
            <div className="ml-2 p-2 bg-gray-200 rounded-lg text-gray-700">
              Đã trả
            </div>
          )}
          {room.status === "CHECK_IN" && (
            <div className="ml-2 p-2 bg-green-200 rounded-lg text-green-700">
              Đang sử dụng
            </div>
          )}
          {room.status === "BOOKING" && (
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
            {typeTime === 1 && (
              <>
                <p className="text-gray-500 my-auto mr-2">Dự kiến:</p>
                <div className="pr-2">
                  <DateTimePicker
                    ampm={false}
                    disabled={
                      room.status === "CHECK_IN" || room.status === "CHECK_OUT"
                    }
                    shouldDisableDate={isFromDateDisabled}
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    value={fromTime}
                    onChange={handleChangeFromTime}
                  />
                </div>
                <p className="text-gray-500 my-auto mr-2">đến</p>
                <div className="pr-2">
                  <DateTimePicker
                    ampm={false}
                    disabled={room.status === "CHECK_OUT"}
                    shouldDisableDate={isToDateDisabled}
                    shouldDisableTime={(date) =>
                      fromTime.diff(date, "hour") > -1
                    }
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    value={toTime}
                    onChange={handleChangeToTime}
                  />
                </div>
              </>
            )}
            {typeTime === 2 && (
              <>
                <p className="text-gray-500 my-auto mr-2">Dự kiến:</p>
                <div className="pr-2">
                  <DateTimePicker
                    ampm={false}
                    disabled={
                      room.status === "CHECK_IN" || room.status === "CHECK_OUT"
                    }
                    shouldDisableDate={isFromDateDisabled}
                    shouldDisableTime={(date) => date.minute() % 60 !== 0}
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    value={fromTime}
                    onChange={handleChangeFromTime}
                    format="DD/MM/YYYY HH:mm"
                  />
                </div>
                <p className="text-gray-500 my-auto mr-2">đến</p>
                <div className="pr-2">
                  <DateTimePicker
                    ampm={false}
                    disabled={room.status === "CHECK_OUT"}
                    shouldDisableTime={(date) => date.minute() % 60 !== 0}
                    shouldDisableDate={isToDateDisabled}
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    value={toTime}
                    onChange={handleChangeToTime}
                    format="DD/MM/YYYY HH:mm"
                  />
                </div>
              </>
            )}
            {typeTime === 3 && (
              <>
                <p className="text-gray-500 my-auto mr-2">Dự kiến:</p>
                <div className="pr-2">
                  <DateTimePicker
                    ampm={false}
                    disabled={
                      room.status === "CHECK_IN" || room.status === "CHECK_OUT"
                    }
                    shouldDisableDate={isFromDateDisabled}
                    shouldDisableTime={(date) => date.minute() % 60 !== 0}
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    value={fromTime}
                    onChange={handleChangeFromTime}
                    format="DD/MM/YYYY HH:mm"
                  />
                </div>
                <p className="text-gray-500 my-auto mr-2">đến</p>
                <div className="pr-2">
                  <DateTimePicker
                    ampm={false}
                    disabled={room.status === "CHECK_OUT"}
                    shouldDisableDate={isToDateDisabled}
                    shouldDisableTime={(date) => date.minute() % 60 !== 0}
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    value={toTime}
                    onChange={handleChangeToTime}
                    format="DD/MM/YYYY HH:mm"
                  />
                </div>
              </>
            )}
          </LocalizationProvider>
          <div className="bg-gray-200 w-20 text-center my-auto py-1 px-2 rounded text-gray-500">
            {valueTime +
              " " +
              (typeTime === 1 ? "Giờ" : typeTime === 2 ? "Ngày" : "Đêm")}
          </div>
        </div>
      </div>
      <div className="flex border-t pt-2">
        <p className="w-8/12">
          {room.room.roomCategory.roomCategoryName} (
          {typeTime === 1 ? "Giờ" : typeTime === 2 ? "Ngày" : "Đêm"})
        </p>
        <p className="w-1/12">{valueTime}</p>
        <p className="w-2/12 text-right">{price}</p>
        <p className="w-1/12">
          <button type="button" className="ml-4" onClick={() => console.log(1)}>
            <i className="fa-solid fa-comment-dollar fa-xl"></i>
          </button>
        </p>
      </div>
    </div>
  );
}

export default SelectRoom;
