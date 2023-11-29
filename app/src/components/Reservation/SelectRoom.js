import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import DetailsPriceInRoom from "./DetailsPriceInRoom";
import VisitorModal from "./VisitorModal";
// require("dayjs/locale/vi");

function SelectRoom(props) {
  const { categories, timeUsing } = useLoaderData();
  // console.log(timeUsing);
  const priceNightStart = timeUsing.startTimeNight.split(":")[0];
  const priceNightEnd = timeUsing.endTimeNight.split(":")[0];
  const priceDayStart = timeUsing.startTimeDay.split(":")[0];
  const priceDayEnd = timeUsing.endTimeDay.split(":")[0];
  const timeBonusDay = timeUsing.timeBonusDay;
  const timeBonusHour = timeUsing.timeBonusHour;
  const priceSoonCheckIn = 10000;
  const priceLateCheckOut = 10000;
  const room = props.room;
  // console.log(room);
  const listRoomIdByRes = props.listRoomByRes.map((r) => r.room.roomId);
  const listRoomsByCate = categories.find(
    (cate) =>
      cate.roomCategory.roomCategoryId === room.room.roomCategory.roomCategoryId
  );

  const [openPriceModal, setOpenPriceModal] = useState(false);

  const roomByCate = listRoomsByCate.ListRoom.filter(
    (r) => !listRoomIdByRes.includes(r.roomId)
  );
  const [selectedRoomId, setSelectedRoomId] = useState(room.room.roomId);
  // const [roomByCate, setRoomByCate] = useState(

  // );

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
    if (from.hour() > priceNightStart) {
      soonCheckIn = from.hour() - priceNightStart;
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
  const [fromTime, setFromTime] = useState(from);
  const [toTime, setToTime] = useState(to);
  const [lateCheckout, setLateCheckout] = useState(lateCheckOut);
  const [soonCheckin, setSoonCheckin] = useState(soonCheckIn);
  const [isPaidSoonCheckin, setIsPaidSoonCheckin] = useState(true);
  const [isPaidLateCheckout, setIsPaidLateCheckout] = useState(true);
  useEffect(() => {
    async function fetchRoomActive() {
      try {
        setToTime(to);
        setFromTime(from);
        setValueTime(time);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRoomActive();
  }, [room]);

  const handlePaidSoonCheckinChange = () => {
    setIsPaidSoonCheckin(!isPaidSoonCheckin);
  };

  const handlePaidLateCheckoutChange = () => {
    setIsPaidLateCheckout(!isPaidLateCheckout);
  };

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
      } else if (value === 2) {
        setValueTime(1);
        setFromTime(now.hour(priceDayStart).minute(0));
        setToTime(now.add(1, "day").hour(priceDayEnd).minute(0));
      } else {
        setFromTime(dayjs().hour(priceNightStart).minute(0));
        setToTime(dayjs().add(1, "day").hour(priceNightEnd).minute(0));
        setValueTime(1);
      }
    } else {
      setLateCheckout(0);
      if (value === 1) {
        setToTime(now.add(1, "hour"));
        setValueTime(getPrice(value, fromTime, now.add(1, "hour")).time);
        setSoonCheckin(0);
      } else if (value === 2) {
        setToTime(now.add(1, "day").hour(priceDayEnd).minute(0));
        setValueTime(
          getPrice(
            value,
            fromTime,
            now.add(1, "day").hour(priceDayEnd).minute(0)
          ).time
        );
        if (fromTime.hour() < priceDayStart) {
          setSoonCheckin(priceDayStart - fromTime.hour());
        } else {
          setSoonCheckin(0);
        }
      } else {
        setToTime(toTime.add(1, "day").hour(priceNightEnd).minute(0));
        setValueTime(
          getPrice(
            value,
            fromTime,
            toTime.add(1, "day").hour(priceNightEnd).minute(0)
          ).time
        );
        if (fromTime.hour() < priceNightStart) {
          setSoonCheckin(priceNightStart - fromTime.hour());
        } else {
          setSoonCheckin(0);
        }
        if (fromTime.add(1, "day").hour(priceNightEnd).minute(0) < toTime) {
          setLateCheckout(
            toTime.diff(
              fromTime.add(1, "day").hour(priceNightEnd).minute(0),
              "hour"
            )
          );
        } else {
          setLateCheckout(0);
        }
      }
    }
    setTypeTime(value);
  };

  const handleChangeFromTime = (value) => {
    const priceTime = getPrice(typeTime, value, toTime);
    setValueTime(priceTime.time);
    if (typeTime === 1) {
      setSoonCheckin(0);
      setLateCheckout(0);
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
      setFromTime(value);
    } else {
      if (value.hour() < priceNightStart) {
        setSoonCheckin(priceNightStart - value.hour());
      } else {
        setSoonCheckin(0);
      }
      if (value.add(1, "day").hour(priceNightEnd).minute(0) < toTime) {
        setLateCheckout(
          toTime.diff(value.add(1, "day").hour(priceNightEnd).minute(0), "hour")
        );
      } else {
        setLateCheckout(0);
      }
      setFromTime(value);
    }
  };

  const handleChangeToTime = (value) => {
    const priceTime = getPrice(typeTime, fromTime, value);
    setValueTime(priceTime.time);
    if (typeTime === 1) {
      setSoonCheckin(0);
      setLateCheckout(0);
      setToTime(value);
    } else if (typeTime === 2) {
      setToTime(value);
      if (value.hour() > priceDayEnd) {
        setLateCheckout(value.hour() - priceDayEnd);
      } else {
        setLateCheckout(0);
      }
    } else {
      if (fromTime.add(1, "day").hour(priceNightEnd).minute(0) < value) {
        setLateCheckout(
          value.diff(
            fromTime.add(1, "day").hour(priceNightEnd).minute(0),
            "hour"
          )
        );
      } else {
        setLateCheckout(0);
      }
      setToTime(value);
    }
  };

  function getPrice(typeTime, fromTime, toTime) {
    let price = 0;
    let time = 0;
    if (typeTime === 1) {
      const hoursList = [];
      let currentHour = fromTime;
      while (currentHour.isBefore(toTime)) {
        if (toTime.diff(currentHour, "minute") < timeBonusHour) {
          break;
        }
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
      let currentDay = fromTime.hour(priceDayStart).minute(0);
      if (currentDay.diff(fromTime, "hour") >= timeBonusDay) {
        daysList.push(fromTime);
      }
      while (currentDay.isBefore(toTime.hour(priceDayEnd).minute(0))) {
        daysList.push(currentDay);
        currentDay = currentDay.add(1, "day");
      }
      currentDay = currentDay.hour(priceDayEnd).minute(0);
      if (toTime.diff(currentDay, "hour") >= timeBonusDay) {
        daysList.push(currentDay);
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
        {room.status === "BOOKING" && (
          <input
            type="hidden"
            name={`isBooking${props.index}`}
            defaultValue={true}
          />
        )}
        {room.status === "CHECK_IN" && (
          <input
            type="hidden"
            name={`isCheckin${props.index}`}
            defaultValue={true}
          />
        )}
        {room.status === "CHECK_OUT" && (
          <input
            type="hidden"
            name={`isCheckout${props.index}`}
            defaultValue={true}
          />
        )}
        <input
          type="hidden"
          name={`reservationDetailId${props.index}`}
          value={room.reservationDetailId}
          onChange={() => console.log()}
        />
        <input
          type="hidden"
          name={`roomId${props.index}`}
          value={selectedRoomId}
          onChange={() => console.log()}
        />
        <input
          type="hidden"
          name={`roomName${props.index}`}
          value={room.room.roomName}
          onChange={() => console.log()}
        />
        <input
          type="hidden"
          name={`reservationType${props.index}`}
          value={
            typeTime === 1 ? "HOURLY" : typeTime === 2 ? "DAILY" : "OVERNIGHT"
          }
          onChange={() => console.log()}
        />
        <input
          type="hidden"
          name={`fromTime${props.index}`}
          value={fromTime.format("YYYY-MM-DD HH:mm:ss")}
          onChange={() => console.log()}
        />
        <input
          type="hidden"
          name={`toTime${props.index}`}
          value={toTime.format("YYYY-MM-DD HH:mm:ss")}
          onChange={() => console.log()}
        />
        <div className="flex mb-2">
          <p className="my-auto mr-2">
            {room.room.roomCategory.roomCategoryName}:
          </p>
          <Select
            sx={{ width: 100, height: 40 }}
            value={typeTime}
            onChange={handleSelectRoom}
            disabled={room.status !== "BOOKING"}
          >
            <MenuItem value={1}>Giờ</MenuItem>
            <MenuItem value={2}>Ngày</MenuItem>
            <MenuItem value={3}>Đêm</MenuItem>
          </Select>
          <button
            className="ml-auto rounded-lg px-2 border hover:border-green-500"
            onClick={() => {
              props.handleVisitModalOpen();
            }}
          >
            <i className="fa-solid fa-user-tie ml-2"></i>
            <span className="mx-2">
              {
                props.visitors.filter(
                  (visitor) =>
                    dayjs().diff(dayjs(visitor.customer.dob), "year") >= 16
                ).length
              }
            </span>
            {" | "}
            <i className="fa-solid fa-child ml-2"></i>
            <span className="mx-2">
              {
                props.visitors.filter(
                  (visitor) =>
                    dayjs().diff(dayjs(visitor.customer.dob), "year") < 16
                ).length
              }
            </span>
          </button>
        </div>
        <div className="flex mb-2">
          <p className="text-gray-500 my-auto mr-2">Phòng:</p>
          <Select
            sx={{ width: 160, height: 40 }}
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            disabled={room.status !== "BOOKING"}
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
        <div className="mb-2">
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="vi-VN"
          >
            {room.status === "BOOKING" && (
              <div className="flex">
                <p className="text-gray-500 my-auto mr-2">Dự kiến:</p>
                <div className="pr-2">
                  <DateTimePicker
                    ampm={false}
                    {...(typeTime !== 1 && {
                      shouldDisableTime: (date) => date.minute() % 60 !== 0,
                    })}
                    // shouldDisableDate={isFromDateDisabled}
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
                    {...(typeTime === 1
                      ? {
                          shouldDisableTime: (date) =>
                            fromTime.diff(date, "hour") > -1,
                        }
                      : {
                          shouldDisableTime: (date) => date.minute() % 60 !== 0,
                        })}
                    // shouldDisableDate={isToDateDisabled}
                    shouldDisableTime={(date) =>
                      fromTime.diff(date, "hour") > -1
                    }
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    value={toTime}
                    onChange={handleChangeToTime}
                    format="DD/MM/YYYY HH:mm"
                  />
                </div>
                <div className="bg-gray-200 w-.5 text-center my-auto py-1 px-2 rounded text-gray-500">
                  {valueTime +
                    " " +
                    (typeTime === 1 ? "Giờ" : typeTime === 2 ? "Ngày" : "Đêm")}
                  {(lateCheckout > 0 || soonCheckin > 0) &&
                    " " + (lateCheckout + soonCheckin) + " Giờ"}
                </div>
              </div>
            )}
            {room.status === "CHECK_IN" && (
              <>
                <div className="flex mb-2">
                  <p className="text-gray-500 my-auto mr-2">Dự kiến:</p>
                  <div className="pr-2">
                    <DateTimePicker
                      ampm={false}
                      disabled
                      sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                      value={from}
                      onChange={handleChangeFromTime}
                      format="DD/MM/YYYY HH:mm"
                    />
                  </div>
                  <p className="text-gray-500 my-auto mr-2">đến</p>
                  <div className="pr-2">
                    <DateTimePicker
                      ampm={false}
                      sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                      value={to}
                      onChange={handleChangeToTime}
                      format="DD/MM/YYYY HH:mm"
                    />
                  </div>
                  <div className="bg-gray-200 w-.5 text-center my-auto py-1 px-2 rounded text-gray-500">
                    {valueTime +
                      " " +
                      (typeTime === 1
                        ? "Giờ"
                        : typeTime === 2
                        ? "Ngày"
                        : "Đêm")}
                    {(lateCheckout > 0 || soonCheckin > 0) &&
                      " " + (lateCheckout + soonCheckin) + " Giờ"}
                  </div>
                </div>
                <div className="flex">
                  <p className="text-gray-500 my-auto mr-2">
                    Dùng đến hiện tại:{" "}
                  </p>
                  <p className="text-green-500 my-auto">
                    {typeTime === 1
                      ? `${dayjs().diff(fromTime, "hour")} giờ ${dayjs().diff(
                          fromTime,
                          "minute"
                        ) - dayjs().diff(fromTime, "hour") * 60} phút`
                      : typeTime === 2
                      ? `${dayjs().date() - fromTime.date()} ngày ${
                          dayjs().hour() - fromTime.hour()
                        } giờ`
                      : `${
                          getPrice(typeTime, fromTime, dayjs()).time
                        } đêm ${dayjs().diff(
                          fromTime.add(1, "day").hour(priceNightEnd),
                          "hour"
                        )} giờ`}
                  </p>
                </div>
              </>
            )}
            {room.status === "CHECK_OUT" && (
              <div className="flex">
                <p className="text-gray-500 my-auto mr-2">Thức tế:</p>
                <div className="pr-2">
                  <DateTimePicker
                    ampm={false}
                    disabled
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    defaultValue={dayjs(room.checkInActual)}
                    format="DD/MM/YYYY HH:mm"
                  />
                </div>
                <p className="text-gray-500 my-auto mr-2">đến</p>
                <div className="pr-2">
                  <DateTimePicker
                    ampm={false}
                    disabled
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    defaultValue={dayjs(room.checkOutActual)}
                    format="DD/MM/YYYY HH:mm"
                  />
                </div>
                <div className="bg-gray-200 w-.5 text-center my-auto py-1 px-2 rounded text-gray-500">
                  {valueTime +
                    " " +
                    (typeTime === 1 ? "Giờ" : typeTime === 2 ? "Ngày" : "Đêm")}
                  {(lateCheckout > 0 || soonCheckin > 0) &&
                    " " + (lateCheckout + soonCheckin) + " Giờ"}
                </div>
              </div>
            )}
          </LocalizationProvider>
        </div>
      </div>
      <div className="flex border-t pt-2">
        {soonCheckin > 0 && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isPaidSoonCheckin}
                onChange={handlePaidSoonCheckinChange}
              />
            }
            label="Phụ thu nhận sớm"
          />
        )}
        {lateCheckout > 0 && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isPaidLateCheckout}
                onChange={handlePaidLateCheckoutChange}
              />
            }
            label="Phụ thu trả muộn"
          />
        )}
      </div>
      <div className="flex pt-2">
        <p className="w-8/12">
          {room.room.roomCategory.roomCategoryName} (
          {typeTime === 1 ? "Giờ" : typeTime === 2 ? "Ngày" : "Đêm"})
        </p>
        <p className="w-1/12">{valueTime}</p>
        <p className="w-2/12 text-right">
          {getPrice(typeTime, fromTime, toTime).price.toLocaleString()}
        </p>
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
      {soonCheckin > 0 && isPaidSoonCheckin && (
        <div className="flex pt-2">
          <p className="w-8/12">Phụ thu nhận sớm (Giờ)</p>
          <p className="w-1/12">{soonCheckin}</p>
          <p className="w-2/12 text-right">
            {(soonCheckin * priceSoonCheckIn).toLocaleString()}
          </p>
          <p className="w-1/12"></p>
        </div>
      )}
      {lateCheckout > 0 && isPaidLateCheckout && (
        <div className="flex border-t pt-2">
          <p className="w-8/12">Phụ thu trả muộn (Giờ)</p>
          <p className="w-1/12">{lateCheckout}</p>
          <p className="w-2/12 text-right">
            {(lateCheckout * priceLateCheckOut).toLocaleString()}
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
          timeUsing={timeUsing}
        />
      )}
    </div>
  );
}

export default SelectRoom;
