import {
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { orange, green, grey } from "@mui/material/colors";
import ReservationLayout from "../ReservationLayout";
import { useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { viVN } from "@mui/x-date-pickers/locales";
import {
  DatePicker,
  DateTimePicker,
  MobileDatePicker,
} from "@mui/x-date-pickers";

function ListReservationPage() {
  const [type, setType] = useState(1);

  const handleChange = (event) => {
    setType(event.target.value);
  };
  return (
    <div className="h-full w-11/12 mx-auto mt-5">
      <div className="flex">
        <div>
          <FormControlLabel
            value="end"
            control={
              <Checkbox
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
            <MenuItem value={1}>Giờ</MenuItem>
            <MenuItem value={2}>Tuần</MenuItem>
            <MenuItem value={3}>Tháng</MenuItem>
          </Select>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={
              viVN.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <button
              type="button"
              className="px-4 py-2 bg-white rounded-tl rounded-bl"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <MobileDatePicker
              sx={{
                ".MuiInputBase-input": {
                  padding: 1,
                  width: 150,
                  border: 0,
                  background: "white",
                },
              }}
              size="small"
              format="DD/MM/YYYY"
            />
            <button
              type="button"
              className="px-4 py-2 bg-white rounded-tr rounded-br"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </LocalizationProvider>
          <button type="button" className="bg-green-500 p-2 ml-4 rounded-lg text-white">
            <i className="fa-solid fa-plus px-2"></i>
            <span className="pr-2">Đặt phòng</span>
          </button>
        </div>
      </div>
      <ReservationLayout isActive={true} />
    </div>
  );
}

export default ListReservationPage;
