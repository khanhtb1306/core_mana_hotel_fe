import { useState } from "react";
import SelectRoom from "../Reservation/SelectRoom";
import SearchCustomer from "../Search/SearchCustomer";
import { useLoaderData } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";

function ReservationForm(props) {
  const { customers, prices, categories } = useLoaderData();
  const reservation = props.reservation;
  const allPrices = [
    {
      ListPriceListDetail: categories.map((cate) => {
        return {
          PriceListDetailWithDayOfWeek: [
            {
              DayOfWeekList: ["2", "3", "4", "5", "6", "7", "8"],
              PriceListDetail: {
                priceByDay: cate.roomCategory.priceByDay,
                priceByHour: cate.roomCategory.priceByHour,
                priceByNight: cate.roomCategory.priceByNight,
                timeApply: null,
              },
            },
          ],
          RoomClass: cate.roomCategory,
        };
      }),
      PriceList: {
        priceListId: "0",
        priceListName: "Bảng giá chung",
        effectiveTimeStart: "2000-08-02T17:00:00.000+00:00",
        effectiveTimeEnd: "3000-08-02T17:00:00.000+00:00",
        note: "",
      },
    },
    ...prices,
  ];
  // console.log(allPrices);
  const [listRooms, setListRooms] = useState(
    reservation.listReservationDetails
  );
  let priceByCateRoom = null;
  let priceById = null;
  if (reservation) {
    priceById = allPrices.find(
      (price) =>
        price.PriceList.priceListId ===
        reservation.reservation.priceList.priceListId
    );
    priceByCateRoom = priceById.ListPriceListDetail.find(
      (details) =>
        details.RoomClass.roomCategoryId ===
        listRooms[0].room.roomCategory.roomCategoryId
    ).PriceListDetailWithDayOfWeek;
  }
  console.log(priceByCateRoom);
  const [roomActive, setRoomActive] = useState(listRooms ? listRooms[0] : null);
  const [priceBook, setPriceBook] = useState(priceById);
  const [price, setPrice] = useState(priceByCateRoom);
  // console.log(roomActive);

  const handlePriceBookChange = (event) => {
    const priceById = allPrices.find(
      (price) => price.PriceList.priceListId === event.target.value
    );
    setPrice(
      priceById.ListPriceListDetail.find(
        (details) =>
          details.RoomClass.roomCategoryId ===
          roomActive.room.roomCategory.roomCategoryId
      ).PriceListDetailWithDayOfWeek
    );
    setPriceBook(priceById);
  };

  const handleRoomChange = (room) => {
    setRoomActive(room);
  };

  return (
    <div className="h-[45.5rem] px-5">
      {roomActive && (
        <>
          <div className="w-full py-2 h-1/6">
            <div className="flex">
              <SearchCustomer customers={customers} />
              <div className="ml-auto">
                <Select
                  sx={{ width: 200, height: 40, backgroundColor: "white" }}
                  value={priceBook.PriceList.priceListId}
                  onChange={handlePriceBookChange}
                >
                  {allPrices.map((price) => {
                    const details = price.PriceList;
                    return (
                      <MenuItem
                        key={details.priceListId}
                        value={details.priceListId}
                      >
                        {details.priceListName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className="flex my-auto rounded-lg py-2">
              <div className="px-2 py-1 mr-2 rounded-lg bg-white">
                {listRooms.map((room, index) => {
                  let status = 3;
                  if (room.status === "CHECK_IN") {
                    status = 2;
                  } else if (room.status === "BOOKING") {
                    status = 1;
                  }
                  return status === 1 ? (
                    <button
                      key={index}
                      type="button"
                      className={`px-2 py-1 ${
                        room.reservationDetailId ===
                        roomActive.reservationDetailId
                          ? "bg-orange-500 text-white"
                          : "text-orange-500 hover:bg-orange-200"
                      } rounded`}
                      onClick={() => handleRoomChange(room)}
                    >
                      {room.room.roomName}
                      <i className="fa-solid fa-xmark pl-2"></i>
                    </button>
                  ) : status === 2 ? (
                    <button
                      key={index}
                      type="button"
                      className={`px-2 py-1 ${
                        room.reservationDetailId ===
                        roomActive.reservationDetailId
                          ? "bg-green-500 text-white"
                          : "text-green-500 hover:bg-green-200"
                      } rounded`}
                      onClick={() => handleRoomChange(room)}
                    >
                      {room.room.roomName}
                    </button>
                  ) : (
                    <button
                      key={index}
                      type="button"
                      className={`px-2 py-1 ${
                        room.reservationDetailId ===
                        roomActive.reservationDetailId
                          ? "bg-gray-500 text-white"
                          : "text-gray-500 hover:bg-gray-200"
                      } rounded`}
                      onClick={() => handleRoomChange(room)}
                    >
                      {room.room.roomName}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-green-500 hover:bg-green-100"
              >
                <i className="fa-solid fa-circle-plus pr-2"></i>
                Phòng
              </button>
              {roomActive.status === "BOOKING" && (
                <button
                  type="button"
                  className="px-4 py-2 ml-auto rounded-lg text-white bg-green-500 hover:bg-green-600"
                >
                  Nhận phòng
                </button>
              )}
              {roomActive.status === "CHECK_IN" && (
                <button
                  type="button"
                  className="px-4 py-2 ml-auto rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                >
                   Trả phòng
                </button>
              )}
              <button
                type="button"
                className="px-4 py-2 ml-2 rounded-lg border-black border"
              >
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </button>
            </div>
          </div>
          <div className="w-full py-2 h-4/6">
            {listRooms.map((room, index) => {
              if (room.reservationDetailId === roomActive.reservationDetailId) {
                return (
                  <div key={index}>
                    <SelectRoom
                      room={room}
                      listRoomByRes={reservation.listReservationDetails.filter(
                        (res) => res.room.roomId !== room.room.roomId
                      )}
                      price={price}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={index} className="hidden">
                    <SelectRoom
                      room={room}
                      listRoomByRes={reservation.listReservationDetails.filter(
                        (res) => res.room.roomId !== room.room.roomId
                      )}
                      price={price}
                    />
                  </div>
                );
              }
            })}
          </div>
          <div className="w-full py-2 h-1/6">3</div>
        </>
      )}
    </div>
  );
}

export default ReservationForm;
