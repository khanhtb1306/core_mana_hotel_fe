import { MenuItem, Select } from "@mui/material";
import Modal from "./Modal";
import { useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { viVN } from "@mui/x-date-pickers/locales";
import { DatePicker } from "@mui/x-date-pickers";

function DayInputForm(props) {
  let list = props.dayInWeek.listPrice.reduce((result, item) => {
    return result.concat(item.listDay);
  }, []);
  let listDay = [];
  let timeApply = null;
  if (props.listTimeDay) {
    listDay = props.listTimeDay[0].listDay;
    timeApply = props.listTimeDay[0].timeApply;
    list = list.filter((l) => !listDay.includes(l));
  }
  const listDays = [
    { value: "2", name: "Thứ 2" },
    { value: "3", name: "Thứ 3" },
    { value: "4", name: "Thứ 4" },
    { value: "5", name: "Thứ 5" },
    { value: "6", name: "Thứ 6" },
    { value: "7", name: "Thứ 7" },
    { value: "8", name: "Chủ Nhật" },
  ];
  const [dayList, setDayList] = useState(listDay);
  const [time, setTime] = useState(timeApply);
  const [dayWeek, setDayWeek] = useState(listDays.filter((day) => !list.includes(day.value)));
  const handleChangeDay = (event) => {
    const { value } = event.target;
    setDayList(value);
  };
  const handleChangeTime = (value) => {
    setTime(dayjs(value).format("YYYY-MM-DD"));
  };
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      button={true}
      size="w-5/12 h-.5/6"
    >
      <div className="p-2 w-full">
        <h1 className="text-lg pb-10 font-bold">{props.name}</h1>
        <table className="ml-auto mr-5 w-full">
          <tbody>
            <tr>
              <td className="w-2/12">
                <h2>Thứ</h2>
              </td>
              <td className="w-10/12">
                <Select
                  multiple
                  value={dayList}
                  onChange={handleChangeDay}
                  sx={{
                    ".MuiInputBase-input": {
                      padding: 1,
                      width: "100%",
                      minWidth: 100,
                    },
                  }}
                >
                  {dayWeek.map((day) => (
                    <MenuItem key={day.value} value={day.value}>
                      {day.name}
                    </MenuItem>
                  ))}
                </Select>
              </td>
            </tr>
            <tr>
              <td className="w-2/12 pt-5">
                <h2>Ngày</h2>
              </td>
              <td className="w-10/12 pt-5">
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  localeText={
                    viVN.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <DatePicker
                    sx={{
                      ".MuiInputBase-input": { padding: 1, width: 150 },
                    }}
                    value={dayjs(time)}
                    onChange={handleChangeTime}
                  />
                </LocalizationProvider>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex pt-5">
        <div className="ml-auto">
          <button
            type="button"
            className="bg-green-500 mr-10 py-2 px-6 text-white rounded disabled:bg-green-200"
            onClick={() => {
              if (props.listTimeDay) {
                props.listTimeDay[0].listDay = dayList;
                props.listTimeDay[0].timeApply = time;
              } else {
                props.addTimeDay(dayList, time);
              }
              props.onClose();
            }}
            disabled={dayList.length === 0 && time === null}
          >
            Lưu
          </button>
          {props.listTimeDay && (
            <button
              type="button"
              className="bg-red-400 py-2 px-6 text-white rounded"
              onClick={() => {
                props.deleteTimeDay();
                props.onClose();
              }}
            >
              Xoá
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default DayInputForm;
