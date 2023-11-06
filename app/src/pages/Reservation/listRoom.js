import { useState } from "react";
import ReservationLayout from "../ReservationLayout";
import { Checkbox, FormControlLabel } from "@mui/material";
import { orange, green, grey } from "@mui/material/colors";
import { defer, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import DetailsReservation from "../../components/Reservation/DetailsReservation";

function ListRoomPage() {
  const { floors } = useLoaderData();
  console.log(floors);
  const [listFloors, setListFloors] = useState(floors);
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);

  const [openDetailsReservationModal, setOpenDetailsReservationModal] =
    useState(false);

  const handleCheckboxChange1 = (event) => {};
  const handleCheckboxChange2 = (event) => {};
  const handleCheckboxChange3 = (event) => {};

  return (
    <div className="h-full px-4 mx-auto mt-2">
      <div className="flex">
        <div>
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                checked={isChecked1}
                onChange={handleCheckboxChange1}
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
                checked={isChecked2}
                onChange={handleCheckboxChange2}
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
                checked={isChecked3}
                onChange={handleCheckboxChange3}
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
          <button
            type="button"
            className="bg-green-500 p-2 rounded-lg text-white"
          >
            <i className="fa-solid fa-plus px-2"></i>
            <span className="pr-2">Đặt phòng</span>
          </button>
        </div>
      </div>
      <ReservationLayout isActive={false} />
      {listFloors.map((floor) => {
        if (floor.roomListWithRDs.length > 0) {
          return (
            <div className="w-full">
              <div className="border-t-2 pt-2">
                <div className="flex mb-2 mt-1">
                  <h2 className="font-bold mr-2">{floor.floor[0].floorName}</h2>
                  <div className="bg-green-500 rounded-full px-2">
                    {floor.roomListWithRDs.length}
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {floor.roomListWithRDs.map((room) => {
                    let isUsing = false;
                    if (room.room.bookingStatus === "ROOM_USING") {
                      isUsing = true;
                    }
                    let isClean = false;
                    if (room.room.conditionStatus == "ROOM_CLEAN") {
                      isClean = true;
                    }
                    return isUsing ? (
                      <>
                        <button
                          type="button"
                          className="mb-2 p-4 rounded-lg border border-green-600 bg-green-200 hover:shadow-lg hover:shadow-green-200"
                          onClick={() => console.log("1")}
                        >
                          <div className="flex">
                            <div className="bg-green-500 text-white rounded px-2 py-1">
                              {room.room.roomName}
                            </div>
                            {isClean ? (
                              <>
                                <div className="ml-auto pr-4">
                                  <div className="text-green-500">
                                    <i className="fa-solid fa-spray-can-sparkles pr-2"></i>
                                    Sạch
                                  </div>
                                </div>
                                <div>
                                  <div
                                    className="text-red-500 hover:bg-gray-300 px-1 rounded-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log("123");
                                    }}
                                  >
                                    <i className="fa-solid fa-broom"></i>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="ml-auto pr-4">
                                  <div className="text-red-500">
                                    <i className="fa-solid fa-broom pr-2"></i>
                                    Chưa dọn
                                  </div>
                                </div>
                                <div>
                                  <div
                                    className="text-green-500 hover:bg-gray-300 px-1 rounded-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log("123");
                                    }}
                                  >
                                    <i className="fa-solid fa-spray-can-sparkles"></i>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="text-left py-2">Khách lẻ</div>
                          <p className="text-left mt-2 text-sm bg-gray-200 px-1 rounded w-8/12">
                            1 ngày / 1 ngày
                          </p>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="mb-2 p-4 rounded-lg border border-gray-600 bg-white hover:shadow-lg hover:shadow-gray-200"
                        onClick={() => {
                          console.log("1");
                        }}
                      >
                        <div className="flex">
                          <div className="bg-gray-500 text-white rounded px-2 py-1">
                            {room.room.roomName}
                          </div>
                          {isClean ? (
                            <>
                              <div className="ml-auto pr-4">
                                <div className="text-green-500">
                                  <i className="fa-solid fa-spray-can-sparkles pr-2"></i>
                                  Sạch
                                </div>
                              </div>
                              <div>
                                <div
                                  className="text-red-500 hover:bg-gray-300 px-1 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("123");
                                  }}
                                >
                                  <i className="fa-solid fa-broom"></i>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="ml-auto pr-4">
                                <div className="text-red-500  ">
                                  <i className="fa-solid fa-broom pr-2"></i>Chưa
                                  dọn
                                </div>
                              </div>
                              <div>
                                <div
                                  className="text-green-500 hover:bg-gray-300 px-1 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("123");
                                  }}
                                >
                                  <i className="fa-solid fa-spray-can-sparkles"></i>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="text-left py-2">
                          <h3>{room.room.roomCategory.roomCategoryName}</h3>
                          <p className="text-gray-500 text-xs">{`${room.room.roomCategory.priceByHour}/Giờ - ${room.room.roomCategory.priceByDay}/Ngày - ${room.room.roomCategory.priceByNight}/Đêm`}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }
      })}
      {openDetailsReservationModal && <DetailsReservation reservation={null} />}
    </div>
  );
}

export default ListRoomPage;

async function loadFloors() {
  const response = await axiosPrivate.get("Floor/list-by-floor");
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("/login");
  }
}

export async function loader() {
  return defer({
    floors: await loadFloors(),
  });
}
