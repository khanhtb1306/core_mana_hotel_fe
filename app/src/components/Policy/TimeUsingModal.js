import Modal from "../UI/Modal";
import { useState } from "react";
import { Form } from "react-router-dom";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { viVN } from "@mui/x-date-pickers/locales";
import { TimePicker } from "@mui/x-date-pickers";
import { MenuItem, Select } from "@mui/material";

function TimeUsingModal(props) {
//   console.log(props.timeUsing);
  const timeUsing = props.timeUsing;
  const [overTimeHour, setOverTimeHour] = useState(timeUsing.timeBonusHour);
  const [fromTimeNight, setFromTimeNight] = useState(
    dayjs().hour(timeUsing.startTimeNight.split(":")[0])
  );
  const [toTimeNight, setToTimeNight] = useState(
    dayjs().hour(timeUsing.endTimeNight.split(":")[0])
  );
  const [fromTimeDay, setFromTimeDay] = useState(
    dayjs().hour(timeUsing.startTimeDay.split(":")[0])
  );
  const [toTimeDay, setToTimeDay] = useState(
    dayjs().hour(timeUsing.endTimeDay.split(":")[0])
  );
  const [overTimeDay, setOverTimeDay] = useState(timeUsing.timeBonusDay);

  return (
    <Form method="put" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-6/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">
              Thiết lập thời gian sử dụng
            </h1>
            <input type="hidden" name="isTimeUsing" defaultValue={true} />
            <input
              type="hidden"
              name="timeUseId"
              defaultValue={timeUsing.timeUseId}
            />
          </div>
          <div className="mb-5">
            <h2 className="text-lg font-medium">Theo giờ</h2>
            <div className="flex">
              <div className="w-1/2 my-auto">
                Tính thêm 1 giờ nếu sử dụng quá
              </div>
              <div className="w-1/2">
                <Select
                  sx={{
                    ".MuiInputBase-input": { padding: 1, width: 280 },
                  }}
                  name="overTimeHour"
                  value={overTimeHour}
                  onChange={(e) => setOverTimeHour(e.target.value)}
                >
                  <MenuItem value={0}>0 phút</MenuItem>
                  <MenuItem value={15}>15 phút</MenuItem>
                  <MenuItem value={30}>30 phút</MenuItem>
                  <MenuItem value={45}>45 phút</MenuItem>
                </Select>
              </div>
            </div>
          </div>
          <div className="mb-5">
            <h2 className="text-lg font-medium">Theo đêm</h2>
            <div className="flex">
              <div className="w-1/2 my-auto">Giá nhận - trả quy định</div>
              <div className="w-1/2 flex">
                <input
                  type="hidden"
                  name="fromTimeNight"
                  value={fromTimeNight.format("HH:00:00")}
                />
                <input
                  type="hidden"
                  name="toTimeNight"
                  value={toTimeNight.format("HH:00:00")}
                />
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  localeText={
                    viVN.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <div className="w-5/12">
                    <TimePicker
                      ampm={false}
                      sx={{
                        ".MuiInputBase-input": { padding: 1, width: 50 },
                      }}
                      views={["hours"]}
                      value={fromTimeNight}
                      onChange={(e) => setFromTimeNight(e)}
                      format="HH:00"
                    />
                  </div>
                  <div className="w-2/12 my-auto">đến</div>
                  <div className="w-5/12">
                    <TimePicker
                      ampm={false}
                      sx={{
                        ".MuiInputBase-input": { padding: 1, width: 50 },
                      }}
                      views={["hours"]}
                      value={toTimeNight}
                      onChange={(e) => setToTimeNight(e)}
                      format="HH:00"
                    />
                  </div>
                </LocalizationProvider>
              </div>
            </div>
          </div>
          <div className="">
            <h2 className="text-lg font-medium">Theo ngày</h2>
            <div className="flex mb-2">
              <div className="w-1/2 my-auto">Giá nhận - trả quy định</div>
              <div className="w-1/2 flex">
                <input
                  type="hidden"
                  name="fromTimeDay"
                  value={fromTimeDay.format("HH:00:00")}
                />
                <input
                  type="hidden"
                  name="toTimeDay"
                  value={toTimeDay.format("HH:00:00")}
                />
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  localeText={
                    viVN.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <div className="w-5/12">
                    <TimePicker
                      ampm={false}
                      sx={{
                        ".MuiInputBase-input": { padding: 1, width: 50 },
                      }}
                      views={["hours"]}
                      value={fromTimeDay}
                      onChange={(e) => setFromTimeDay(e)}
                      format="HH:00"
                    />
                  </div>
                  <div className="w-2/12 my-auto">đến</div>
                  <div className="w-5/12">
                    <TimePicker
                      ampm={false}
                      sx={{
                        ".MuiInputBase-input": { padding: 1, width: 50 },
                      }}
                      views={["hours"]}
                      value={toTimeDay}
                      onChange={(e) => setToTimeDay(e)}
                      format="HH:00"
                    />
                  </div>
                </LocalizationProvider>
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 my-auto">
                Tính thêm 1 ngày khi nhận sớm - trả muộn
              </div>
              <div className="w-1/2">
                <Select
                  sx={{
                    ".MuiInputBase-input": { padding: 1, width: 100 },
                  }}
                  name="overTimeDay"
                  value={overTimeDay}
                  onChange={(e) => setOverTimeDay(e.target.value)}
                >
                  <MenuItem value={1}>1 giờ</MenuItem>
                  <MenuItem value={2}>2 giờ</MenuItem>
                  <MenuItem value={3}>3 giờ</MenuItem>
                  <MenuItem value={4}>4 giờ</MenuItem>
                  <MenuItem value={5}>5 giờ</MenuItem>
                  <MenuItem value={6}>6 giờ</MenuItem>
                  <MenuItem value={7}>7 giờ</MenuItem>
                  <MenuItem value={8}>8 giờ</MenuItem>
                  <MenuItem value={9}>9 giờ</MenuItem>
                  <MenuItem value={10}>10 giờ</MenuItem>
                  <MenuItem value={11}>11 giờ</MenuItem>
                  <MenuItem value={12}>12 giờ</MenuItem>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default TimeUsingModal;
