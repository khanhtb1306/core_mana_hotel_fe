import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import DetailsPriceInRoom from "./DetailsPriceInRoom";
import {
  getTimePrice,
  getSoonCheckin,
  getlateCheckout,
} from "../../utils/getTimePrice";
import { axiosPrivate } from "../../utils/axiosConfig";
// require("dayjs/locale/vi");

function SelectRoom(props) {
  const { categories, timeUsing } = useLoaderData();
  // console.log(props.price);
  // console.log(timeUsing);
  const priceNightStart = timeUsing.startTimeNight.split(":")[0];
  const priceNightEnd = timeUsing.endTimeNight.split(":")[0];
  const priceDayStart = timeUsing.startTimeDay.split(":")[0];
  const priceDayEnd = timeUsing.endTimeDay.split(":")[0];
  const timeBonusDay = timeUsing.timeBonusDay;
  const timeBonusHour = timeUsing.timeBonusHour;
  const room = props.room;
  // console.log(room);
  const listRoomIdByRes = props.listRoomByRes.map((r) => r.room.roomId);
  const listRoomsByCate = categories.find(
    (cate) =>
      cate.roomCategory.roomCategoryId === room.room.roomCategory.roomCategoryId
  );
  // console.log(props.price);

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
    time = getTimePrice(type, from, to, timeUsing, props.price).time;
    defaultPrice = getTimePrice(type, from, to, timeUsing, props.price).price;
  } else if (room.reservationType === "DAILY") {
    type = 2;
    time = getTimePrice(type, from, to, timeUsing, props.price).time;
    defaultPrice = getTimePrice(type, from, to, timeUsing, props.price).price;
    soonCheckIn = getSoonCheckin(type, from, timeUsing);
    lateCheckOut = getlateCheckout(type, from, to, timeUsing);
  } else {
    type = 3;
    time = getTimePrice(type, from, to, timeUsing, props.price).time;
    soonCheckIn = getSoonCheckin(type, from, timeUsing);
    lateCheckOut = getlateCheckout(type, from, to, timeUsing);
  }
  const [typeTime, setTypeTime] = useState(type);
  const [valueTime, setValueTime] = useState(time);
  const [fromTime, setFromTime] = useState(from);
  const [toTime, setToTime] = useState(to);
  const [lateCheckout, setLateCheckout] = useState(lateCheckOut);
  const [soonCheckin, setSoonCheckin] = useState(soonCheckIn);
  const [isPaidSoonCheckin, setIsPaidSoonCheckin] = useState(null);
  const [isPaidLateCheckout, setIsPaidLateCheckout] = useState(null);
  const [priceSoon, setPriceSoon] = useState(0);
  const [priceLate, setPriceLate] = useState(0);
  useEffect(() => {
    async function fetchRoomActive() {
      try {
        const isSoonCheckin = await axiosPrivate.get(
          `reservation/get_control_policy_by_reservation_detail?reservationDetailId=${room.reservationDetailId}&policyName=EARLIER_OVERTIME_SURCHARGE`
        );
        const isLateCheckout = await axiosPrivate.get(
          `reservation/get_control_policy_by_reservation_detail?reservationDetailId=${room.reservationDetailId}&policyName=LATER_OVERTIME_SURCHARGE`
        );
        if (isSoonCheckin.data.success && isSoonCheckin.data.result) {
          setIsPaidSoonCheckin(isSoonCheckin.data.result.status);
        }
        if (isLateCheckout.data.success && isLateCheckout.data.result) {
          setIsPaidLateCheckout(isLateCheckout.data.result.status);
        }
        setToTime(to);
        setFromTime(from);
        setValueTime(time);
        setSoonCheckin(soonCheckIn);
        setLateCheckout(lateCheckOut);
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
        setValueTime(
          getTimePrice(
            value,
            fromTime,
            now.add(1, "hour"),
            timeUsing,
            props.price
          ).time
        );
        setSoonCheckin(0);
      } else if (value === 2) {
        setToTime(now.add(1, "day").hour(priceDayEnd).minute(0));
        setValueTime(
          getTimePrice(
            value,
            fromTime,
            now.add(1, "day").hour(priceDayEnd).minute(0),
            timeUsing,
            props.price
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
          getTimePrice(
            value,
            fromTime,
            toTime.add(1, "day").hour(priceNightEnd).minute(0),
            timeUsing
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
    const priceTime = getTimePrice(
      typeTime,
      value,
      toTime,
      timeUsing,
      props.price
    );
    setValueTime(priceTime.time);
    setFromTime(value);
    if (typeTime === 1) {
      setSoonCheckin(0);
      setLateCheckout(0);
      if (value.diff(toTime, "hour") >= 0) {
        setToTime(value.add(1, "hour"));
        setValueTime(1);
      }
    } else if (typeTime === 2) {
      if (value.diff(toTime, "day") >= 0) {
        setToTime(value.add(1, "day").hour(priceDayEnd).minute(0));
        setValueTime(1);
        setLateCheckout(0);
      }
      setSoonCheckin(getSoonCheckin(typeTime, value, timeUsing));
    } else {
      setSoonCheckin(getSoonCheckin(typeTime, value, timeUsing));
      setLateCheckout(getlateCheckout(typeTime, value, toTime, timeUsing));
      if (value.diff(toTime, "hour") > 0) {
        setToTime(value.add(1, "day").hour(priceNightEnd).minute(0));
        setLateCheckout(0);
      }
    }
  };

  const handleChangeToTime = (value) => {
    const priceTime = getTimePrice(
      typeTime,
      fromTime,
      value,
      timeUsing,
      props.price
    );
    setValueTime(priceTime.time);
    setToTime(value);
    if (typeTime === 1) {
      setSoonCheckin(0);
      setLateCheckout(0);
    } else if (typeTime === 2) {
      setLateCheckout(getlateCheckout(typeTime, fromTime, value, timeUsing));
    } else {
      setLateCheckout(getlateCheckout(typeTime, fromTime, value, timeUsing));
    }
  };

  const handleErrorToTime = (error) => {
    if (typeTime === 1) {
      setValueTime(1);
      setToTime(fromTime.add(1, "hour"));
    } else if (typeTime === 2) {
      let plusHour = fromTime.hour(priceDayStart).diff(fromTime, "hour");
      if (fromTime.minute() > timeBonusHour) {
        plusHour -= 1;
      }
      if (fromTime.hour() <= priceDayStart && plusHour < timeBonusDay) {
        setSoonCheckin(plusHour);
      } else {
        setSoonCheckin(0);
      }
      if (plusHour < timeBonusDay) {
        setValueTime(1);
      } else {
        setValueTime(2);
      }
      setLateCheckout(0);
      setToTime(fromTime.add(1, "day").hour(priceDayEnd));
    } else {
      setToTime(fromTime.add(1, "day").hour(priceNightEnd).minute(0));
      setLateCheckout(0);
    }
  };

  useEffect(() => {
    async function fetchSoonSurchange() {
      try {
        if (soonCheckin > 0 && isPaidSoonCheckin !== null) {
          const roomPrice =
            typeTime === 1
              ? room.room.roomCategory.priceByHour
              : typeTime === 2
              ? room.room.roomCategory.priceByDay
              : room.room.roomCategory.priceByNight;
          const response = await axiosPrivate.get(
            `reservation/calculate-early-surcharge?reservationDetailId=${room.reservationDetailId}&roomCategoryId=${room.room.roomCategory.roomCategoryId}&lateTime=${soonCheckin}&roomPrice=${roomPrice}&status=${isPaidSoonCheckin}`
          );
          if (response.data.success) {
            setPriceSoon(response.data.result);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchSoonSurchange();
  }, [soonCheckin, isPaidSoonCheckin]);

  useEffect(() => {
    async function fetchLateSurchange() {
      try {
        if (lateCheckout > 0 && isPaidLateCheckout !== null) {
          const roomPrice =
            typeTime === 1
              ? room.room.roomCategory.priceByHour
              : typeTime === 2
              ? room.room.roomCategory.priceByDay
              : room.room.roomCategory.priceByNight;
          const response = await axiosPrivate.get(
            `reservation/calculate-late-surcharge?reservationDetailId=${room.reservationDetailId}&roomCategoryId=${room.room.roomCategory.roomCategoryId}&lateTime=${lateCheckout}&roomPrice=${roomPrice}&status=${isPaidLateCheckout}`
          );
          if (response.data.success) {
            setPriceLate(response.data.result);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchLateSurchange();
  }, [lateCheckout, isPaidLateCheckout]);

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
          name={`price${props.index}`}
          value={
            getTimePrice(typeTime, fromTime, toTime, timeUsing, props.price)
              .price
          }
          onChange={() => console.log()}
        />
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
                          minDateTime: fromTime.add(1, "hour"),
                        }
                      : {
                          minDate: fromTime.add(1, "day"),
                        })}
                    sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                    value={toTime}
                    onChange={handleChangeToTime}
                    onError={handleErrorToTime}
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
                            minDateTime: fromTime.add(1, "hour"),
                          }
                        : {
                            minDate: fromTime.add(1, "day"),
                          })}
                      sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                      value={toTime}
                      onChange={handleChangeToTime}
                      onError={handleErrorToTime}
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
                      ? `${dayjs().diff(fromTime, "hour")} giờ ${
                          dayjs().diff(fromTime, "minute") -
                          dayjs().diff(fromTime, "hour") * 60
                        } phút`
                      : typeTime === 2
                      ? `${dayjs().diff(
                          fromTime.hour(priceDayStart),
                          "day"
                        )} ngày ${dayjs().diff(
                          fromTime.add(
                            dayjs().diff(fromTime.hour(priceDayStart), "day"),
                            "day"
                          ),
                          "hour"
                        )} giờ`
                      : dayjs().diff(
                          fromTime.add(1, "day").hour(priceNightEnd),
                          "hour"
                        ) > 0
                      ? `${
                          getTimePrice(
                            typeTime,
                            fromTime,
                            dayjs(),
                            timeUsing,
                            props.price
                          ).time
                        } đêm ${dayjs().diff(
                          fromTime.add(1, "day").hour(priceNightEnd),
                          "hour"
                        )} giờ`
                      : `${dayjs().diff(fromTime, "hour")} giờ`}
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
      {room.status !== "CHECK_OUT" && (
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
      )}
      <div className="flex pt-2">
        <p className="w-8/12">
          {room.room.roomCategory.roomCategoryName} (
          {typeTime === 1 ? "Giờ" : typeTime === 2 ? "Ngày" : "Đêm"})
        </p>
        <p className="w-1/12">{valueTime}</p>
        <p className="w-2/12 text-right">
          {getTimePrice(
            typeTime,
            fromTime,
            toTime,
            timeUsing,
            props.price
          ).price.toLocaleString()}
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
          <p className="w-2/12 text-right">{priceSoon.toLocaleString()}</p>
          <p className="w-1/12"></p>
        </div>
      )}
      {lateCheckout > 0 && isPaidLateCheckout && (
        <div className="flex border-t pt-2">
          <p className="w-8/12">Phụ thu trả muộn (Giờ)</p>
          <p className="w-1/12">{lateCheckout}</p>
          <p className="w-2/12 text-right">{priceLate.toLocaleString()}</p>
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
