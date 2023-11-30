import dayjs from "dayjs";

export function getTimePrice(typeTime, fromTime, toTime, timeUsing, listPrice) {
  const priceNightStart = timeUsing.startTimeNight.split(":")[0];
  const priceNightEnd = timeUsing.endTimeNight.split(":")[0];
  const priceDayStart = timeUsing.startTimeDay.split(":")[0];
  const priceDayEnd = timeUsing.endTimeDay.split(":")[0];
  const timeBonusDay = timeUsing.timeBonusDay;
  const timeBonusHour = timeUsing.timeBonusHour;
  let price = 0;
  let time = 0;
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
    time = hoursList.length;
    hoursList.map((hour) => {
      listPrice.map((priceDetails) => {
        if (
          priceDetails.PriceListDetail.timeApply &&
          dayjs(priceDetails.PriceListDetail.timeApply).isSame(hour)
        ) {
          price += priceDetails.PriceListDetail.priceByHour;
          return;
        } else {
          if (
            priceDetails.DayOfWeekList.includes(hour.day() + 1 + "") ||
            priceDetails.DayOfWeekList.includes(hour.day() + 8 + "")
          ) {
            price += priceDetails.PriceListDetail.priceByHour;
          }
        }
      });
    });
  } else if (typeTime === 2) {
    const daysList = [];
    let currentDay = fromTime.hour(priceDayStart).minute(0);
    let soonHour = currentDay.diff(fromTime, "hour");
    if (fromTime.minute() <= timeBonusHour) {
      soonHour += 1;
    }
    if (soonHour >= timeBonusDay) {
      daysList.push(fromTime);
    }
    while (currentDay.isBefore(toTime.hour(priceDayEnd).minute(0))) {
      daysList.push(currentDay);
      currentDay = currentDay.add(1, "day");
    }
    currentDay = currentDay.hour(priceDayEnd).minute(0);
    let lateHour = toTime.diff(currentDay, "hour");
    if (toTime.minute() >= timeBonusHour) {
      lateHour += 1;
    }
    if (lateHour >= timeBonusDay) {
      daysList.push(currentDay);
    }
    time = daysList.length;
    daysList.map((day) => {
      listPrice.map((priceDetails) => {
        if (
          priceDetails.PriceListDetail.timeApply &&
          dayjs(priceDetails.PriceListDetail.timeApply).isSame(day)
        ) {
          price += priceDetails.PriceListDetail.priceByDay;
          return;
        } else {
          if (
            priceDetails.DayOfWeekList.includes(day.day() + 1 + "") ||
            priceDetails.DayOfWeekList.includes(day.day() + 8 + "")
          ) {
            price += priceDetails.PriceListDetail.priceByDay;
          }
        }
      });
    });
  } else {
    time = 1;
    listPrice.map((priceDetails) => {
      if (
        priceDetails.PriceListDetail.timeApply &&
        dayjs(priceDetails.PriceListDetail.timeApply).isSame(fromTime)
      ) {
        price = priceDetails.PriceListDetail.priceByNight;
        return;
      } else {
        if (
          priceDetails.DayOfWeekList.includes(fromTime.day() + 1 + "") ||
          priceDetails.DayOfWeekList.includes(fromTime.day() + 8 + "")
        ) {
          price = priceDetails.PriceListDetail.priceByNight;
        }
      }
    });
  }
  return {
    price: price,
    time: time,
  };
}
