import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { viVN } from "@mui/x-date-pickers/locales";
import { DateTimePicker } from "@mui/x-date-pickers";
import { MenuItem, Select } from "@mui/material";
import { useState } from "react";

function SelectRoom(props) {
  const [typeTime, setTypeTime] = useState(1);
  const [valueTime, setValueTime] = useState("1 giờ");

  const [fromTime, setFromTime] = useState(dayjs().add(1, "minute"));
  const [toTime, setToTime] = useState(dayjs().add(1, "hour").add(1, "minute"));

  const handleSelectRoom = (e) => {
    const value = e.target.value;
    setTypeTime(value);
    if (value === 1) {
        const value = (toTime.diff(fromTime) / (1000 * 60 * 60)).toFixed();
        setValueTime(value + " Giờ")
    } else if (value === 2) {
        const value = (toTime.diff(fromTime) / (1000 * 60 * 60 * 24)).toFixed();
        setValueTime(value + " Ngày")
    } else if (value === 3) {
        const value = (toTime.diff(fromTime) / (1000 * 60 * 60 * 12)).toFixed();
        setValueTime(value + " Đêm")
    }
  };

  const handleChangeFromTime = (value) => {
    setFromTime(value);
    if(value > toTime) {
        setToTime(value.add(1, "hour"));
    }
  };

  const handleChangeToTime = (value) => {
    setToTime(value);
    if(value <= toTime) {
        setFromTime(value);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg border p-4">
      <div>
        <div className="flex mb-2">
          <p className="my-auto mr-2">Phòng 02 giường đơn</p>
          <Select
            sx={{ width: 100, height: 40 }}
            value={typeTime}
            onChange={handleSelectRoom}
          >
            <MenuItem value={1}>Giờ</MenuItem>
            <MenuItem value={2}>Ngày</MenuItem>
            <MenuItem value={3}>Đêm</MenuItem>
          </Select>
        </div>
        <div className="flex mb-2">
          <p className="text-gray-500 my-auto mr-2">Phòng:</p>
          <Select
            sx={{ width: 160, height: 40 }}
            // value={typeTime}
            // onChange={handleSelectRoom}
          >
            <MenuItem value={1}>P.201</MenuItem>
          </Select>
        </div>
        <div className="flex mb-2">
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={
              viVN.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <p className="text-gray-500 my-auto mr-2">Dự kiến:</p>
            <div className="pr-2">
              <DateTimePicker
                ampm={false}
                disablePast
                sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                value={fromTime}
                onChange={handleChangeFromTime}
              />
            </div>
            <p className="text-gray-500 my-auto mr-2">đến</p>
            <div className="pr-2">
              <DateTimePicker
                ampm={false}
                disablePast
                sx={{ ".MuiInputBase-input": { padding: 1, width: 150 } }}
                value={toTime}
                onChange={handleChangeToTime}
              />
            </div>
          </LocalizationProvider>
          <div className="bg-gray-200 w-20 text-center my-auto py-1 px-2 rounded text-gray-500">
            {valueTime}
          </div>
        </div>
      </div>
      <div className="flex border-t pt-2">
        <p className="w-6/12">Phòng 02 giường đơn (Ngày)</p>
        <p className="w-2/12">3</p>
        <p className="w-2/12">800,000</p>
        <p className="w-2/12">2,400,000</p>
      </div>
    </div>
  );
}

export default SelectRoom;
