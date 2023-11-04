import { useState } from "react";
import SelectRoom from "../Reservation/SelectRoom";
import SearchCustomer from "../Search/SearchCustomer";
import { useLoaderData } from "react-router-dom";

function ReservationForm(props) {
  const { customers } = useLoaderData();
  const reservation = props.reservation;

  const [listRooms, setListRooms] = useState(
    reservation.listReservationDetails
  );

  const [roomActive, setRoomActive] = useState(listRooms ? listRooms[0] : null);

  const handleRoomChange = (room) => {
    setRoomActive(room);
  };

  return (
    <div className="h-[45.5rem] px-5">
      {roomActive && (
        <>
          <div className="w-full py-2 h-1/6">
            <SearchCustomer customers={customers} />
            <div className="flex my-auto rounded-lg py-2">
              <div className="px-2 py-1 mr-2 rounded-lg bg-white">
                {listRooms.map((room, index) => {
                  let status = 3;
                  if (room.room.bookingStatus === "ROOM_USING") {
                    status = 2;
                  } else if (room.room.bookingStatus === "ROOM_BOOKING") {
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
                      <i className="fa-solid fa-xmark pl-2"></i>
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
              <button
                type="button"
                className="px-4 py-2 ml-auto rounded-lg text-white bg-blue-500 hover:bg-blue-600"
              >
                Trả phòng
              </button>
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
