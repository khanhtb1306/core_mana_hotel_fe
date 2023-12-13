import {
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
  colors,
} from "@mui/material";
import { orange, green, grey } from "@mui/material/colors";
import ReservationLayout from "../ReservationLayout";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
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
  const [listReservations, setListReservations] = useState([]);
  // console.log(reservations);
  const [type, setType] = useState(1);
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [findCus, setFindCus] = useState("");

  const [day, setDay] = useState(dayjs());

  useEffect(() => {
    async function listReservations() {
      if (type === 1) {
        const response = await axiosPrivate(
          `reservation?start=${day
            .startOf("date")
            .format("YYYY-MM-DD HH:mm:ss")}&end=${day
            .endOf("date")
            .format("YYYY-MM-DD HH:mm:ss")}`
        );
        if (response && response.data.success) {
          setListReservations(response.data.result);
        }
      } else if (type === 2) {
        const response = await axiosPrivate.get(
          "reservation?start=" +
            day.startOf("week").format("YYYY-MM-DD HH:mm:ss") +
            "&end=" +
            day.endOf("week").format("YYYY-MM-DD HH:mm:ss")
        );
        if (response && response.data.success) {
          setListReservations(response.data.result);
        }
      } else {
        const response = await axiosPrivate.get(
          "reservation?start=" +
            day.startOf("M").format("YYYY-MM-DD HH:mm:ss") +
            "&end=" +
            day.endOf("M").format("YYYY-MM-DD HH:mm:ss")
        );
        if (response && response.data.success) {
          setListReservations(response.data.result);
        }
      }
    }
    listReservations();
  }, [type, day]);

  const handleCheckboxChange1 = (event) => {
    const check1 = event.target.checked;
    setIsChecked1(check1);
  };

  const handleCheckboxChange2 = (event) => {
    const check2 = event.target.checked;
    setIsChecked2(check2);
  };

  const handleCheckboxChange3 = (event) => {
    const check3 = event.target.checked;
    setIsChecked3(check3);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setType(value);
  };

  const columns = [
    { field: "number", headerName: "STT", width: 80 },
    { field: "reservationId", headerName: "Mã đặt phòng", width: 170 },
    { field: "customer", headerName: "Khách đặt", width: 210 },
    { field: "date", headerName: "Lưu trú", width: 250 },
    {
      field: "status",
      headerName: "Trạng thái phòng",
      width: 250,
      renderCell: (params) => (
        <div className="grid grid-cols-4 gap-1">
          {params.row.status.map((room, index) => (
            <div
              key={index}
              className={`bg-${room.color}-200 py-1 px-2 rounded text-${room.color}-500`}
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
        let status = 1;
        if (row.status.some((room) => room.bookingStatus === "CHECK_OUT")) {
          status = 2;
        } else if (row.status.every((room) => room.bookingStatus === "DONE")) {
          status = 3;
        }
        return [
          <>
            {status === 1 && (
              <>
                <GridActionsCellItem
                  icon={
                    <button
                      type="button"
                      className="text-medium text-green-600"
                    >
                      <Link to={`/editReservation/${row.reservationId}`}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                    </button>
                  }
                />
                <GridActionsCellItem
                  icon={
                    <button
                      type="button"
                      className="text-medium text-green-600"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  }
                />
              </>
            )}
            {status === 2 && (
              <>
                <GridActionsCellItem
                  icon={
                    <button
                      type="button"
                      className="text-medium text-green-600"
                    >
                      <Link to={`/editReservation/${row.reservationId}`}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                    </button>
                  }
                />
                <GridActionsCellItem
                  icon={
                    <button
                      type="button"
                      className="text-medium text-green-600"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  }
                />
              </>
            )}
          </>,
        ];
      },
      width: 200,
    },
  ];

  let rows = [];

  if (
    (isChecked1 && isChecked1 && isChecked1 && findCus === "") ||
    (!isChecked1 && !isChecked1 && !isChecked1 && findCus === "")
  ) {
    rows = listReservations.map((res, index) => {
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
  } else {
    rows = listReservations
      .filter((res) => {
        if (isChecked1) {
          return res.listReservationDetails.some(
            (detail) => detail.status === "BOOKING"
          );
        }
        if (isChecked2) {
          return res.listReservationDetails.some(
            (detail) => detail.status === "CHECK_IN"
          );
        }
        if (isChecked3) {
          return res.listReservationDetails.some(
            (detail) => detail.status === "CHECK_OUT"
          );
        }
        if (findCus !== "") {
          const cus = res.reservation.customer;
          return (
            (cus.customerName &&
              cus.customerName.toLowerCase().includes(findCus.toLowerCase())) ||
            (cus.identity &&
              cus.identity.toLowerCase().includes(findCus.toLowerCase())) ||
            (cus.email &&
              cus.email.toLowerCase().includes(findCus.toLowerCase())) ||
            (cus.phoneNumber &&
              cus.phoneNumber.toLowerCase().includes(findCus.toLowerCase()))
          );
        }
      })
      .map((res, index) => {
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
  }

  return (
    <div className="h-full px-4 mx-auto mt-2">
      <div className="flex">
        <div>
          <TextField
            label="Tìm kiếm theo khách hàng"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              width: 200,
              marginRight: 2,
            }}
            value={findCus}
            onChange={(e) => {
              setFindCus(e.target.value);
            }}
            size="small"
          />
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
                    setDay(value);
                  }}
                  size="small"
                  format="dddd, DD/MM/YYYY"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-white rounded-tr rounded-br"
                  onClick={() => {
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
                    setDay(day.add(-1, "week"));
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
                  }}
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
                  }}
                  size="small"
                  format="MM/YYYY"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-white rounded-tr rounded-br"
                  onClick={() => {
                    setDay(day.add(1, "M"));
                  }}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </>
            )}
          </LocalizationProvider>
        </div>
      </div>
      <ReservationLayout isActive={true} />
      <DataGrid
        className="bg-white"
        getRowHeight={(params) => {
          let height = (params.model.status.length / 4).toFixed() * 40;
          height += params.model.status.length % 4 <= 2 ? 40 : 0;
          return height;
        }}
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

// async function loadReservations() {
//   const response = await axiosPrivate.get("reservation");
//   if (response.data.success) {
//     return response.data.result;
//   } else {
//     redirect("login");
//   }
// }

export async function loader() {
  return defer({
    // reservations: await loadReservations(),
  });
}
