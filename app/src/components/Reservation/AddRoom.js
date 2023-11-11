import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import { axiosPrivate } from "../../utils/axiosConfig";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { name } from "dayjs/locale/vi";
import { Form } from "react-router-dom";

function AddRoom(props) {
  const [category, setCategory] = useState([]);
  const [openHour, setOpenHour] = useState(false);
  const [openDay, setOpenDay] = useState(true);
  const [openNight, setOpenNight] = useState(false);

  const priceNightStart = 22;
  const priceNightEnd = 11;
  const priceDayStart = 14;
  const priceDayEnd = 12;
  let from = dayjs();
  let to = dayjs();
  let time = 1;
  let lateCheckOut = 0;
  let soonCheckIn = 0;
  if (openHour) {
    to = to.add(1, "hour");
    time = 1;
  } else if (openDay) {
    from = from.hour(priceDayStart).minute(0);
    to = to.add(1, "day").hour(priceDayEnd).minute(0);
    time = 1;
  } else {
    from = from.hour(priceNightStart).minute(0);
    to = to.add(1, "day").hour(priceNightEnd).minute(0);
    time = 1;
  }
  const [typeTime, setTypeTime] = useState(2);
  const [valueTime, setValueTime] = useState(time);
  const [fromTime, setFromTime] = useState(from);
  const [toTime, setToTime] = useState(to);
  const [lateCheckout, setLateCheckout] = useState(lateCheckOut);
  const [soonCheckin, setSoonCheckin] = useState(soonCheckIn);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axiosPrivate.get(
          "reservation/list-empty-rooms?startDate=" +
            dayjs()
              .hour(priceDayStart)
              .minute(0)
              .format("YYYY-MM-DD HH:mm:ss") +
            "&endDate=" +
            dayjs()
              .add(1, "day")
              .hour(priceDayEnd)
              .minute(0)
              .format("YYYY-MM-DD HH:mm:ss")
        );
        setCategory(response.data.result);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategory();
  }, []);

  console.log(category);

  const handleHour = async () => {
    setOpenHour(true);
    setOpenDay(false);
    setOpenNight(false);
    setTypeTime(1);
    setValueTime(1);
    setSoonCheckin(0);
    setLateCheckout(0);
    setFromTime(dayjs());
    setToTime(dayjs().add(1, "hour"));
    const response = await axiosPrivate.get(
      "reservation/list-empty-rooms?startDate=" +
        dayjs().format("YYYY-MM-DD HH:mm:ss") +
        "&endDate=" +
        dayjs().add(1, "hour").format("YYYY-MM-DD HH:mm:ss")
    );
    setCategory(response.data.result);
  };

  const handleDay = async () => {
    setOpenHour(false);
    setOpenDay(true);
    setOpenNight(false);
    setTypeTime(2);
    setValueTime(1);
    setSoonCheckin(0);
    setLateCheckout(0);
    setFromTime(dayjs().hour(priceDayStart).minute(0));
    setToTime(dayjs().add(1, "day").hour(priceDayEnd).minute(0));
    const response = await axiosPrivate.get(
      "reservation/list-empty-rooms?startDate=" +
        dayjs().hour(priceDayStart).minute(0).format("YYYY-MM-DD HH:mm:ss") +
        "&endDate=" +
        dayjs()
          .add(1, "day")
          .hour(priceDayEnd)
          .minute(0)
          .format("YYYY-MM-DD HH:mm:ss")
    );
    setCategory(response.data.result);
  };

  const handleNight = async () => {
    setOpenHour(false);
    setOpenDay(false);
    setOpenNight(true);
    setTypeTime(3);
    setSoonCheckin(0);
    setLateCheckout(0);
    setFromTime(dayjs().hour(priceNightStart).minute(0));
    setToTime(dayjs().add(1, "day").hour(priceNightEnd).minute(0));
    setValueTime(1);
    const response = await axiosPrivate.get(
      "reservation/list-empty-rooms?startDate=" +
        dayjs().hour(priceNightStart).minute(0).format("YYYY-MM-DD HH:mm:ss") +
        "&endDate=" +
        dayjs()
          .add(1, "day")
          .hour(priceNightEnd)
          .minute(0)
          .format("YYYY-MM-DD HH:mm:ss")
    );
    setCategory(response.data.result);
  };

  const handleChangeFromTime = async (value) => {
    const response = await axiosPrivate.get(
      "reservation/list-empty-rooms?startDate=" +
        value.format("YYYY-MM-DD HH:mm:ss") +
        "&endDate=" +
        toTime.format("YYYY-MM-DD HH:mm:ss")
    );
    setCategory(response.data.result);
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
      setFromTime(value);
    }
  };

  const handleChangeToTime = async (value) => {
    const response = await axiosPrivate.get(
      "reservation/list-empty-rooms?startDate=" +
        fromTime.format("YYYY-MM-DD HH:mm:ss") +
        "&endDate=" +
        value.format("YYYY-MM-DD HH:mm:ss")
    );
    setCategory(response.data.result);
    const priceTime = getPrice(typeTime, fromTime, value);
    setValueTime(priceTime.time);
    if (typeTime === 1) {
      setToTime(value);
    } else if (typeTime === 2) {
      setToTime(value);
      if (value.hour() > priceDayEnd) {
        setLateCheckout(value.hour() - priceDayEnd);
      } else {
        setLateCheckout(0);
      }
    } else {
      if (value.hour() > priceNightEnd) {
        setLateCheckout(value.hour() - priceNightEnd);
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
        hoursList.push(currentHour);
        currentHour = currentHour.add(1, "hour");
      }
      time = hoursList.length;
    } else if (typeTime === 2) {
      const daysList = [];
      let currentHour = fromTime;
      while (currentHour.date() < toTime.date()) {
        daysList.push(currentHour);
        currentHour = currentHour.add(1, "day");
      }
      time = daysList.length;
    } else {
      time = 1;
    }
    return {
      time: time,
    };
  }

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
                  name={`price` + row.id}
                  value={row.price}
                />
                <input
                  type="number"
                  name={`numberRoom` + row.id}
                  defaultValue={0}
                  min={0}
                  max={row.emptyRoom}
                  className="w-32"
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

  return (
    <Form method="POST" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-8/12 h-.5/6">
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
              <input
                type="hidden"
                name="reservationId"
                value={props.reservationId}
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
                  {openHour && (
                    <>
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
                          sx={{
                            ".MuiInputBase-input": {
                              padding: 1,
                              width: 120,
                              fontSize: 14,
                            },
                          }}
                          value={toTime}
                          onChange={handleChangeToTime}
                          format="DD/MM/YYYY HH:mm"
                        />
                      </div>
                    </>
                  )}
                  {openDay && (
                    <>
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
                          sx={{
                            ".MuiInputBase-input": {
                              padding: 1,
                              width: 120,
                              fontSize: 14,
                            },
                          }}
                          value={toTime}
                          onChange={handleChangeToTime}
                          format="DD/MM/YYYY HH:mm"
                        />
                      </div>
                    </>
                  )}
                  {openNight && (
                    <>
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
                          sx={{
                            ".MuiInputBase-input": {
                              padding: 1,
                              width: 120,
                              fontSize: 14,
                            },
                          }}
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
                    (openHour ? "Giờ" : openDay ? "Ngày" : "Đêm")}
                  {(lateCheckout > 0 || soonCheckin > 0) &&
                    " " + (lateCheckout + soonCheckin) + " Giờ"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          {category.length > 0 && (
            <>
              <input type="hidden" name="categories" value={category.length} />
              <DataGrid
                columns={columns}
                rows={rows}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 25]}
              />
            </>
          )}
        </div>
      </Modal>
    </Form>
  );
}

export default AddRoom;