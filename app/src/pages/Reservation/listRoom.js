import { useEffect, useRef, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ReservationLayout from "../ReservationLayout";
import { Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
import { orange, green, grey } from "@mui/material/colors";
import { defer, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import "dayjs/locale/vi";
dayjs.locale("vi");

function ListRoomPage() {
  const { listRoomsBycate } = useLoaderData();
  // console.log(listRoomsBycate);
  const [empty, setEmpty] = useState(false);
  const [order, setOrder] = useState(false);
  const [using, setUsing] = useState(false);
  const [paid, setPaid] = useState(false);

  const [type, setType] = useState(1);
  const [day, setDay] = useState(dayjs());
  const dayRef = useRef(day);

  const listCategories = listRoomsBycate.map((cate) => {
    return {
      id: cate.roomCategory.roomCategoryId,
      title: cate.roomCategory.roomCategoryName,
      children: cate.ListRoom.map((room) => {
        return {
          id: room.roomId,
          title: room.roomName,
          extendedProps: {
            isChild: true,
          },
        };
      }),
    };
  });

  const handleEventChange =
    (dayRef, isResize) =>
    ({ event, oldEvent, revert }) => {
      console.log(event.extendedProps);
      console.log(dayRef);
    };

  const [listReservations, setListReservations] = useState([]);

  useEffect(() => {
    async function fetchList() {
      try {
        if (day.year()) {
          const response = await axiosPrivate.get(
            "reservation-detail/get-by-booking-and-check-in?date=" +
              day.format("YYYY-MM-DD HH:mm:ss")
          );
          if (response) {
            setListReservations(response.data.result);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchList();
  }, [day]);

  // console.log(listReservations);

  const handleEmptyChange = (event) => {
    const checked = event.target.checked;
    setEmpty(checked);
    if (
      (checked && order && using && paid) ||
      (!checked && !order && !using && !paid)
    ) {
    } else {
    }
  };
  const handleOrderChange = (event) => {
    const checked = event.target.checked;
    setOrder(checked);
    if (
      (empty && checked && using && paid) ||
      (!empty && !checked && !using && !paid)
    ) {
    } else {
    }
  };
  const handleUsingChange = (event) => {
    const checked = event.target.checked;
    setUsing(checked);
    if (
      (empty && order && checked && paid) ||
      (!empty && !order && !checked && !paid)
    ) {
    } else {
    }
  };
  const handlePaidChange = (event) => {
    const checked = event.target.checked;
    setPaid(checked);
    if (
      (empty && order && using && checked) ||
      (!empty && !order && !using && !checked)
    ) {
    } else {
    }
  };

  const handleErrorDay = () => {
    setDay(dayjs());
  };

  return (
    <div className="h-full px-4 mx-auto mt-2">
      <div className="flex">
        <div>
          <FormControlLabel
            value="end"
            control={<Checkbox checked={empty} onChange={handleEmptyChange} />}
            label="Phòng trống"
            labelPlacement="end"
          />
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                checked={order}
                onChange={handleOrderChange}
                sx={{
                  color: orange[800],
                  "&.Mui-checked": {
                    color: orange[600],
                  },
                }}
              />
            }
            label="Phòng sắp đến"
            labelPlacement="end"
          />
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                checked={using}
                onChange={handleUsingChange}
                sx={{
                  color: green[800],
                  "&.Mui-checked": {
                    color: green[600],
                  },
                }}
              />
            }
            label="Đang sử dụng"
            labelPlacement="end"
          />
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                checked={paid}
                onChange={handlePaidChange}
                sx={{
                  color: green[800],
                  "&.Mui-checked": {
                    color: green[600],
                  },
                }}
              />
            }
            label="Phòng sắp trả"
            labelPlacement="end"
          />
        </div>
        <div className="ml-auto">
          <Select
            sx={{ mr: 2, minWidth: 120, background: "white" }}
            size="small"
            value={type}
            onChange={(event) => {
              const value = event.target.value;
              setType(value);
              if (day.year()) {
                if (value === 1) {
                  dayRef.current.getApi().gotoDate(day.toDate());
                } else if (value === 2) {
                  dayRef.current.getApi().gotoDate(day.toDate());
                } else {
                  dayRef.current.getApi().gotoDate(day.toDate());
                }
              }
            }}
          >
            <MenuItem value={1}>Ngày</MenuItem>
            <MenuItem value={2}>Tuần</MenuItem>
            <MenuItem value={3}>Tháng</MenuItem>
          </Select>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="vi-VN"
          >
            {type === 1 && (
              <>
                <button
                  type="button"
                  className="px-4 py-2 bg-white rounded-tl rounded-bl"
                  onClick={() => {
                    setDay(day.add(-1, "day"));
                    dayRef.current.getApi().prev();
                  }}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <DatePicker
                  sx={{
                    ".MuiInputBase-input": {
                      padding: 1,
                      width: 180,
                      border: 0,
                      background: "white",
                    },
                  }}
                  value={day}
                  onChange={(value) => {
                    setDay(value);
                    if (value.year()) {
                      dayRef.current.getApi().gotoDate(value.toDate());
                    }
                  }}
                  onError={handleErrorDay}
                  size="small"
                  format="dddd, DD/MM/YYYY"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-white rounded-tr rounded-br"
                  onClick={() => {
                    setDay(day.add(1, "day"));
                    dayRef.current.getApi().next();
                  }}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </>
            )}
            {type === 2 && (
              <>
                <button
                  type="button"
                  className="px-4 py-2 bg-white rounded-tl rounded-bl"
                  onClick={() => {
                    setDay(day.add(-1, "week"));
                    dayRef.current
                      .getApi()
                      .gotoDate(day.add(-1, "week").toDate());
                  }}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <DatePicker
                  sx={{
                    ".MuiInputBase-input": {
                      padding: 1,
                      width: 200,
                      border: 0,
                      background: "white",
                    },
                  }}
                  value={day}
                  onChange={(value) => {
                    setDay(value);
                    if (value.year()) {
                      dayRef.current.getApi().gotoDate(value.toDate());
                    }
                  }}
                  onError={handleErrorDay}
                  size="small"
                  format={`${day.startOf("week").format("DD/MM/YYYY")} - ${day
                    .endOf("week")
                    .format("DD/MM/YYYY")}     HH`}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-white rounded-tr rounded-br"
                  onClick={() => {
                    setDay(day.add(1, "week"));
                    dayRef.current
                      .getApi()
                      .gotoDate(day.add(1, "week").toDate());
                  }}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </>
            )}
            {type === 3 && (
              <>
                <button
                  type="button"
                  className="px-4 py-2 bg-white rounded-tl rounded-bl"
                  onClick={() => {
                    setDay(day.add(-1, "M"));
                    dayRef.current.getApi().gotoDate(day.add(-1, "M").toDate());
                  }}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <DatePicker
                  sx={{
                    ".MuiInputBase-input": {
                      padding: 1,
                      width: 100,
                      border: 0,
                      background: "white",
                    },
                  }}
                  views={["month", "year"]}
                  value={day}
                  onChange={(value) => {
                    setDay(value);
                    if (value.year()) {
                      dayRef.current.getApi().gotoDate(value.toDate());
                    }
                  }}
                  onError={handleErrorDay}
                  size="small"
                  format="MM/YYYY"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-white rounded-tr rounded-br"
                  onClick={() => {
                    setDay(day.add(1, "M"));
                    dayRef.current.getApi().gotoDate(day.add(1, "M").toDate());
                  }}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </>
            )}
          </LocalizationProvider>
        </div>
      </div>
      <ReservationLayout isActive={false} />
      <FullCalendar
        ref={dayRef}
        plugins={[resourceTimelinePlugin, interactionPlugin]}
        resourceAreaHeaderContent=""
        resourceLabelContent={(args) => {
          const isChildResource = args.resource.extendedProps.isChild;
          if (isChildResource) {
            let room = null;
            listRoomsBycate.map((cate) => {
              const findRoom = cate.ListRoom.find(
                (room) => room.roomId === args.resource.id
              );
              if (findRoom) {
                room = findRoom;
                return;
              }
            });
            const clean =
              room.conditionStatus === "ROOM_CLEAN"
                ? `<button type="button" class="mr-2 text-green-500"><i class="fa-solid fa-spray-can-sparkles"></i></button>`
                : `<button type="button" class="mr-2 text-red-500"><i class="fa-solid fa-broom"></i></button>`;
            return {
              html: `<div class="ml-5">${clean}${args.resource.title}</div>`,
            };
          } else {
            return {
              html: `${args.resource.title}`,
            };
          }
        }}
        height={600}
        initialView="resourceTimeline"
        headerToolbar={false}
        slotDuration={type === 1 ? { hours: 1 } : { days: 1 }}
        duration={
          type === 1 ? { days: 1 } : type === 2 ? { weeks: 1 } : { months: 1 }
        }
        slotLabelFormat={
          type === 1
            ? [{ hour: "2-digit" }]
            : type === 2
            ? [{ day: "2-digit" }]
            : [{ day: "2-digit" }]
        }
        resources={listCategories}
        eventResize={handleEventChange(dayRef, true)}
        // editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        locale={viLocale}
      />
    </div>
  );
}

export default ListRoomPage;

async function loadListRooms() {
  const response = await axiosPrivate.get("room-class");
  if (response.data) {
    return response.data;
  } else {
    return redirect("/login");
  }
}

export async function loader() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  Swal.fire({
    didOpen: () => {
      Swal.showLoading();
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    background: "transparent",
  });
  try {
    const listRoomsBycate = await loadListRooms();
    return defer(
      {
        listRoomsBycate,
      },
      Swal.close()
    );
  } catch (error) {
    Swal.close();
    window.location.href = "/error";
    return;
  }
}
