import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
// require("dayjs/locale/vi");

function SelectRoom(props) {
  const { categories } = useLoaderData();
  const room = props.room;
  console.log(room);
  console.log(props.price);
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
    time = to.date() - from.date();
  } else {
    type = 3;
    time = to.date() - from.date();
  }
  let priceBycate = {
    priceByHour: room.room.roomCategory.priceByHour,
    priceByDay: room.room.roomCategory.priceByDay,
    priceByNight: room.room.roomCategory.priceByNight,
  }

  if (props.price) {
    let priceByHour = 0;
    let priceByDay = 0;
    let priceByNight = 0;
    if (type === 1) {
      
    } else if (type === 2) { 

    } else {

    }
    priceBycate = {
      
    };
  }

  const [typeTime, setTypeTime] = useState(type);
  const [valueTime, setValueTime] = useState(time);
  const [price, setPrice] = useState(room.price);

  const [fromTime, setFromTime] = useState(from);
  const [toTime, setToTime] = useState(to);

  const handleSelectRoom = (e) => {
    const value = e.target.value;
    setTypeTime(value);
  };

  const handleChangeFromTime = (value) => {
    setFromTime(value);
    if (typeTime === 1) {
      setValueTime(toTime.diff(fromTime, "hour"));
    } else if (typeTime === 2) {
      setValueTime(toTime.date() - fromTime.date());
    } else {
      setValueTime(toTime.date() - fromTime.date());
    }
    // if (value > toTime) {
    //   setToTime(value.add(1, "hour"));
    // }
  };

  const handleChangeToTime = (value) => {
    setToTime(value);
    if (typeTime === 1) {
      setValueTime(value.diff(fromTime, "hour"));
    } else if (typeTime === 2) {
      setValueTime(value.date() - fromTime.date());
    } else {
      setValueTime(value.date() - fromTime.date());
    }
    // if (value <= toTime) {
    //   setFromTime(value);
    // }
  };

  const isDateDisabled = (date) => {
    return date < fromTime;
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
                  <DatePicker
                    disabled={
                      room.status === "CHECK_IN" || room.status === "CHECK_OUT"
                    }
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    value={fromTime}
                    onChange={handleChangeFromTime}
                    format="DD/MM/YYYY hh:mm"
                  />
                </div>
                <p className="text-gray-500 my-auto mr-2">đến</p>
                <div className="pr-2">
                  <DatePicker
                    disabled={room.status === "CHECK_OUT"}
                    shouldDisableDate={isDateDisabled}
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    value={toTime}
                    onChange={handleChangeToTime}
                    format="DD/MM/YYYY hh:mm"
                  />
                </div>
              </>
            )}
            {typeTime === 3 && (
              <>
                <p className="text-gray-500 my-auto mr-2">Dự kiến:</p>
                <div className="pr-2">
                  <DatePicker
                    disabled={
                      room.status === "CHECK_IN" || room.status === "CHECK_OUT"
                    }
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    value={fromTime}
                    onChange={handleChangeFromTime}
                    format="DD/MM/YYYY hh:mm"
                  />
                </div>
                <p className="text-gray-500 my-auto mr-2">đến</p>
                <div className="pr-2">
                  <DatePicker
                    disabled={room.status === "CHECK_OUT"}
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    value={toTime}
                    onChange={handleChangeToTime}
                    format="DD/MM/YYYY hh:mm"
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
        <p className="w-6/12">
          {room.room.roomCategory.roomCategoryName} (
          {typeTime === 1 ? "Giờ" : typeTime === 2 ? "Ngày" : "Đêm"})
        </p>
        <p className="w-2/12">{valueTime}</p>
        <p className="w-2/12">{price}</p>
        <p className="w-2/12">{valueTime * room.price}</p>
      </div>
    </div>
  );
}

export default SelectRoom;
