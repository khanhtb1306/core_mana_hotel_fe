import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";

function DetailsCategoryRoom(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openListRoom, setOpenListRoom] = useState(false);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axiosPrivate.get(
          "room-class/" + props.cateRoomId
        );
        setCategory(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategory();
  }, []);

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenListRoom(false);
  };

  const handleListRoom = () => {
    setOpenInfo(false);
    setOpenListRoom(true);
  };

  const columnsRoom = [
    { field: "name", headerName: "Tên phòng", width: 150 },
    { field: "area", headerName: "Khu vực", width: 200 },
    { field: "status", headerName: "Trạng thái", width: 200 },
  ];

  let rowsRoom = [];
  if (category) {
    rowsRoom = category.listRoom.map((room) => {
      const status = room.status ? "Đang hoạt động" : "Ngừng hoạt động";
      return {
        id: room.roomId,
        name: room.roomName,
        area: room.floor.floorName,
        status: status,
      };
    });
  }

  return (
    category && (
      <Modal
        open={props.open}
        onClose={props.onClose}
        reset={props.onClose}
        button={true}
        size="w-8/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thông tin hạng phòng</h1>
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
                    openListRoom ? "border-b-2 border-green-500 ring-0" : ""
                  }`}
                  onClick={handleListRoom}
                >
                  Danh sách phòng
                </button>
              </div>
            </div>
          </div>
          {openInfo ? (
            <>
              <div className="flex">
                <div className="w-4/12">
                  <ImageDisplay
                    image1={
                      category.roomCategory.image
                        ? `data:image/png;base64,${category.roomCategory.image}`
                        : null
                    }
                  />
                </div>
                <div className="w-8/12 mx-5">
                  <table className="m-4 w-full">
                    <tbody>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Mã hạng phòng:</td>
                        <td className="w-7/12 pt-2">
                          {category.roomCategory.roomCategoryId}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Tên hạng phòng:</td>
                        <td className="w-7/12 pt-2">
                          {category.roomCategory.roomCategoryName
                            ? category.roomCategory.roomCategoryName
                            : ""}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Số lượng phòng:</td>
                        <td className="w-7/12 pt-2">
                          {category.listRoom.length
                            ? category.listRoom.length
                            : 0}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Sức chứa:</td>
                        <td className="w-7/12 pt-2">
                          <div className="flex">
                            <div className="mr-16">
                              Người lớn:{" "}
                              {category.roomCategory.numOfAdults
                                ? category.roomCategory.numOfAdults
                                : 0}
                            </div>
                            <div>
                              Trẻ em:{" "}
                              {category.roomCategory.numOfChildren
                                ? category.roomCategory.numOfChildren
                                : 0}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="mr-5">
                              Người lớn tối đa:{" "}
                              {category.roomCategory.numMaxOfAdults
                                ? category.roomCategory.numMaxOfAdults
                                : 0}
                            </div>
                            <div>
                              Trẻ em tối đa:{" "}
                              {category.roomCategory.numMaxOfChildren
                                ? category.roomCategory.numMaxOfChildren
                                : 0}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Diện tích:</td>
                        <td className="w-7/12 pt-2">
                          {category.roomCategory.roomArea
                            ? category.roomCategory.roomArea
                            : 0}
                            (m<sup>2</sup>)
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Giá theo giờ:</td>
                        <td className="w-7/12 pt-2">
                          {category.roomCategory.priceByHour
                            ? category.roomCategory.priceByHour.toLocaleString()
                            : 0}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Giá theo ngày:</td>
                        <td className="w-7/12 pt-2">
                          {category.roomCategory.priceByDay
                            ? category.roomCategory.priceByDay.toLocaleString()
                            : 0}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Giá theo đêm:</td>
                        <td className="w-7/12 pt-2">
                          {category.roomCategory.priceByNight
                            ? category.roomCategory.priceByNight.toLocaleString()
                            : 0}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Mô tả chi tiết</td>
                        <td className="w-7/12 pt-2">
                          {category.roomCategory.description
                            ? category.roomCategory.description
                            : ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
          {openListRoom ? (
            <>
              <DataGrid
                columns={columnsRoom}
                rows={rowsRoom}
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

export default DetailsCategoryRoom;
