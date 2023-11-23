import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import dayjs from "dayjs";

function DetailsPriceInRoom(props) {
  const price = props.price;
  const toTime = props.toTime;
  const fromTime = props.fromTime;
  const typeTime = props.typeTime;
  const timeUsing = props.timeUsing;
  const priceNightStart = timeUsing.startTimeNight.split(":")[0];
  const priceNightEnd = timeUsing.endTimeNight.split(":")[0];
  const priceDayStart = timeUsing.startTimeDay.split(":")[0];
  const priceDayEnd = timeUsing.endTimeDay.split(":")[0];
  const timeBonusDay = timeUsing.timeBonusDay;
  const timeBonusHour = timeUsing.timeBonusHour;

  const columns = [
    { field: "time", headerName: "Thời gian", width: 400 },
    { field: "price", headerName: "Đơn giá", width: 300 },
  ];

  let rows = [];
  if (typeTime === 1) {
    const hoursList = [];
    let currentHour = fromTime;
    while (currentHour.isBefore(toTime)) {
      if (toTime.diff(currentHour, "minute") < timeBonusHour) {
        break;
      }
      hoursList.push(currentHour);
      currentHour = currentHour.add(1, "hour");
    }
    rows = hoursList.map((hour, index) => {
      let priceInHour = 0;
      price.map((priceDetails) => {
        if (
          priceDetails.PriceListDetail.timeApply &&
          dayjs(priceDetails.PriceListDetail.timeApply).isSame(hour)
        ) {
          priceInHour = priceDetails.PriceListDetail.priceByHour;
          return;
        } else {
          if (
            priceDetails.DayOfWeekList.includes(hour.day() + 1 + "") ||
            priceDetails.DayOfWeekList.includes(hour.day() + 8 + "")
          ) {
            priceInHour = priceDetails.PriceListDetail.priceByHour;
          }
        }
      });
      return {
        id: index,
        time: hour.format("dddd, DD/MM/YYYY HH:mm"),
        price: priceInHour.toLocaleString(),
      };
    });
  } else if (typeTime === 2) {
    const daysList = [];
    let currentDay = fromTime.hour(priceDayStart).minute(0);
    if (currentDay.diff(fromTime, "hour") >= timeBonusDay) {
      daysList.push(fromTime);
    }
    while (currentDay.isBefore(toTime.hour(priceDayEnd).minute(0))) {
      daysList.push(currentDay);
      currentDay = currentDay.add(1, "day");
    }
    currentDay = currentDay.hour(priceDayEnd).minute(0);
    if (toTime.diff(currentDay, "hour") >= timeBonusDay) {
      daysList.push(currentDay);
    }
    rows = daysList.map((day, index) => {
      let priceInDay = 0;
      price.map((priceDetails) => {
        if (
          priceDetails.PriceListDetail.timeApply &&
          dayjs(priceDetails.PriceListDetail.timeApply).isSame(day)
        ) {
          priceInDay = priceDetails.PriceListDetail.priceByDay;
          return;
        } else {
          if (
            priceDetails.DayOfWeekList.includes(day.day() + 1 + "") ||
            priceDetails.DayOfWeekList.includes(day.day() + 8 + "")
          ) {
            priceInDay = priceDetails.PriceListDetail.priceByDay;
          }
        }
      });
      return {
        id: index,
        time: day.format("dddd, DD/MM/YYYY"),
        price: priceInDay.toLocaleString(),
      };
    });
  } else {
    let priceInNight = 0;
    price.map((priceDetails) => {
      if (
        priceDetails.PriceListDetail.timeApply &&
        dayjs(priceDetails.PriceListDetail.timeApply).isSame(fromTime)
      ) {
        priceInNight = priceDetails.PriceListDetail.priceByDay;
        return;
      } else {
        if (
          priceDetails.DayOfWeekList.includes(fromTime.day() + 1 + "") ||
          priceDetails.DayOfWeekList.includes(fromTime.day() + 8 + "")
        ) {
          priceInNight = priceDetails.PriceListDetail.priceByDay;
        }
      }
    });
    rows = [
      {
        id: 1,
        time: fromTime.format("dddd, DD/MM/YYYY"),
        price: priceInNight.toLocaleString(),
      },
    ];
  }

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      reset={props.onClose}
      button={true}
      size="w-.5/12 h-.5/6"
    >
      <div className="p-2 w-full">
        <div className="mb-5">
          <h1 className="text-lg pb-5 font-bold">Chi tiết tiền phòng</h1>
        </div>
        <div className="flex">
          <DataGrid
            columns={columns}
            rows={rows}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </div>
      </div>
    </Modal>
  );
}

export default DetailsPriceInRoom;
