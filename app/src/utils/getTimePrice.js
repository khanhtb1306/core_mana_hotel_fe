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
  let list = [];
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
    // if (time === 0 && toTime.diff(fromTime, "minute") > timeBonusHour) {
    //   time = 1;
    //   hoursList.push(fromTime);
    // }
    hoursList.map((hour) => {
      let priceRoom = 0;
      listPrice.map((priceDetails) => {
        if (
          priceDetails.PriceListDetail.timeApply &&
          dayjs(priceDetails.PriceListDetail.timeApply).isSame(hour, "date")
        ) {
          console.log(1);
          price += priceDetails.PriceListDetail.priceByHour;
          priceRoom = priceDetails.PriceListDetail.priceByHour;
          return;
        } else {
          if (
            priceDetails.DayOfWeekList.includes(hour.day() + 1 + "") ||
            priceDetails.DayOfWeekList.includes(hour.day() + 8 + "")
          ) {
            price += priceDetails.PriceListDetail.priceByHour;
            priceRoom = priceDetails.PriceListDetail.priceByHour;
          }
        }
      });
      list.push(hour.format("YYYY/MM/DD HH:mm:ss") + "|" + priceRoom);
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
    // if (time === 0 && toTime.diff(fromTime, "hour") > timeBonusDay) {
    //   time = 1;
    //   daysList.push(fromTime);
    // }
    daysList.map((day) => {
      let priceRoom = 0;
      listPrice.map((priceDetails) => {
        if (
          priceDetails.PriceListDetail.timeApply &&
          dayjs(priceDetails.PriceListDetail.timeApply).isSame(day, "date")
        ) {
          price += priceDetails.PriceListDetail.priceByDay;
          priceRoom = priceDetails.PriceListDetail.priceByDay;
          return;
        } else {
          if (
            priceDetails.DayOfWeekList.includes(day.day() + 1 + "") ||
            priceDetails.DayOfWeekList.includes(day.day() + 8 + "")
          ) {
            price += priceDetails.PriceListDetail.priceByDay;
            priceRoom = priceDetails.PriceListDetail.priceByDay;
          }
        }
      });
      list.push(day.format("YYYY/MM/DD HH:mm:ss") + "|" + priceRoom);
    });
  } else {
    time = 1;
    let priceRoom = 0;
    listPrice.map((priceDetails) => {
      if (
        priceDetails.PriceListDetail.timeApply &&
        dayjs(priceDetails.PriceListDetail.timeApply).isSame(fromTime, "date")
      ) {
        price = priceDetails.PriceListDetail.priceByNight;
        priceRoom = priceDetails.PriceListDetail.priceByNight;
        return;
      } else {
        if (
          priceDetails.DayOfWeekList.includes(fromTime.day() + 1 + "") ||
          priceDetails.DayOfWeekList.includes(fromTime.day() + 8 + "")
        ) {
          price = priceDetails.PriceListDetail.priceByNight;
          priceRoom = priceDetails.PriceListDetail.priceByNight;
        }
      }
    });
    list.push(
      fromTime.hour(priceNightStart).format("YYYY/MM/DD HH:mm:ss") +
        "|" +
        priceRoom
    );
  }
  return {
    price: price,
    time: time,
    list: list,
  };
}

export function getSoonCheckin(typeTime, fromTime, timeUsing) {
  const priceNightStart = timeUsing.startTimeNight.split(":")[0];
  const priceNightEnd = timeUsing.endTimeNight.split(":")[0];
  const priceDayStart = timeUsing.startTimeDay.split(":")[0];
  const priceDayEnd = timeUsing.endTimeDay.split(":")[0];
  const timeBonusDay = timeUsing.timeBonusDay;
  const timeBonusHour = timeUsing.timeBonusHour;
  if (typeTime === 2) {
    let plusHour = fromTime.hour(priceDayStart).diff(fromTime, "hour");
    if (fromTime.minute() > timeBonusHour) {
      plusHour -= 1;
    }
    if (fromTime.hour() <= priceDayStart && plusHour < timeBonusDay) {
      return plusHour;
    } else {
      return 0;
    }
  }
  if (typeTime === 3) {
    let plusHour = priceNightStart - fromTime.hour() - 1;
    if (fromTime.minute() <= timeBonusHour) {
      plusHour += 1;
    }
    if (fromTime.hour() <= priceNightStart && plusHour > 0) {
      return plusHour;
    } else {
      return 0;
    }
  }
}

export function getlateCheckout(typeTime, fromTime, toTime, timeUsing) {
  const priceNightStart = timeUsing.startTimeNight.split(":")[0];
  const priceNightEnd = timeUsing.endTimeNight.split(":")[0];
  const priceDayStart = timeUsing.startTimeDay.split(":")[0];
  const priceDayEnd = timeUsing.endTimeDay.split(":")[0];
  const timeBonusDay = timeUsing.timeBonusDay;
  const timeBonusHour = timeUsing.timeBonusHour;
  if (typeTime === 2) {
    let plusHour = toTime.diff(toTime.hour(priceDayEnd), "hour");
    if (toTime.minute() >= timeBonusHour) {
      plusHour += 1;
    }
    if (toTime.hour() >= priceDayEnd && plusHour < timeBonusDay) {
      return plusHour;
    } else {
      return 0;
    }
  }
  if (typeTime === 3) {
    let lateHour = toTime.diff(
      fromTime.add(1, "day").hour(priceNightEnd).minute(0),
      "hour"
    );
    if (toTime.minute() >= timeBonusHour) {
      lateHour += 1;
    }
    if (fromTime.add(1, "day").hour(priceNightEnd).minute(0) < toTime) {
      return lateHour;
    } else {
      return 0;
    }
  }
}
