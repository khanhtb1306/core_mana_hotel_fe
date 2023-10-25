import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";

function DetailsRoom(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openReservation, setOpenReservation] = useState(false);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    async function fetchRoom() {
      try {
        const response = await axiosPrivate.get("room/" + props.roomId);
        setRoom(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRoom();
  }, []);

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenReservation(false);
  };

  const handleReservation = () => {
    setOpenInfo(false);
    setOpenReservation(true);
  };

  const columnsReser = [
    { field: "idReservation", headerName: "Mã đặt phòng", width: 150 },
    { field: "time", headerName: "Thời gian đặt", width: 200 },
    { field: "recept", headerName: "Lễ tân đặt", width: 150 },
    { field: "sum", headerName: "Tổng cộng", width: 150 },
  ];

  const rowsReser = [
    {
      id: 1,
      idReservation: "HP000075",
      time: "26/09/2023",
      recept: "tien",
      sum: 5000000,
    },
  ];

  if (room) {
  }

  return (
    room && (
      <Modal
        open={props.open}
        onClose={props.onClose}
        reset={props.onClose}
        button={true}
        size="w-8/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thông tin phòng</h1>
            <div className="flex w-5/12">
              <div className="w-6/12">
                <button
                  className={`border-0 border-b border-gray-500 w-full ${
                    openInfo ? "border-b-2 border-green-500 ring-0" : ""
                  }`}
                  onClick={handleInfo}
                >
                  Thông tin
                </button>
              </div>
              <div className="w-6/12">
                <button
                  className={`border-0 border-b border-gray-500 w-full ${
                    openReservation ? "border-b-2 border-green-500 ring-0" : ""
                  }`}
                  onClick={handleReservation}
                >
                  Lịch sử đặt phòng
                </button>
              </div>
            </div>
          </div>
          {openInfo ? (
            <>
              <div className="flex">
                <div className="w-4/12">
                  <ImageDisplay
                    image1={room.image ? `data:image/png;base64,${room.image}` : null}
                  />
                </div>
                <div className="w-8/12 mx-5">
                  <table className="m-4 w-full">
                    <tbody>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Tên phòng:</td>
                        <td className="w-7/12 pt-2">{room.roomName}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Hạng phòng:</td>
                        <td className="w-7/12 pt-2">
                          {room.roomCategory.roomCategoryName}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Khu vực:</td>
                        <td className="w-7/12 pt-2">{room.floor.floorName}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Giá theo giờ:</td>
                        <td className="w-7/12 pt-2">
                          {room.roomCategory.priceByHour.toLocaleString()}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Giá theo ngày:</td>
                        <td className="w-7/12 pt-2">
                          {room.roomCategory.priceByDay.toLocaleString()}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Giá theo đêm:</td>
                        <td className="w-7/12 pt-2">
                          {room.roomCategory.priceByNight.toLocaleString()}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Chú ý:</td>
                        <td className="w-7/12 pt-2">{room.note}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
          {openReservation ? (
            <>
              <DataGrid
                columns={columnsReser}
                rows={rowsReser}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 25]}
              />
            </>
          ) : null}
        </div>
      </Modal>
    )
  );
}

export default DetailsRoom;