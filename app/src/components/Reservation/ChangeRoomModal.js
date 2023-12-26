import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Modal from "../UI/Modal";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Form, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import { getTimePrice } from "../../utils/getTimePrice";
import {
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { axiosPrivate } from "../../utils/axiosConfig";

function ChangeRoomModal(props) {
  const { timeUsing } = useLoaderData();
  const roomActive = props.roomActive;
  // console.log(roomActive);
  const roomCategoryId = roomActive.room.roomCategory.roomCategoryId;
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [listRoom, setListRoom] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(1);
  const [selectedType, setSelectedType] = useState("1");
  const priceNightStart = timeUsing.startTimeNight.split(":")[0];
  const priceNightEnd = timeUsing.endTimeNight.split(":")[0];
  const priceDayStart = timeUsing.startTimeDay.split(":")[0];
  const priceDayEnd = timeUsing.endTimeDay.split(":")[0];
  const timeBonusDay = timeUsing.timeBonusDay;
  const timeBonusHour = timeUsing.timeBonusHour;
  const medium = 24 - Math.abs(priceDayEnd - priceDayStart);
  const listPrice = props.price;
  let fromTime = dayjs();
  let toTime = dayjs();
  if (roomActive.status === "BOOKING") {
    fromTime = dayjs(roomActive.checkInEstimate);
    toTime = dayjs(roomActive.checkOutEstimate);
  } else if (roomActive.status === "CHECK_IN") {
    fromTime = dayjs(roomActive.checkInActual);
    toTime = dayjs(roomActive.checkOutEstimate);
  }

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axiosPrivate.get(
          "reservation/list-empty-rooms?startDate=" +
            fromTime.format("YYYY-MM-DD HH:mm:ss") +
            "&endDate=" +
            toTime.format("YYYY-MM-DD HH:mm:ss") +
            "&reservationId=" +
            roomActive.reservation.reservationId
        );
        if (response.data.success) {
          setCategories(response.data.result);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategory();
  }, []);
  let listUpdateAfter = [];
  let listUpdateBefore = [];
  let historyPrice = [];
  const listPriceRoom = props.listPriceRoom.PriceHistoryOverTime;
  if (roomActive.status === "BOOKING") {
    if (selectedType === "2") {
      const listNewPrice = props.listAllPrice.find(
        (details) => details.RoomClass.roomCategoryId === selectedCategory
      ).PriceListDetailWithDayOfWeek;
      if (roomActive.reservationType === "HOURLY") {
        historyPrice = [
          ...getTimePrice(1, fromTime, toTime, timeUsing, listNewPrice).list,
        ];
      } else if (roomActive.reservationType === "DAILY") {
        historyPrice = [
          ...getTimePrice(2, fromTime, toTime, timeUsing, listNewPrice).list,
        ];
      } else {
        historyPrice = [
          ...getTimePrice(3, fromTime, toTime, timeUsing, listNewPrice).list,
        ];
      }
    } else {
      historyPrice = [...listPriceRoom];
    }
  } else {
    const listBefore = listPriceRoom.filter(
      (priceRoom) => dayjs().diff(dayjs(priceRoom.time)) > 0
    );
    listUpdateBefore = listBefore.map((priceRoom, index) => {
      if (index === listBefore.length - 1) {
        const price = Math.round(
          (priceRoom.price / medium) *
            dayjs().diff(dayjs(priceRoom.time), "hour")
        );
        return priceRoom.time + "|" + price;
      } else {
        return priceRoom.time + "|" + priceRoom.price;
      }
    });
    const listAfter = listPriceRoom.filter(
      (priceRoom) => dayjs().diff(dayjs(priceRoom.time)) < 0
    );
    if (selectedType === "1") {
      const price =
        listBefore[listBefore.length - 1].price -
        listUpdateBefore[listUpdateBefore.length - 1].split("|")[1];
      listUpdateAfter = [
        ...[dayjs().format("YYYY/MM/DD HH:mm:ss") + "|" + price],
        ...listAfter.map((after) => {
          return after.time + "|" + after.price;
        }),
      ];
    } else {
      const listNewPrice = props.listAllPrice.find(
        (details) => details.RoomClass.roomCategoryId === selectedCategory
      ).PriceListDetailWithDayOfWeek;
      if (listAfter.length > 0) {
        const price = Math.round(
          (getTimePrice(
            roomActive.reservationType === "DAILY" ? 2 : 1,
            dayjs(),
            dayjs(listAfter[0].time),
            timeUsing,
            listNewPrice
          ).price /
            medium) *
            dayjs(listAfter[0].time).diff(dayjs(), "hour")
        );
        listUpdateAfter = [
          ...[dayjs().format("YYYY/MM/DD HH:mm:ss") + "|" + price],
        ];
      }
      listUpdateAfter = [
        ...listUpdateAfter,
        ...getTimePrice(
          roomActive.reservationType === "DAILY" ? 2 : 1,
          dayjs().hour(priceDayStart).minute(0),
          toTime,
          timeUsing,
          listNewPrice
        ).list,
      ];
    }
  }
  console.log(listUpdateAfter);

  const handleCateRoomChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setListRoom([
      ...categories.find((cate) => cate.roomClass.roomCategoryId === categoryId)
        .listRoom,
    ]);
    setSelectedRoom("0");
    setSelectedType("1");
  };

  const handleRoomChange = (e) => {
    const roomId = e.target.value;
    setSelectedRoom(roomId);
  };

  return (
    <Form
      method="PUT"
      onSubmit={() => {
        props.onClose();
        if (props.onCloseAll) {
          props.onCloseAll();
        }
      }}
    >
      <Modal
        open={props.open}
        onClose={props.onClose}
        button={true}
        size="w-4/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">
              Xác nhận đổi phòng - {roomActive.reservation.reservationId}
            </h1>
            <input type="hidden" name="isChangeRoom" defaultValue={true} />
            <input
              type="hidden"
              name="reservationId"
              defaultValue={roomActive.reservation.reservationId}
            />
            <input
              type="hidden"
              name="reservationDetailId"
              defaultValue={roomActive.reservationDetailId}
            />
            <input
              type="hidden"
              name="status"
              value={roomActive.status}
              onChange={() => console.log()}
            />
            <input
              type="hidden"
              name="oldRoomId"
              value={roomActive.room.roomId}
              onChange={() => console.log()}
            />
            <input
              type="hidden"
              name="roomId"
              value={selectedRoom}
              onChange={() => console.log()}
            />
            <input
              type="hidden"
              name="reservationType"
              value={roomActive.reservationType}
              onChange={() => console.log()}
            />
            {roomActive.status === "CHECK_IN" && (
              <>
                <input
                  type="hidden"
                  name="radio"
                  value={selectedRadio}
                  onChange={() => console.log()}
                />
                {selectedRadio === "2" && (
                  <>
                    <input
                      type="hidden"
                      name="historyPrice1"
                      value={listUpdateBefore}
                      onChange={() => console.log()}
                    />
                    <input
                      type="hidden"
                      name="historyPrice2"
                      value={listUpdateAfter}
                      onChange={() => console.log()}
                    />
                  </>
                )}
              </>
            )}
            <input
              type="hidden"
              name="fromTime"
              value={fromTime.format("YYYY-MM-DD HH:mm:ss")}
              onChange={() => console.log()}
            />
            <input
              type="hidden"
              name="toTime"
              value={toTime.format("YYYY-MM-DD HH:mm:ss")}
              onChange={() => console.log()}
            />
            <input
              type="hidden"
              name="historyPrice"
              value={historyPrice.map((price) => {
                return price.time + "|" + price.price;
              })}
              onChange={() => console.log()}
            />
          </div>
          {roomActive.status === "CHECK_IN" && (
            <div>
              <h2 className="font-medium text-medium">Bạn muốn:</h2>
              <RadioGroup
                value={selectedRadio}
                onChange={(e) => {
                  setSelectedRadio(e.target.value);
                }}
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Chuyển toàn bộ thời gian sử dụng sang phòng mới"
                  sx={{
                    "& .MuiFormControlLabel-label": { fontSize: "0.875rem" },
                  }}
                />
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label="Tính thời gian sử dụng ở cả 2 phòng"
                  sx={{
                    "& .MuiFormControlLabel-label": { fontSize: "0.875rem" },
                  }}
                />
              </RadioGroup>
            </div>
          )}
          <div>
            <h2>Chọn phòng bạn muốn đổi sang:</h2>
            <div className="flex mt-2">
              <Select
                sx={{ width: 250, height: 40, marginRight: 5 }}
                value={selectedCategory}
                onChange={handleCateRoomChange}
              >
                {categories.map((cate) => {
                  return (
                    <MenuItem
                      key={cate.roomClass.roomCategoryId}
                      value={cate.roomClass.roomCategoryId}
                    >
                      {cate.roomClass.roomCategoryName}
                    </MenuItem>
                  );
                })}
              </Select>
              <Select
                sx={{ width: 150, height: 40 }}
                value={selectedRoom}
                onChange={handleRoomChange}
              >
                {listRoom.map((room) => {
                  return (
                    <MenuItem key={room.roomId} value={room.roomId}>
                      {room.roomName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
          {selectedCategory !== 0 && selectedCategory !== roomCategoryId && (
            <div>
              <h2 className="font-medium text-medium mt-2">
                Có thay đổi về hạng phòng, bạn muốn:
              </h2>
              <RadioGroup
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                }}
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Giữ nguyên giá phòng cũ"
                  sx={{
                    "& .MuiFormControlLabel-label": { fontSize: "0.875rem" },
                  }}
                />
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label="Sử dụng giá phòng mới"
                  sx={{
                    "& .MuiFormControlLabel-label": { fontSize: "0.875rem" },
                  }}
                />
              </RadioGroup>
            </div>
          )}
        </div>

        {selectedRoom !== "0" && (
          <div className="flex pt-5 mr-2">
            <div className="ml-auto">
              <button className="bg-green-500 py-2 px-6 text-white rounded hover:bg-green-600">
                Xong
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Form>
  );
}

export default ChangeRoomModal;
