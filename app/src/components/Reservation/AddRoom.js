import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import { axiosPrivate } from "../../utils/axiosConfig";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Form, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getTimePrice,
  getSoonCheckin,
  getlateCheckout,
} from "../../utils/getTimePrice";

function AddRoom(props) {
  const { timeUsing } = useLoaderData();
  const priceNightStart = timeUsing.startTimeNight.split(":")[0];
  const priceNightEnd = timeUsing.endTimeNight.split(":")[0];
  const priceDayStart = timeUsing.startTimeDay.split(":")[0];
  const priceDayEnd = timeUsing.endTimeDay.split(":")[0];
  const timeBonusDay = timeUsing.timeBonusDay;
  const timeBonusHour = timeUsing.timeBonusHour;
  const [category, setCategory] = useState([]);
  const [listNumber, setListNumber] = useState([]);
  const [openHour, setOpenHour] = useState(false);
  const [openDay, setOpenDay] = useState(true);
  const [openNight, setOpenNight] = useState(false);

  const [typeTime, setTypeTime] = useState(2);
  const [fromTime, setFromTime] = useState(
    dayjs().hour(priceDayStart).minute(0)
  );
  const [toTime, setToTime] = useState(
    dayjs().add(1, "day").hour(priceDayEnd).minute(0)
  );

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axiosPrivate.get(
          "reservation/list-empty-rooms?startDate=" +
            fromTime.format("YYYY-MM-DD HH:mm:ss") +
            "&endDate=" +
            toTime.format("YYYY-MM-DD HH:mm:ss") +
            "&reservationId=" +
            props.reservationId
        );
        if (response.data.result.length > 0) {
          const list = [];
          response.data.result.map((room) => {
            list.push(0);
          });
          setListNumber(list);
        }
        setCategory(response.data.result);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategory();
  }, [typeTime, fromTime, toTime]);

  const listPrice = props.listPrice;

  let time = 0;
  let surchargeTime = 0;
  if (typeTime === 1) {
    time = getTimePrice(1, fromTime, toTime, timeUsing, []).time;
  } else if (typeTime === 2) {
    time = getTimePrice(2, fromTime, toTime, timeUsing, []).time;
    surchargeTime =
      getSoonCheckin(2, fromTime, timeUsing) +
      getlateCheckout(2, fromTime, toTime, timeUsing);
  } else {
    time = getTimePrice(3, fromTime, toTime, timeUsing, []).time;
    surchargeTime =
      getSoonCheckin(3, fromTime, timeUsing) +
      getlateCheckout(3, fromTime, toTime, timeUsing);
  }

  const handleHour = () => {
    setOpenHour(true);
    setOpenDay(false);
    setOpenNight(false);
    setTypeTime(1);
    setFromTime(dayjs());
    setToTime(dayjs().add(1, "hour"));
  };
  const handleDay = () => {
    setOpenHour(false);
    setOpenDay(true);
    setOpenNight(false);
    setTypeTime(2);
    setFromTime(dayjs().hour(priceDayStart).minute(0));
    setToTime(dayjs().add(1, "day").hour(priceDayEnd).minute(0));
  };

  const handleNight = () => {
    setOpenHour(false);
    setOpenDay(false);
    setOpenNight(true);
    setTypeTime(3);
    setFromTime(dayjs().hour(priceNightStart).minute(0));
    setToTime(dayjs().add(1, "day").hour(priceNightEnd).minute(0));
  };

  const handleChangeFromTime = (value) => {
    if (typeTime === 1) {
      setFromTime(value);
      if (value.diff(toTime, "hour") >= 0) {
        setToTime(value.add(1, "hour"));
        time = 1;
      }
    } else if (typeTime === 2) {
      setFromTime(value);
      if (value.diff(toTime, "day") >= 0) {
        setToTime(value.add(1, "day").hour(priceDayEnd).minute(0));
        time = 1;
      }
    } else {
      setFromTime(value);
      if (value.diff(toTime, "hour") > 0) {
        setToTime(value.add(1, "day").hour(priceNightEnd).minute(0));
      }
    }
  };

  const handleChangeToTime = (value) => {
    setToTime(value);
  };

  const handleErrorToTime = (error) => {
    time = 1;
    if (typeTime === 1) {
      setToTime(fromTime.add(1, "hour"));
    } else if (typeTime === 2) {
      setToTime(fromTime.add(1, "day").hour(priceDayEnd));
    } else {
      setToTime(fromTime.add(1, "day").hour(priceNightEnd).minute(0));
    }
  };

  const columns = [
    { field: "roomCategoryName", headerName: "Hạng phòng", width: 150 },
    {
      field: "numberOfPeople",
      headerName: "Sức chứa",
      type: "actions",
      width: 200,
      getActions: (params) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={
              <div>
                <i className="fa-solid fa-user-tie mr-1"></i>
                {row.numberOfPeople.numOfAdults}
                {" | "}
                <i className="fa-solid fa-child mr-1"></i>
                {row.numberOfPeople.numOfChildren}
              </div>
            }
            label="Nhận phòng"
          />,
        ];
      },
    },
    { field: "emptyRoom", headerName: "Còn trống", width: 200 },
    {
      field: "numberOrderRoom",
      headerName: "Số phòng đặt",
      type: "actions",
      width: 200,
      getActions: (params) => {
        const row = params.row;
        const listCateRoomId = row.listRoom.map((cate) => cate.roomId);
        const priceByCate = listPrice.find(
          (details) => details.RoomClass.roomCategoryId === row.roomCategoryId
        ).PriceListDetailWithDayOfWeek;
        return [
          <GridActionsCellItem
            icon={
              <>
                <input
                  type="hidden"
                  name={`listCateRoomId` + row.id}
                  value={listCateRoomId.join("|")}
                />
                <input
                  type="hidden"
                  name={`historyPrice` + row.id}
                  value={
                    getTimePrice(
                      typeTime,
                      fromTime,
                      toTime,
                      timeUsing,
                      priceByCate
                    ).list
                  }
                />
                <input
                  type="number"
                  className="w-32"
                  name={`numberRoom` + row.id}
                  value={listNumber[row.id]}
                  onChange={(e) => {
                    const list = [...listNumber];
                    list[row.id] = Number(e.target.value);
                    setListNumber(list);
                  }}
                />
              </>
            }
            label="Nhận phòng"
          />,
        ];
      },
    },
    {
      field: "price",
      headerName: `Giá ${openHour ? "(Giờ)" : openDay ? "(Ngày)" : "(Đêm)"}`,
      width: 200,
    },
  ];

  let rows = [];
  if (category.length > 0) {
    rows = category.map((cate, index) => {
      let price = 0;
      if (openHour) {
        price = cate.roomClass.priceByHour;
      } else if (openDay) {
        price = cate.roomClass.priceByDay;
      } else {
        price = cate.roomClass.priceByNight;
      }
      return {
        id: index,
        roomCategoryId: cate.roomClass.roomCategoryId,
        roomCategoryName: cate.roomClass.roomCategoryName,
        numberOfPeople: {
          numOfChildren: cate.roomClass.numOfChildren,
          numOfAdults: cate.roomClass.numOfAdults,
        },
        listRoom: cate.listRoom,
        emptyRoom: cate.listRoom.length,
        price: price,
      };
    });
  }

  let check = false;

  if (
    listNumber.some((number) => number < 0) ||
    listNumber.every((number) => number === 0) ||
    category.some((cate, index) => listNumber[index] > cate.listRoom.length)
  ) {
    check = false;
  } else {
    check = true;
  }

  return (
    <Form method="POST" onSubmit={props.onClose}>
      <Modal
        open={props.open}
        onClose={props.onClose}
        size="w-8/12 h-.5/6"
        button={true}
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Chọn phòng</h1>
            <div className="flex">
              <div className="flex w-80 bg-gray-200 rounded-lg text-sm mr-2">
                <div className="w-4/12 m-2">
                  <button
                    type="button"
                    className={`w-full rounded p-1 ${
                      openHour ? "bg-green-500 text-white" : "text-black"
                    }`}
                    onClick={handleHour}
                  >
                    Theo giờ
                  </button>
                </div>
                <div className="w-4/12 m-2">
                  <button
                    type="button"
                    className={`w-full rounded p-1 ${
                      openDay ? "bg-green-500 text-white" : "text-black"
                    }`}
                    onClick={handleDay}
                  >
                    Theo ngày
                  </button>
                </div>
                <div className="w-4/12 m-2">
                  <button
                    type="button"
                    className={`w-full rounded p-1 ${
                      openNight ? "bg-green-500 text-white" : "text-black"
                    }`}
                    onClick={handleNight}
                  >
                    Qua đêm
                  </button>
                </div>
              </div>
              <input type="hidden" name="addRoom" value={true} />
              {props.addReservation && (
                <>
                  <input
                    type="hidden"
                    name="customerId"
                    value={props.customerId}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="priceListId"
                    value={props.priceListId}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="valueTime"
                    value={1}
                    onChange={() => console.log()}
                  />
                </>
              )}
              <input
                type="hidden"
                name="reservationId"
                value={props.reservationId ? props.reservationId : null}
              />
              <input
                type="hidden"
                name="fromTime"
                value={fromTime.format("YYYY-MM-DD HH:mm:ss")}
              />
              <input
                type="hidden"
                name="toTime"
                value={toTime.format("YYYY-MM-DD HH:mm:ss")}
              />
              <input
                type="hidden"
                name="reservationType"
                value={openHour ? "HOURLY" : openDay ? "DAILY" : "OVERNIGHT"}
              />
              <div className="flex text-sm my-auto">
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="vi-VN"
                >
                  <p className="text-gray-500 my-auto mr-2">Dự kiến:</p>
                  <div className="pr-2">
                    <DateTimePicker
                      ampm={false}
                      sx={{
                        ".MuiInputBase-input": {
                          padding: 1,
                          width: 120,
                          fontSize: 14,
                        },
                      }}
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
                      sx={{
                        ".MuiInputBase-input": {
                          padding: 1,
                          width: 120,
                          fontSize: 14,
                        },
                      }}
                      value={toTime}
                      onChange={handleChangeToTime}
                      onError={handleErrorToTime}
                      format="DD/MM/YYYY HH:mm"
                    />
                  </div>
                </LocalizationProvider>
                <div className="bg-gray-200 w-.5 text-center my-auto py-1 px-2 rounded text-gray-500">
                  {time}
                  {typeTime === 1 ? " Giờ" : typeTime === 2 ? " Ngày" : " Đêm"}
                  {surchargeTime > 0 && " " + surchargeTime + " Giờ"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          {category.length > 0 ? (
            <>
              <input type="hidden" name="categories" value={category.length} />
              <DataGrid
                columns={columns}
                rows={rows}
                initialState={{
                  pagination: { paginationModel: { pageSize: 100 } },
                }}
                pageSizeOptions={[100]}
              />
            </>
          ) : (
            <div className="mx-auto">Không còn phòng trống!</div>
          )}
        </div>
        {category.length > 0 && (
          <div className="flex pt-5">
            <div className="ml-auto">
              <button
                type={check ? "" : "button"}
                className="bg-green-500 mr-10 py-2 px-6 text-white rounded hover:bg-green-600"
                onClick={() => {
                  if (!check) {
                    let message = "";
                    if (listNumber.some((number) => number < 0)) {
                      message = "Số phòng đặt không thể âm";
                    } else if (listNumber.every((number) => number === 0)) {
                      message = "Số phòng đặt phải có phòng trên 0";
                    } else if (
                      category.some(
                        (cate, index) =>
                          listNumber[index] > cate.listRoom.length
                      )
                    ) {
                      message = "Số phòng đặt không được quá phòng trống";
                    }
                    Swal.fire({
                      position: "bottom",
                      html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">${message}</button>`,
                      showConfirmButton: false,
                      background: "transparent",
                      backdrop: "none",
                      timer: 2000,
                    });
                  }
                }}
              >
                Lưu
              </button>
              <button
                type="button"
                className="bg-gray-400 py-2 px-6 text-white rounded hover:bg-gray-500"
                onClick={() => props.onClose()}
              >
                Bỏ qua
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Form>
  );
}

export default AddRoom;
