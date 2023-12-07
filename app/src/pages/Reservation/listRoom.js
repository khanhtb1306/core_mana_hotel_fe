import { useEffect, useRef, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ReservationLayout from "../ReservationLayout";
import { Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
import { orange, green, grey } from "@mui/material/colors";
import {
  defer,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import "dayjs/locale/vi";
import ViewDetailsModal from "../../components/FullCalendar/ViewDetailsModal";
import CleanRoomModal from "../../components/FullCalendar/CleanRoomModal";
dayjs.locale("vi");

function ListRoomPage() {
  const { listRoomsBycate } = useLoaderData();
  const actionData = useActionData();
  // console.log(listRoomsBycate);
  const [empty, setEmpty] = useState(false);
  const [order, setOrder] = useState(false);
  const [using, setUsing] = useState(false);
  const [paid, setPaid] = useState(false);

  const [type, setType] = useState(2);
  const [day, setDay] = useState(dayjs());
  const dayRef = useRef(day);
  const [listReservations, setListReservations] = useState([]);
  const [selectedDetailsId, setSelectedDetailsId] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openCleanModal, setOpenCleanModal] = useState(false);

  useEffect(() => {
    async function fetchList() {
      try {
        if (day.year()) {
          if (type === 1) {
            const response = await axiosPrivate.get(
              "reservation-detail/get-by-date?start=" +
                day.startOf("date").format("YYYY-MM-DD HH:mm:ss") +
                "&end=" +
                day.endOf("date").format("YYYY-MM-DD HH:mm:ss")
            );
            if (response) {
              setListReservations(response.data.result);
            }
          } else if (type === 2) {
            const response = await axiosPrivate.get(
              "reservation-detail/get-by-date?start=" +
                day.startOf("week").format("YYYY-MM-DD HH:mm:ss") +
                "&end=" +
                day.endOf("week").format("YYYY-MM-DD HH:mm:ss")
            );
            if (response) {
              setListReservations(response.data.result);
            }
          } else {
            const response = await axiosPrivate.get(
              "reservation-detail/get-by-date?start=" +
                day.startOf("M").format("YYYY-MM-DD HH:mm:ss") +
                "&end=" +
                day.endOf("M").format("YYYY-MM-DD HH:mm:ss")
            );
            console.log(response);
            if (response) {
              setListReservations(response.data.result);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchList();
  }, [type, day, actionData]);

  useEffect(() => {
    const buttons = document.querySelectorAll(".my-custom-button");

    const handleClick = (event) => {
      const resourceId = event.target.getAttribute("data-resource-id");
      let room = null;
      listRoomsBycate.map((cate) => {
        const findedRoom = cate.ListRoom.find(
          (room) => room.roomId === resourceId
        );
        if (findedRoom) {
          room = findedRoom;
          return;
        }
      });
      setSelectedRoom(room);
      setOpenCleanModal(true);
    };

    buttons.forEach((button) => {
      button.addEventListener("click", handleClick);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", handleClick);
      });
    };
  }, [listRoomsBycate]);

  const listCategories = listRoomsBycate.map((cate) => {
    return {
      id: cate.roomCategory.roomCategoryId,
      title: cate.roomCategory.roomCategoryName,
      isParent: true,
      children: cate.ListRoom.map((room) => {
        return {
          id: room.roomId,
          title: room.roomName,
          data: room,
          isChild: true,
          isParent: false,
        };
      }),
    };
  });

  const events = listReservations.map((reservation) => {
    let start = dayjs();
    let end = dayjs();
    if (reservation.status === "BOOKING") {
      start = reservation.checkInEstimate;
      end = reservation.checkOutEstimate;
    } else if (reservation.status === "CHECK_IN") {
      start = reservation.checkInActual;
      end = reservation.checkOutEstimate;
    } else if (reservation.status === "CHECK_OUT") {
      start = reservation.checkInActual;
      end = reservation.checkOutActual;
    }
    return {
      id: reservation.reservationDetailId,
      resourceId: reservation.room.roomId,
      title: "Đặt phòng",
      data: reservation,
      start: start,
      end: end,
    };
  });

  const handleEventDisplay = (eventInfo) => {
    const reservationDetail = eventInfo.event.extendedProps.data;
    // console.log(eventInfo);
    // console.log(reservationDetail);
    let bgColor = "";
    if (reservationDetail.status === "BOOKING") {
      bgColor = "bg-orange-200 hover:bg-orange-500";
    } else if (reservationDetail.status === "CHECK_IN") {
      bgColor = "bg-green-200 hover:bg-green-500";
    } else if (reservationDetail.status === "CHECK_OUT") {
      bgColor = "bg-gray-200 hover:bg-gray-500";
    } else {
      bgColor = "bg-gray-200 hover:bg-gray-500";
    }
    return (
      <button
        type="button"
        className={`rounded text-black ${bgColor} w-full p-1`}
        onMouseOver={() => {
          setSelectedDetailsId(reservationDetail.reservationDetailId);
        }}
        onClick={() => setOpenDetailsModal(true)}
      >
        <div className="font-bold">
          {reservationDetail.reservation.reservationId}
        </div>
      </button>
    );
  };
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
      <div className="bg-white">
        <FullCalendar
          ref={dayRef}
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          resourceAreaHeaderContent=""
          resourceLabelContent={(args) => {
            const isChildResource = args.resource.extendedProps.isChild;
            if (isChildResource) {
              const room = args.resource.extendedProps.data;
              const clean =
                room.conditionStatus === "ROOM_CLEAN"
                  ? `<i class="fa-solid fa-spray-can-sparkles text-green-500 mr-2" data-resource-id="${args.resource.id}"></i>`
                  : `<i class="fa-solid fa-broom text-red-500 mr-2" data-resource-id="${args.resource.id}"></i>`;
              return {
                html: `<button type="button" class="ml-2 my-custom-button" data-resource-id="${args.resource.id}">${clean}${args.resource.title}</button>`,
              };
            } else {
              return {
                html: `<span class="ml-2">${args.resource.title}</span>`,
              };
            }
          }}
          resourceLabelClassNames={(info) => {
            const isParentResource = info.resource.extendedProps.isParent;
            if (isParentResource) {
              return "bg-gray-200";
            }
          }}
          eventClassNames="bg-gray-100 border-0"
          height={600}
          nowIndicator={true}
          initialView="resourceTimeline"
          headerToolbar={false}
          slotDuration={
            type === 1 ? { hours: 1, minutes: 60 } : { days: 1, hour: 1 }
          }
          duration={
            type === 1 ? { days: 1 } : type === 2 ? { weeks: 1 } : { months: 1 }
          }
          slotLabelFormat={
            type === 1
              ? [{ hour: "2-digit", minute: "2-digit", hour12: false }]
              : type === 2
              ? [{ weekday: "long", day: "numeric" }]
              : [{ day: "2-digit" }]
          }
          resources={listCategories}
          eventContent={handleEventDisplay}
          events={events}
          selectable={true}
          selectAllow={(args) => {
            if (args.resource.extendedProps.isParent) {
              return false;
            } else {
              return true;
            }
          }}
          select={(info) => console.log(info)}
          selectMirror={true}
          dayMaxEvents={true}
          locale={viLocale}
        />
      </div>
      {openDetailsModal && selectedDetailsId && (
        <ViewDetailsModal
          open={openDetailsModal}
          onClose={() => setOpenDetailsModal(false)}
          reservationDetail={listReservations.find(
            (details) => details.reservationDetailId === selectedDetailsId
          )}
        />
      )}
      {openCleanModal && selectedRoom && (
        <CleanRoomModal
          open={openCleanModal}
          onClose={() => setOpenCleanModal(false)}
          room={selectedRoom}
        />
      )}
    </div>
  );
}

export default ListRoomPage;

async function loadListRooms() {
  const response = await axiosPrivate.get("room-class");
  if (response.data) {
    return response.data;
  } else {
    return redirect("/error");
  }
}

async function loadTimeUsing() {
  const response = await axiosPrivate.get("policy/time_use");
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/error";
    return;
  }
}

async function loadPriceList() {
  const response = await axiosPrivate.get("price-list");
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/error";
    return;
  }
}

async function loadCategories() {
  const response = await axiosPrivate.get("room-class");
  return response.data;
}

export async function loader() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/error";
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
    const timeUsing = await loadTimeUsing();
    const categories = await loadCategories();
    const prices = await loadPriceList();
    return defer(
      {
        listRoomsBycate,
        timeUsing,
        categories,
        prices,
      },
      Swal.close()
    );
  } catch (error) {
    Swal.close();
    window.location.href = "/error";
    return;
  }
}

export async function action({ request }) {
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
  const method = request.method;
  const data = await request.formData();

  //Clean room
  if (data.get("isCleanRoom")) {
    const formRoom = new FormData();
    const status = data.get("status");
    formRoom.append("conditionStatus", status);
    const response = await axiosPrivate
      .put("room/" + data.get("roomId"), formRoom)
      .catch((e) => {
        console.log(e);
      });
    return {
      success: true,
      cleanRoom: response ? true : false,
      isClean: status === "ROOM_CLEAN" ? true : false,
    };
  }

  //Change room
  if (data.get("isChangeRoom")) {
    if (data.get("status") === "BOOKING") {
      const formDetails = new FormData();
      formDetails.append("reservationId", data.get("reservationId"));
      formDetails.append("roomId", data.get("oldRoomId"));
      formDetails.append("reservationDetailDTO.roomId", data.get("roomId"));
      formDetails.append("reservationDetailDTO.price", data.get("price"));
      const response = await axiosPrivate
        .put("reservation-detail/change-room", formDetails)
        .catch((e) => {
          console.log(e);
        });
      return { success: true, changeRoom: response.data.success };
    } else if (data.get("status") === "CHECK_IN") {
      if (data.get("radio") === "1") {
        const formDetails = new FormData();
        formDetails.append("reservationId", data.get("reservationId"));
        formDetails.append("roomId", data.get("oldRoomId"));
        formDetails.append("reservationDetailDTO.roomId", data.get("roomId"));
        formDetails.append("reservationDetailDTO.price", data.get("price"));
        const response = await axiosPrivate
          .put("reservation-detail/change-room", formDetails)
          .catch((e) => {
            console.log(e);
          });
        return { success: true, changeRoom: response.data.success };
      } else {
        const formCheckout = new FormData();
        formCheckout.append("checkInActual", data.get("fromTime"));
        formCheckout.append(
          "checkOutActual",
          dayjs().format("YYYY-MM-DD HH:mm:ss")
        );
        formCheckout.append("price", data.get("price1"));
        formCheckout.append("status", "CHECK_OUT");
        // return { success: true };
        const response1 = await axiosPrivate
          .put(
            "reservation-detail/" + data.get("reservationDetailId"),
            formCheckout
          )
          .catch((e) => {
            console.log(e);
          });
        if (response1.data.success) {
          const formCheckin = new FormData();
          formCheckin.append("reservationId", data.get("reservationId"));
          formCheckin.append("roomId", data.get("roomId"));
          formCheckin.append("reservationType", data.get("reservationType"));
          formCheckin.append(
            "checkInActual",
            dayjs().format("YYYY-MM-DD HH:mm:ss")
          );
          formCheckin.append("checkOutEstimate", data.get("toTime"));
          formCheckin.append("price", data.get("price2"));
          formCheckin.append("status", "CHECK_IN");
          const response2 = await axiosPrivate
            .post("reservation-detail", formCheckin)
            .catch((e) => {
              console.log(e);
            });
          return { success: true, changeRoom: response2.data.success };
        }
        return { success: true, changeRoom: false };
      }
    }
    return { success: true };
  }

  //Change status room to checkin
  if (data.get("isReceiveRoom")) {
    const formDetails = new FormData();
    formDetails.append("checkInActual", data.get("fromTime"));
    formDetails.append("checkOutEstimate", data.get("toTime"));
    formDetails.append("price", data.get("price"));
    formDetails.append("status", "CHECK_IN");
    const response = await axiosPrivate
      .put("reservation-detail/" + data.get("reservationDetailId"), formDetails)
      .catch((e) => {
        console.log(e);
      });
    return { success: true, checkinRoom: response.data };
  }

  //Change status room to checkout
  if (data.get("isPayRoom")) {
    const formDetails = new FormData();
    formDetails.append("checkInActual", data.get("fromTime"));
    formDetails.append("checkOutActual", data.get("toTime"));
    formDetails.append("price", data.get("price"));
    formDetails.append("status", "CHECK_OUT");
    const response = await axiosPrivate
      .put("reservation-detail/" + data.get("reservationDetailId"), formDetails)
      .catch((e) => {
        console.log(e);
      });
    return { success: true, checkoutRoom: response.data };
  }
}
