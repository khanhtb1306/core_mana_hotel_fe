import {
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  colors,
} from "@mui/material";
import { orange, green, grey } from "@mui/material/colors";
import ReservationLayout from "../ReservationLayout";
import { useState } from "react";
import dayjs from "dayjs";
import 'dayjs/locale/vi'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DatePicker,
  DateTimePicker,
  MobileDatePicker,
} from "@mui/x-date-pickers";
import { Link, defer, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
// require("dayjs/locale/vi");

function ListReservationPage() {
  const { reservations } = useLoaderData();
  console.log(reservations);
  const [type, setType] = useState(1);
  const [listReservations, setListReservations] = useState(
    reservations.filter(
      (res) =>
        (dayjs(res.reservation.durationStart).isSame(dayjs(), "day") ||
          dayjs(res.reservation.durationEnd).isSame(dayjs(), "day")) &&
        (dayjs(res.reservation.durationStart).isSame(dayjs(), "month") ||
          dayjs(res.reservation.durationEnd).isSame(dayjs(), "month")) &&
        (dayjs(res.reservation.durationStart).isSame(dayjs(), "year") ||
          dayjs(res.reservation.durationEnd).isSame(dayjs(), "year"))
    )
  );
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);

  const [day, setDay] = useState(dayjs());
  const [week, setWeek] = useState(dayjs());
  const [month, setMonth] = useState(dayjs().startOf("M"));

  const handleCheckboxChange1 = (event) => {
    const check1 = event.target.checked;
    setIsChecked1(check1);
    if (
      (check1 && isChecked2 && isChecked3) ||
      (!check1 && !isChecked2 && !isChecked3)
    ) {
      setListReservations(
        reservations.filter(
          (res) =>
            (type === 1 &&
              (dayjs(res.reservation.durationStart).isSame(day, "day") ||
                dayjs(res.reservation.durationEnd).isSame(day, "day")) &&
              (dayjs(res.reservation.durationStart).isSame(day, "month") ||
                dayjs(res.reservation.durationEnd).isSame(day, "month")) &&
              (dayjs(res.reservation.durationStart).isSame(day, "year") ||
                dayjs(res.reservation.durationEnd).isSame(day, "year"))) ||
            (type === 2 &&
              ((dayjs(res.reservation.durationStart).isAfter(
                week.add(-1, "day")
              ) &&
                dayjs(res.reservation.durationEnd).isBefore(
                  week.add(6, "day")
                )) ||
                (week
                  .add(-1, "day")
                  .isAfter(dayjs(res.reservation.durationStart)) &&
                  week
                    .add(-1, "day")
                    .isBefore(dayjs(res.reservation.durationEnd))) ||
                (week
                  .add(6, "day")
                  .isAfter(dayjs(res.reservation.durationStart)) &&
                  week
                    .add(6, "day")
                    .isBefore(dayjs(res.reservation.durationEnd)))) &&
              (dayjs(res.reservation.durationStart).isSame(week, "year") ||
                dayjs(res.reservation.durationEnd).isSame(week, "year"))) ||
            (type === 3 &&
              (dayjs(res.reservation.durationStart).isSame(month, "month") ||
                dayjs(res.reservation.durationEnd).isSame(month, "month")) &&
              (dayjs(res.reservation.durationStart).isSame(month, "year") ||
                dayjs(res.reservation.durationEnd).isSame(month, "year")))
        )
      );
    } else {
      setListReservations(
        reservations.filter(
          (res) =>
            ((check1 &&
              res.listReservationDetails
                .map((details) => details.status)
                .includes("BOOKING")) ||
              (isChecked2 &&
                res.listReservationDetails
                  .map((details) => details.status)
                  .includes("CHECK_IN")) ||
              (isChecked3 &&
                res.listReservationDetails
                  .map((details) => details.status)
                  .includes("CHECK_OUT"))) &&
            ((type === 1 &&
              (dayjs(res.reservation.durationStart).isSame(day, "day") ||
                dayjs(res.reservation.durationEnd).isSame(day, "day")) &&
              (dayjs(res.reservation.durationStart).isSame(day, "month") ||
                dayjs(res.reservation.durationEnd).isSame(day, "month")) &&
              (dayjs(res.reservation.durationStart).isSame(day, "year") ||
                dayjs(res.reservation.durationEnd).isSame(day, "year"))) ||
              (type === 2 &&
                ((dayjs(res.reservation.durationStart).isAfter(
                  week.add(-1, "day")
                ) &&
                  dayjs(res.reservation.durationEnd).isBefore(
                    week.add(6, "day")
                  )) ||
                  (week
                    .add(-1, "day")
                    .isAfter(dayjs(res.reservation.durationStart)) &&
                    week
                      .add(-1, "day")
                      .isBefore(dayjs(res.reservation.durationEnd))) ||
                  (week
                    .add(6, "day")
                    .isAfter(dayjs(res.reservation.durationStart)) &&
                    week
                      .add(6, "day")
                      .isBefore(dayjs(res.reservation.durationEnd)))) &&
                (dayjs(res.reservation.durationStart).isSame(week, "year") ||
                  dayjs(res.reservation.durationEnd).isSame(week, "year"))) ||
              (type === 3 &&
                (dayjs(res.reservation.durationStart).isSame(month, "month") ||
                  dayjs(res.reservation.durationEnd).isSame(month, "month")) &&
                (dayjs(res.reservation.durationStart).isSame(month, "year") ||
                  dayjs(res.reservation.durationEnd).isSame(month, "year"))))
        )
      );
    }
  };

  const handleCheckboxChange2 = (event) => {
    const check2 = event.target.checked;
    setIsChecked2(check2);
    if (
      (isChecked1 && check2 && isChecked3) ||
      (!isChecked1 && !check2 && !isChecked3)
    ) {
      setListReservations(
        reservations.filter(
          (res) =>
            (type === 1 &&
              (dayjs(res.reservation.durationStart).isSame(day, "day") ||
                dayjs(res.reservation.durationEnd).isSame(day, "day")) &&
              (dayjs(res.reservation.durationStart).isSame(day, "month") ||
                dayjs(res.reservation.durationEnd).isSame(day, "month")) &&
              (dayjs(res.reservation.durationStart).isSame(day, "year") ||
                dayjs(res.reservation.durationEnd).isSame(day, "year"))) ||
            (type === 2 &&
              ((dayjs(res.reservation.durationStart).isAfter(
                week.add(-1, "day")
              ) &&
                dayjs(res.reservation.durationEnd).isBefore(
                  week.add(6, "day")
                )) ||
                (week
                  .add(-1, "day")
                  .isAfter(dayjs(res.reservation.durationStart)) &&
                  week
                    .add(-1, "day")
                    .isBefore(dayjs(res.reservation.durationEnd))) ||
                (week
                  .add(6, "day")
                  .isAfter(dayjs(res.reservation.durationStart)) &&
                  week
                    .add(6, "day")
                    .isBefore(dayjs(res.reservation.durationEnd)))) &&
              (dayjs(res.reservation.durationStart).isSame(week, "year") ||
                dayjs(res.reservation.durationEnd).isSame(week, "year"))) ||
            (type === 3 &&
              (dayjs(res.reservation.durationStart).isSame(month, "month") ||
                dayjs(res.reservation.durationEnd).isSame(month, "month")) &&
              (dayjs(res.reservation.durationStart).isSame(month, "year") ||
                dayjs(res.reservation.durationEnd).isSame(month, "year")))
        )
      );
    } else {
      setListReservations(
        reservations.filter(
          (res) =>
            ((isChecked1 &&
              res.listReservationDetails
                .map((details) => details.status)
                .includes("BOOKING")) ||
              (check2 &&
                res.listReservationDetails
                  .map((details) => details.status)
                  .includes("CHECK_IN")) ||
              (isChecked3 &&
                res.listReservationDetails
                  .map((details) => details.status)
                  .includes("CHECK_OUT"))) &&
            ((type === 1 &&
              (dayjs(res.reservation.durationStart).isSame(day, "day") ||
                dayjs(res.reservation.durationEnd).isSame(day, "day")) &&
              (dayjs(res.reservation.durationStart).isSame(day, "month") ||
                dayjs(res.reservation.durationEnd).isSame(day, "month")) &&
              (dayjs(res.reservation.durationStart).isSame(day, "year") ||
                dayjs(res.reservation.durationEnd).isSame(day, "year"))) ||
              (type === 2 &&
                ((dayjs(res.reservation.durationStart).isAfter(
                  week.add(-1, "day")
                ) &&
                  dayjs(res.reservation.durationEnd).isBefore(
                    week.add(6, "day")
                  )) ||
                  (week
                    .add(-1, "day")
                    .isAfter(dayjs(res.reservation.durationStart)) &&
                    week
                      .add(-1, "day")
                      .isBefore(dayjs(res.reservation.durationEnd))) ||
                  (week
                    .add(6, "day")
                    .isAfter(dayjs(res.reservation.durationStart)) &&
                    week
                      .add(6, "day")
                      .isBefore(dayjs(res.reservation.durationEnd)))) &&
                (dayjs(res.reservation.durationStart).isSame(week, "year") ||
                  dayjs(res.reservation.durationEnd).isSame(week, "year"))) ||
              (type === 3 &&
                (dayjs(res.reservation.durationStart).isSame(month, "month") ||
                  dayjs(res.reservation.durationEnd).isSame(month, "month")) &&
                (dayjs(res.reservation.durationStart).isSame(month, "year") ||
                  dayjs(res.reservation.durationEnd).isSame(month, "year"))))
        )
      );
    }
  };

  const handleCheckboxChange3 = (event) => {
    const check3 = event.target.checked;
    setIsChecked3(check3);
    if (
      (isChecked1 && isChecked2 && check3) ||
      (!isChecked1 && !isChecked2 && !check3)
    ) {
      setListReservations(
        reservations.filter(
          (res) =>
            (type === 1 &&
              (dayjs(res.reservation.durationStart).isSame(day, "day") ||
                dayjs(res.reservation.durationEnd).isSame(day, "day")) &&
              (dayjs(res.reservation.durationStart).isSame(day, "month") ||
                dayjs(res.reservation.durationEnd).isSame(day, "month")) &&
              (dayjs(res.reservation.durationStart).isSame(day, "year") ||
                dayjs(res.reservation.durationEnd).isSame(day, "year"))) ||
            (type === 2 &&
              ((dayjs(res.reservation.durationStart).isAfter(
                week.add(-1, "day")
              ) &&
                dayjs(res.reservation.durationEnd).isBefore(
                  week.add(6, "day")
                )) ||
                (week
                  .add(-1, "day")
                  .isAfter(dayjs(res.reservation.durationStart)) &&
                  week
                    .add(-1, "day")
                    .isBefore(dayjs(res.reservation.durationEnd))) ||
                (week
                  .add(6, "day")
                  .isAfter(dayjs(res.reservation.durationStart)) &&
                  week
                    .add(6, "day")
                    .isBefore(dayjs(res.reservation.durationEnd)))) &&
              (dayjs(res.reservation.durationStart).isSame(week, "year") ||
                dayjs(res.reservation.durationEnd).isSame(week, "year"))) ||
            (type === 3 &&
              (dayjs(res.reservation.durationStart).isSame(month, "month") ||
                dayjs(res.reservation.durationEnd).isSame(month, "month")) &&
              (dayjs(res.reservation.durationStart).isSame(month, "year") ||
                dayjs(res.reservation.durationEnd).isSame(month, "year")))
        )
      );
    } else {
      setListReservations(
        reservations.filter(
          (res) =>
            ((isChecked1 &&
              res.listReservationDetails
                .map((details) => details.status)
                .includes("BOOKING")) ||
              (isChecked2 &&
                res.listReservationDetails
                  .map((details) => details.status)
                  .includes("CHECK_IN")) ||
              (check3 &&
                res.listReservationDetails
                  .map((details) => details.status)
                  .includes("CHECK_OUT"))) &&
            ((type === 1 &&
              (dayjs(res.reservation.durationStart).isSame(day, "day") ||
                dayjs(res.reservation.durationEnd).isSame(day, "day")) &&
              (dayjs(res.reservation.durationStart).isSame(day, "month") ||
                dayjs(res.reservation.durationEnd).isSame(day, "month")) &&
              (dayjs(res.reservation.durationStart).isSame(day, "year") ||
                dayjs(res.reservation.durationEnd).isSame(day, "year"))) ||
              (type === 2 &&
                ((dayjs(res.reservation.durationStart).isAfter(
                  week.add(-1, "day")
                ) &&
                  dayjs(res.reservation.durationEnd).isBefore(
                    week.add(6, "day")
                  )) ||
                  (week
                    .add(-1, "day")
                    .isAfter(dayjs(res.reservation.durationStart)) &&
                    week
                      .add(-1, "day")
                      .isBefore(dayjs(res.reservation.durationEnd))) ||
                  (week
                    .add(6, "day")
                    .isAfter(dayjs(res.reservation.durationStart)) &&
                    week
                      .add(6, "day")
                      .isBefore(dayjs(res.reservation.durationEnd)))) &&
                (dayjs(res.reservation.durationStart).isSame(week, "year") ||
                  dayjs(res.reservation.durationEnd).isSame(week, "year"))) ||
              (type === 3 &&
                (dayjs(res.reservation.durationStart).isSame(month, "month") ||
                  dayjs(res.reservation.durationEnd).isSame(month, "month")) &&
                (dayjs(res.reservation.durationStart).isSame(month, "year") ||
                  dayjs(res.reservation.durationEnd).isSame(month, "year"))))
        )
      );
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    if (value === 1) {
      setDay(dayjs());
      handleDayChange(dayjs());
    } else if (value === 2) {
      setWeek(dayjs());
      handeWeekChange(dayjs());
    } else if (value === 3) {
      setWeek(dayjs().startOf("M"));
      handeWeekChange(dayjs().startOf("M"));
    }
    setType(value);
  };

  const handleDayChange = (value) => {
    if (
      (isChecked1 && isChecked2 && isChecked3) ||
      (!isChecked1 && !isChecked2 && !isChecked3)
    ) {
      setListReservations(
        reservations.filter(
          (res) =>
            (dayjs(res.reservation.durationStart).isSame(value, "day") ||
              dayjs(res.reservation.durationEnd).isSame(value, "day")) &&
            (dayjs(res.reservation.durationStart).isSame(value, "month") ||
              dayjs(res.reservation.durationEnd).isSame(value, "month")) &&
            (dayjs(res.reservation.durationStart).isSame(value, "year") ||
              dayjs(res.reservation.durationEnd).isSame(value, "year"))
        )
      );
    } else {
      setListReservations(
        reservations.filter(
          (res) =>
            ((isChecked1 &&
              res.listReservationDetails
                .map((details) => details.status)
                .includes("BOOKING")) ||
              (isChecked2 &&
                res.listReservationDetails
                  .map((details) => details.status)
                  .includes("CHECK_IN")) ||
              (isChecked3 &&
                res.listReservationDetails
                  .map((details) => details.status)
                  .includes("CHECK_OUT"))) &&
            (dayjs(res.reservation.durationStart).isSame(value, "day") ||
              dayjs(res.reservation.durationEnd).isSame(value, "day")) &&
            (dayjs(res.reservation.durationStart).isSame(value, "month") ||
              dayjs(res.reservation.durationEnd).isSame(value, "month")) &&
            (dayjs(res.reservation.durationStart).isSame(value, "year") ||
              dayjs(res.reservation.durationEnd).isSame(value, "year"))
        )
      );
    }
  };

  const handeWeekChange = (value) => {
    if (
      (isChecked1 && isChecked2 && isChecked3) ||
      (!isChecked1 && !isChecked2 && !isChecked3)
    ) {
      setListReservations(
        reservations.filter(
          (res) =>
            ((dayjs(res.reservation.durationStart).isAfter(
              value.add(-1, "day")
            ) &&
              dayjs(res.reservation.durationEnd).isBefore(
                value.add(6, "day")
              )) ||
              (value
                .add(-1, "day")
                .isAfter(dayjs(res.reservation.durationStart)) &&
                value
                  .add(-1, "day")
                  .isBefore(dayjs(res.reservation.durationEnd))) ||
              (value
                .add(6, "day")
                .isAfter(dayjs(res.reservation.durationStart)) &&
                value
                  .add(6, "day")
                  .isBefore(dayjs(res.reservation.durationEnd)))) &&
            (dayjs(res.reservation.durationStart).isSame(value, "year") ||
              dayjs(res.reservation.durationEnd).isSame(value, "year"))
        )
      );
    } else {
      setListReservations(
        reservations.filter(
          (res) =>
            ((isChecked1 &&
              res.listReservationDetails
                .map((details) => details.status)
                .includes("BOOKING")) ||
              (isChecked2 &&
                res.listReservationDetails
                  .map((details) => details.status)
                  .includes("CHECK_IN")) ||
              (isChecked3 &&
                res.listReservationDetails
                  .map((details) => details.status)
                  .includes("CHECK_OUT"))) &&
            ((dayjs(res.reservation.durationStart).isAfter(
              value.add(-1, "day")
            ) &&
              dayjs(res.reservation.durationEnd).isBefore(
                value.add(6, "day")
              )) ||
              (value
                .add(-1, "day")
                .isAfter(dayjs(res.reservation.durationStart)) &&
                value
                  .add(-1, "day")
                  .isBefore(dayjs(res.reservation.durationEnd))) ||
              (value
                .add(6, "day")
                .isAfter(dayjs(res.reservation.durationStart)) &&
                value
                  .add(6, "day")
                  .isBefore(dayjs(res.reservation.durationEnd)))) &&
            (dayjs(res.reservation.durationStart).isSame(value, "year") ||
              dayjs(res.reservation.durationEnd).isSame(value, "year"))
        )
      );
    }
  };

  const handeMonthChange = (value) => {
    if (
      (isChecked1 && isChecked2 && isChecked3) ||
      (!isChecked1 && !isChecked2 && !isChecked3)
    ) {
      setListReservations(
        reservations.filter(
          (res) =>
            (dayjs(res.reservation.durationStart).isSame(value, "month") ||
              dayjs(res.reservation.durationEnd).isSame(value, "month")) &&
            (dayjs(res.reservation.durationStart).isSame(value, "year") ||
              dayjs(res.reservation.durationEnd).isSame(value, "year"))
        )
      );
    } else {
      setListReservations(
        reservations.filter(
          (res) =>
            ((isChecked1 &&
              res.listReservationDetails
                .map((details) => details.status)
                .includes("BOOKING")) ||
              (isChecked2 &&
                res.listReservationDetails
                  .map((details) => details.status)
                  .includes("CHECK_IN")) ||
              (isChecked3 &&
                res.listReservationDetails
                  .map((details) => details.status)
                  .includes("CHECK_OUT"))) &&
            (dayjs(res.reservation.durationStart).isSame(value, "month") ||
              dayjs(res.reservation.durationEnd).isSame(value, "month")) &&
            (dayjs(res.reservation.durationStart).isSame(value, "year") ||
              dayjs(res.reservation.durationEnd).isSame(value, "year"))
        )
      );
    }
  };

  const columns = [
    { field: "number", headerName: "STT", width: 80 },
    { field: "reservationId", headerName: "Mã đặt phòng", width: 180 },
    { field: "customer", headerName: "Khách đặt", width: 220 },
    { field: "date", headerName: "Lưu trú", width: 250 },
    {
      field: "status",
      headerName: "Trạng thái phòng",
      width: 250,
      renderCell: (params) => (
        <div className="flex">
          {params.row.status.map((room, index) => (
            <div
              key={index}
              className={`bg-${room.color}-200 mr-2 py-1 px-2 rounded text-${room.color}-500`}
            >
              {room.roomName}
            </div>
          ))}
        </div>
      ),
    },
    { field: "totalPrice", headerName: "Tổng cộng", width: 150 },
    { field: "totalDeposit", headerName: "Khách đã trả", width: 150 },
    {
      field: "actions",
      headerName: "Hoạt động",
      type: "actions",
      getActions: (params) => {
        const row = params.row;
        // console.log(row);
        let status = 3;
        if (row.status.some((room) => room.bookingStatus === "BOOKING")) {
          status = 1;
          if (row.status.some((room) => room.bookingStatus === "CHECK_IN")) {
            status = 4;
          }
        } else if (
          row.status.some((room) => room.bookingStatus === "CHECK_IN")
        ) {
          status = 2;
        }
        return [
          status === 1 || status === 4 ? (
            <>
              <GridActionsCellItem
                icon={
                  <button className="bg-green-600 text-base text-white px-6 rounded">
                    Nhận phòng
                  </button>
                }
                label="Nhận phòng"
              />
            </>
          ) : status === 2 ? (
            <>
              <GridActionsCellItem
                icon={
                  <button
                    type="button"
                    className="bg-blue-600 text-base text-white px-6 rounded"
                  >
                    Trả phòng
                  </button>
                }
                label="Trả phòng"
              />
            </>
          ) : (
            <GridActionsCellItem
              icon={
                <button
                  type="button"
                  className="bg-white text-base text-green-600 border border-green-600 px-6 rounded"
                >
                  Hoá đơn
                </button>
              }
              label="Hoá đơn"
            />
          ),
          status === 4 ? (
            <GridActionsCellItem
              icon={<button type="button">Trả phòng</button>}
              showInMenu
            />
          ) : (
            <></>
          ),
          status !== 3 ? (
            <GridActionsCellItem
              icon={<button type="button"><Link to={`editReservation/${row.reservationId}`}>Điều chỉnh</Link></button>}
              showInMenu
            />
          ) : (
            <></>
          ),
          status !== 3 ? (
            <GridActionsCellItem
              icon={<button type="button">Huỷ đặt phòng</button>}
              showInMenu
            />
          ) : (
            <></>
          ),
        ];
      },
      width: 200,
    },
  ];

  const rows = listReservations.map((res, index) => {
    const date =
      dayjs(res.reservation.durationStart).format("DD-MM, hh:mm") +
      " - " +
      dayjs(res.reservation.durationEnd).format("DD-MM, hh:mm");
    const listRoom = res.listReservationDetails.map((resDetails) => {
      let color = "";
      if (resDetails.status === "CHECK_OUT") {
        color = "gray";
      } else if (resDetails.status === "BOOKING") {
        color = "orange";
      } else if (resDetails.status === "CHECK_IN") {
        color = "green";
      }
      return {
        roomName: resDetails.room.roomName,
        color: color,
        bookingStatus: resDetails.status,
      };
    });
    return {
      id: res.reservation.reservationId,
      number: index + 1,
      reservationId: res.reservation.reservationId,
      customer: res.reservation.customer.customerName,
      date: date,
      status: listRoom,
      totalPrice: res.reservation.totalPrice,
      totalDeposit: res.reservation.totalDeposit,
    };
  });

  return (
    <div className="h-full px-4 mx-auto">
      <div className="flex">
        <div>
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                checked={isChecked1}
                onChange={handleCheckboxChange1}
                sx={{
                  color: orange[800],
                  "&.Mui-checked": {
                    color: orange[600],
                  },
                }}
              />
            }
            label="Đặt trước"
            labelPlacement="end"
          />
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                checked={isChecked2}
                onChange={handleCheckboxChange2}
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
                checked={isChecked3}
                onChange={handleCheckboxChange3}
                sx={{
                  color: grey[800],
                  "&.Mui-checked": {
                    color: grey[600],
                  },
                }}
              />
            }
            label="Đã trả phòng"
            labelPlacement="end"
          />
        </div>
        <div className="ml-auto">
          <Select
            sx={{ mr: 2, minWidth: 120, background: "white" }}
            size="small"
            value={type}
            onChange={handleChange}
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
                    handleDayChange(day.add(-1, "day"));
                    setDay(day.add(-1, "day"));
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
                    handleDayChange(value);
                    setDay(value);
                  }}
                  size="small"
                  format="dddd, DD/MM/YYYY"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-white rounded-tr rounded-br"
                  onClick={() => {
                    handleDayChange(day.add(1, "day"));
                    setDay(day.add(1, "day"));
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
                    handeWeekChange(week.add(-1, "week"));
                    setWeek(week.add(-1, "week"));
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
                  value={week}
                  onChange={(value) => {
                    handeWeekChange(value);
                    setWeek(value);
                  }}
                  size="small"
                  format={`DD/MM/YYYY - ${week
                    .add(6, "day")
                    .format("DD/MM/YYYY")}`}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-white rounded-tr rounded-br"
                  onClick={() => {
                    handeWeekChange(week.add(1, "week"));
                    setWeek(week.add(1, "week"));
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
                    handeMonthChange(month.add(-1, "M"));
                    setMonth(month.add(-1, "M"));
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
                  value={month}
                  onChange={(value) => {
                    handeMonthChange(value);
                    setMonth(value);
                  }}
                  size="small"
                  format="MM/YYYY"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-white rounded-tr rounded-br"
                  onClick={() => {
                    handeMonthChange(month.add(1, "M"));
                    setMonth(month.add(1, "M"));
                  }}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </>
            )}
          </LocalizationProvider>
          <button
            type="button"
            className="bg-green-500 p-2 ml-4 rounded-lg text-white"
          >
            <i className="fa-solid fa-plus px-2"></i>
            <span className="pr-2">Đặt phòng</span>
          </button>
        </div>
      </div>
      <ReservationLayout isActive={true} />
      <DataGrid
        className="bg-white"
        columns={columns}
        rows={rows}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25]}
      />
    </div>
  );
}

export default ListReservationPage;

async function loadReservations() {
  const response = await axiosPrivate.get("reservation");
  if (response.data.success) {
    return response.data.result;
  } else {
    redirect("login");
  }
}

export async function loader() {
  return defer({
    reservations: await loadReservations(),
  });
}
