import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import DetailsPriceInRoom from "./DetailsPriceInRoom";
// require("dayjs/locale/vi");

function SelectRoom(props) {
  const { categories } = useLoaderData();
  const priceNightStart = 22;
  const priceNightEnd = 11;
  const priceDayStart = 14;
  const priceDayEnd = 12;
  const priceSoonCheckIn = 10000;
  const priceLateCheckOut = 10000;
  const room = props.room;
  const listRoomIdByRes = props.listRoomByRes.map((r) => r.room.roomId);
  const listRoomsByCate = categories.find(
    (cate) =>
      cate.roomCategory.roomCategoryId === room.room.roomCategory.roomCategoryId
  );

  const [openPriceModal, setOpenPriceModal] = useState(false);

  const [roomByCate, setRoomByCate] = useState(
    listRoomsByCate.ListRoom.filter((r) => !listRoomIdByRes.includes(r.roomId))
  );

  let type = 1;
  let from = dayjs();
  let to = dayjs().add(1, "hour");
  let time = 1;
  let defaultPrice = 0;
  let lateCheckOut = 0;
  let soonCheckIn = 0;
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
    time = getPrice(type, from, to).time;
    defaultPrice = getPrice(type, from, to).price;
  } else if (room.reservationType === "DAILY") {
    type = 2;
    time = getPrice(type, from, to).time;
    defaultPrice = getPrice(type, from, to).price;
    if (from.hour() > priceDayStart) {
      soonCheckIn = from.hour() - priceDayStart;
    }
    if (to.hour() < priceDayEnd) {
      lateCheckOut = priceDayEnd - to.hour();
    }
  } else {
    type = 3;
    time = getPrice(type, from, to).time;
    defaultPrice = getPrice(type, from, to).price;
    if (from.hour() > priceNightStart) {
      soonCheckIn = from.hour() - priceDayStart;
    }
    if (from.add(1, "day").hour(priceNightEnd).minute(0) < to) {
      lateCheckOut = to.diff(
        from.add(1, "day").hour(priceNightEnd).minute(0),
        "hour"
      );
    }
  }
  const [typeTime, setTypeTime] = useState(type);
  const [valueTime, setValueTime] = useState(time);
  const [price, setPrice] = useState(defaultPrice);

  const [fromTime, setFromTime] = useState(from);
  const [toTime, setToTime] = useState(to);
  const [lateCheckout, setLateCheckout] = useState(lateCheckOut);
  const [soonCheckin, setSoonCheckin] = useState(soonCheckIn);
  // console.log(props.price);

  const handleSelectRoom = (e) => {
    const value = e.target.value;
    const now = dayjs();
    if (room.status === "BOOKING") {
      setLateCheckout(0);
      setSoonCheckin(0);
      if (value === 1) {
        setValueTime(1);
        setFromTime(now);
        setToTime(now.add(1, "hour"));
        setPrice(getPrice(value, now, now.add(1, "hour")).price);
      } else if (value === 2) {
        setValueTime(1);
        setFromTime(now.hour(priceDayStart).minute(0));
        setToTime(now.add(1, "day").hour(priceDayEnd).minute(0));
        setPrice(
          getPrice(
            value,
            now.hour(priceDayStart).minute(0),
            now.add(1, "day").hour(priceDayEnd).minute(0)
          ).price
        );
      } else {
        setFromTime(fromTime.hour(priceNightStart).minute(0));
        setToTime(toTime.add(1, "day").hour(priceNightEnd).minute(0));
        setValueTime(1);
        setPrice(
          getPrice(
            value,
            fromTime.hour(priceNightStart).minute(0),
            toTime.add(1, "day").hour(priceNightEnd).minute(0)
          ).price
        );
      }
    } else {
      setLateCheckout(0);
      if (value === 1) {
        setValueTime(1);
        setToTime(now.add(1, "hour"));
        setPrice(getPrice(value, now, now.add(1, "hour")).price);
      } else if (value === 2) {
        setValueTime(1);
        setToTime(now.add(1, "day").hour(priceDayEnd).minute(0));
        setPrice(
          getPrice(
            value,
            now.hour(priceDayStart).minute(0),
            now.add(1, "day").hour(priceDayEnd).minute(0)
          ).price
        );
      } else {
        setToTime(toTime.add(1, "day").hour(priceNightEnd).minute(0));
        setValueTime(1);
        setPrice(
          getPrice(
            value,
            fromTime.hour(priceNightStart).minute(0),
            toTime.add(1, "day").hour(priceNightEnd).minute(0)
          ).price
        );
      }
    }

    setTypeTime(value);
  };

  const handleChangeFromTime = (value) => {
    const priceTime = getPrice(typeTime, value, toTime);
    setValueTime(priceTime.time);
    setPrice(priceTime.price);
    if (typeTime === 1) {
      if (value.diff(toTime, "hour") >= 0) {
        setToTime(value.add(1, "hour"));
        setValueTime(1);
      }
      setFromTime(value);
    } else if (typeTime === 2) {
      if (value.date() >= toTime.date()) {
        setToTime(toTime.add(1, "day"));
        setValueTime(1);
      }
      if (value.hour() < priceDayStart) {
        setSoonCheckin(priceDayStart - value.hour());
      } else {
        setSoonCheckin(0);
      }
      if (toTime.hour() > priceDayEnd) {
        setLateCheckout(toTime.hour() - priceDayEnd);
      } else {
        setLateCheckout(0);
      }
      setFromTime(value);
    } else {
      if (value.hour() < priceNightStart) {
        setSoonCheckin(priceNightStart - value.hour());
      } else {
        setSoonCheckin(0);
      }
      if (toTime.hour() > priceNightEnd) {
        setLateCheckout(toTime.hour() - priceNightEnd);
      } else {
        setLateCheckout(0);
      }
      setFromTime(value);
    }
  };

  const handleChangeToTime = (value) => {
    const priceTime = getPrice(typeTime, fromTime, value);
    setValueTime(priceTime.time);
    setPrice(priceTime.price);
    if (typeTime === 1) {
      setToTime(value);
    } else if (typeTime === 2) {
      setToTime(value);
      if (fromTime.hour() > priceDayEnd) {
        setSoonCheckin(priceDayStart - fromTime.hour());
      } else {
        setSoonCheckin(0);
      }
      if (value.hour() > priceDayEnd) {
        setLateCheckout(value.hour() - priceDayEnd);
      } else {
        setLateCheckout(0);
      }
    } else {
      if (fromTime.hour() < priceNightStart) {
        setSoonCheckin(priceNightStart - fromTime.hour());
      } else {
        setSoonCheckin(0);
      }
      if (value.hour() > priceNightEnd) {
        setLateCheckout(value.hour() - priceNightEnd);
      } else {
        setLateCheckout(0);
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

  // console.log(props.price);
  function getPrice(typeTime, fromTime, toTime) {
    let price = 0;
    let time = 0;
    if (typeTime === 1) {
      const hoursList = [];
      let currentHour = fromTime;
      while (currentHour.isBefore(toTime)) {
        hoursList.push(currentHour);
        currentHour = currentHour.add(1, "hour");
      }
      time = hoursList.length;
      hoursList.map((hour) => {
        props.price.map((priceDetails) => {
          if (
            priceDetails.PriceListDetail.timeApply &&
            dayjs(priceDetails.PriceListDetail.timeApply).isSame(hour)
          ) {
            price += priceDetails.PriceListDetail.priceByHour;
            return;
          } else {
            if (
              priceDetails.DayOfWeekList.includes(hour.day() + 1 + "") ||
              priceDetails.DayOfWeekList.includes(hour.day() + 8 + "")
            ) {
              price += priceDetails.PriceListDetail.priceByHour;
            }
          }
        });
      });
    } else if (typeTime === 2) {
      const daysList = [];
      let currentHour = fromTime;
      while (currentHour.date() < toTime.date()) {
        daysList.push(currentHour);
        currentHour = currentHour.add(1, "day");
      }
      time = daysList.length;
      daysList.map((day) => {
        props.price.map((priceDetails) => {
          if (
            priceDetails.PriceListDetail.timeApply &&
            dayjs(priceDetails.PriceListDetail.timeApply).isSame(day)
          ) {
            price += priceDetails.PriceListDetail.priceByDay;
            return;
          } else {
            if (
              priceDetails.DayOfWeekList.includes(day.day() + 1 + "") ||
              priceDetails.DayOfWeekList.includes(day.day() + 8 + "")
            ) {
              price += priceDetails.PriceListDetail.priceByDay;
            }
          }
        });
      });
    } else {
      time = 1;
      props.price.map((priceDetails) => {
        if (
          priceDetails.PriceListDetail.timeApply &&
          dayjs(priceDetails.PriceListDetail.timeApply).isSame(fromTime)
        ) {
          price = priceDetails.PriceListDetail.priceByNight;
          return;
        } else {
          if (
            priceDetails.DayOfWeekList.includes(fromTime.day() + 1 + "") ||
            priceDetails.DayOfWeekList.includes(fromTime.day() + 8 + "")
          ) {
            price = priceDetails.PriceListDetail.priceByNight;
          }
        }
      });
    }
    return {
      price: price,
      time: time,
    };
  }

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
                    format="DD/MM/YYYY HH:mm"
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
                    format="DD/MM/YYYY HH:mm"
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
          <div className="bg-gray-200 w-.5 text-center my-auto py-1 px-2 rounded text-gray-500">
            {valueTime +
              " " +
              (typeTime === 1 ? "Giờ" : typeTime === 2 ? "Ngày" : "Đêm")}
            {(lateCheckout > 0 || soonCheckin > 0) &&
              " " + (lateCheckout + soonCheckin) + " Giờ"}
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
          <button
            type="button"
            className="ml-4"
            onClick={() => setOpenPriceModal(true)}
          >
            <i className="fa-solid fa-comment-dollar fa-xl"></i>
          </button>
        </p>
      </div>
      {soonCheckin > 0 && (
        <div className="flex border-t pt-2">
          <p className="w-8/12">Phụ thu nhận sớm (Giờ)</p>
          <p className="w-1/12">{soonCheckin}</p>
          <p className="w-2/12 text-right">{soonCheckin * priceSoonCheckIn}</p>
          <p className="w-1/12"></p>
        </div>
      )}
      {lateCheckout > 0 && (
        <div className="flex border-t pt-2">
          <p className="w-8/12">Phụ thu trả muộn (Giờ)</p>
          <p className="w-1/12">{lateCheckout}</p>
          <p className="w-2/12 text-right">
            {lateCheckout * priceLateCheckOut}
          </p>
          <p className="w-1/12"></p>
        </div>
      )}

      {openPriceModal && (
        <DetailsPriceInRoom
          open={openPriceModal}
          onClose={() => setOpenPriceModal(false)}
          toTime={toTime}
          fromTime={fromTime}
          typeTime={typeTime}
          price={props.price}
        />
      )}
    </div>
  );
}

export default SelectRoom;
