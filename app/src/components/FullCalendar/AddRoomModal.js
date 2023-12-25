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
import { MenuItem, Select } from "@mui/material";
import { axiosPrivate } from "../../utils/axiosConfig";

function AddRoomModal(props) {
  const { timeUsing, prices, categories } = useLoaderData();
  const priceNightStart = timeUsing.startTimeNight.split(":")[0];
  const priceNightEnd = timeUsing.endTimeNight.split(":")[0];
  const priceDayStart = timeUsing.startTimeDay.split(":")[0];
  const priceDayEnd = timeUsing.endTimeDay.split(":")[0];
  const timeBonusDay = timeUsing.timeBonusDay;
  const timeBonusHour = timeUsing.timeBonusHour;
  const roomInfo = props.roomInfo;
  const room = roomInfo.resource.extendedProps.data;
  //   console.log(roomInfo);
  //   console.log(room);
  const type = props.type;
  let fromDate = dayjs(roomInfo.startStr);
  let toDate = dayjs(roomInfo.endStr);
  let defaultTypeTime = 1;
  if (type !== 1) {
    defaultTypeTime = 2;
    fromDate = fromDate.hour(priceDayStart);
    toDate = toDate.hour(priceDayEnd);
  }
  const [typeTime, setTypeTime] = useState(defaultTypeTime);
  const [fromTime, setFromTime] = useState(fromDate);
  const [toTime, setToTime] = useState(toDate);
  const [checkDuplicate, setCheckDuplicate] = useState(false);
  useEffect(() => {
    async function fetchCheck() {
      const check = await axiosPrivate.get(
        "reservation-detail/check-duplicate-booking?start=" +
          fromTime.format("YYYY-MM-DD HH:mm:ss") +
          "&end=" +
          toTime.format("YYYY-MM-DD HH:mm:ss") +
          "&roomId=" +
          room.roomId
      );
      setCheckDuplicate(!check.data.success);
    }
    fetchCheck();
  }, [fromTime, toTime]);

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
    (price) => price.PriceList.priceListId === "BG000000"
  );
  const listPrice = priceById.ListPriceListDetail.find(
    (details) =>
      details.RoomClass.roomCategoryId === room.roomCategory.roomCategoryId
  ).PriceListDetailWithDayOfWeek;
  let time = 0;
  let listPricesRoom = [];
  let surchargeTime = 0;
  if (typeTime === 1) {
    let timePrice = getTimePrice(1, fromTime, toTime, timeUsing, listPrice);
    time = timePrice.time;
    listPricesRoom = timePrice.list;
  } else if (typeTime === 2) {
    let timePrice = getTimePrice(2, fromTime, toTime, timeUsing, listPrice);
    time = timePrice.time;
    listPricesRoom = timePrice.list;
    surchargeTime += getSoonCheckin(2, fromTime, timeUsing);
    surchargeTime += getlateCheckout(2, fromTime, toTime, timeUsing);
  } else {
    let timePrice = getTimePrice(3, fromTime, toTime, timeUsing, listPrice);
    time = timePrice.time;
    listPricesRoom = timePrice.list;
    surchargeTime += getSoonCheckin(3, fromTime, timeUsing);
    surchargeTime += getlateCheckout(3, fromTime, toTime, timeUsing);
  }
  const handleTypeTimeChange = (e) => {
    const value = e.target.value;
    setTypeTime(value);
    if (value === 1) {
      setFromTime(dayjs());
      setToTime(dayjs().add(1, "hour"));
    } else if (value === 2) {
      setFromTime(dayjs().hour(priceDayStart).minute(0));
      setToTime(dayjs().add(1, "day").hour(priceDayEnd).minute(0));
    } else {
      setFromTime(dayjs().hour(priceNightStart).minute(0));
      setToTime(dayjs().add(1, "day").hour(priceNightEnd).minute(0));
    }
  };

  const handleErrorToTime = (error) => {
    if (typeTime === 1) {
      setToTime(fromTime.add(1, "hour"));
    } else if (typeTime === 2) {
      setToTime(fromTime.add(1, "day").hour(priceDayEnd).minute(0));
    } else {
      setToTime(fromTime.add(1, "day").hour(priceNightEnd).minute(0));
    }
  };
  return (
    <Form
      method="PUT"
      onSubmit={() => {
        props.onClose();
      }}
    >
      <Modal
        open={props.open}
        onClose={props.onClose}
        button={true}
        size="w-9/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Đặt phòng mới</h1>
            <input type="hidden" name="addRoom" defaultValue={true} />
            <input type="hidden" name="roomId" defaultValue={room.roomId} />
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
              name="reservationType"
              value={
                typeTime === 1
                  ? "HOURLY"
                  : typeTime === 2
                  ? "DAILY"
                  : "OVERNIGHT"
              }
              onChange={() => console.log()}
            />
            <input
              type="hidden"
              name="historyPrice"
              value={listPricesRoom}
              onChange={() => console.log()}
            />
          </div>
          <table className="text-center min-w-full border border-gray-300 divide-y divide-gray-300">
            <thead>
              <tr className="bg-green-100">
                <td className="py-2 w-2/12">Hạng phòng</td>
                <td className="py-2 w-1/12">Phòng</td>
                <td className="py-2 w-2/12">Hình thức</td>
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
                    onClick={() => {
                      if (typeTime === 2) {
                        setFromTime(fromTime.hour(priceDayStart).minute(0));
                        setToTime(toTime.hour(priceDayEnd).minute(0));
                      } else if (typeTime === 3) {
                        setFromTime(fromTime.hour(priceNightStart).minute(0));
                        setToTime(
                          fromTime.add(1, "day").hour(priceNightEnd).minute(0)
                        );
                      }
                    }}
                  >
                    Quy định
                  </button>
                </td>
                <td className="py-2 w-1/12">Thời gian</td>
                <td className="py-2 w-3/12">Trả</td>
              </tr>
            </thead>
            <tbody>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="vi-VN"
              >
                <tr>
                  <td className="py-2 w-2/12">
                    {room.roomCategory.roomCategoryName}
                  </td>
                  <td className="py-2 w-1/12">{room.roomName}</td>
                  <td className="py-2 w-2/12">
                    <Select
                      sx={{ ".MuiInputBase-input": { padding: 1, width: 50 } }}
                      value={typeTime}
                      onChange={handleTypeTimeChange}
                    >
                      <MenuItem value={1}>Giờ</MenuItem>
                      <MenuItem value={2}>Ngày</MenuItem>
                      <MenuItem value={3}>Đêm</MenuItem>
                    </Select>
                  </td>
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
                      format="DD/MM/YYYY HH:mm"
                    />
                  </td>
                  <td className="py-2 w-1/12 text-green-600">
                    {time}
                    {typeTime === 1
                      ? " Giờ"
                      : typeTime === 2
                      ? " Ngày"
                      : " Đêm"}
                    {surchargeTime > 0 && " " + surchargeTime + " Giờ"}
                  </td>
                  <td className="py-2 w-3/12">
                    <DateTimePicker
                      ampm={false}
                      {...(typeTime !== 1
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
              type={checkDuplicate ? "button" : ""}
              className="bg-orange-500 py-2 px-6 mr-2 text-white rounded hover:bg-orange-600"
              onClick={() => {
                if (checkDuplicate) {
                  Swal.fire({
                    position: "bottom",
                    html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Phòng bị trùng lịch</button>`,
                    showConfirmButton: false,
                    background: "transparent",
                    backdrop: "none",
                    timer: 2500,
                  });
                }
              }}
            >
              Đặt trước
            </button>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default AddRoomModal;
