import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  viVN,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import ButtonHover from "../../components/UI/ButtonHover";
import NewRoom from "../../components/Room/NewRoom";
import NewCategoryRoom from "../../components/CategoryRoom/NewCategoryRoom";
import DeleteRoom from "../../components/Room/DeleteRoom";
import DetailsRoom from "../../components/Room/DetailsRoom";
import { axiosPrivate } from "../../utils/axiosConfig";
import RoomRootLayout from "../RoomLayout";
import {
  defer,
  redirect,
  useActionData,
  useLoaderData,
  useRouteLoaderData,
} from "react-router-dom";
import EditRoom from "../../components/Room/EditRoom";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import SetStatusRoom from "../../components/Room/SetStatusRoom";
import ButtonClick from "../../components/UI/ButtonClick";
import NewArea from "../../components/NewArea";
import EditArea from "../../components/UI/EditArea";
import DeleteArea from "../../components/Area/DeleteArea";

function RoomManagementPage() {
  const token = useRouteLoaderData("root");
  const { rooms, categories, floors } = useLoaderData();
  const [roomsByFloor, setRoomByFloor] = useState(rooms);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewRoomModal, setOpenNewRoomModal] = useState(false);
  const [openDeleteRoomsModal, setOpenDeleteRoomsModal] = useState(false);
  const [openDeleteRoomModal, setOpenDeleteRoomModal] = useState(false);
  const [openStatusRoomModal, setOpenStatusRoomModal] = useState(false);
  const [openNewCateRoomModal, setOpenNewCateRoomModal] = useState(false);
  const [openDetailsRoom, setOpenDetailsRoom] = useState(false);
  const [openEditRoom, setOpenEditRoom] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filteredFloors, setFilteredFloors] = useState([]);
  const [openNewAreaModal, setOpenNewAreaModal] = useState(false);
  const [openDeleteAreaModal, setOpenDeleteAreaModal] = useState(false);
  const [openEditAreaModal, setOpenEditAreaModal] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const handleEditArea = (floorId) => {
    setSelectedFloorId(floorId);
    setOpenEditAreaModal(true);
  };
  const handleDeleteArea = (floorId) => {
    setSelectedFloorId(floorId);
    setOpenDeleteAreaModal(true);
  };

  useEffect(() => {
    const filtered = floors.filter((floor) =>
      floor.floorName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredFloors(filtered);
  }, [floors, searchValue]);

  const [selectedFloorName, setSelectedFloorName] = useState(null);
  const handleSelectAllFloors = () => {
    setSelectedFloor(null);
    setSelectedFloorName(null);
    setRoomByFloor(rooms);
  };

  const handleFloorSelection = (floorName) => {
    setSelectedFloor(floorName);
    setSelectedFloorName(floorName);
  };

  useEffect(() => {
    const filtered = selectedFloor
      ? rooms.filter((room) => room.floor.floorName === selectedFloor)
      : rooms;
    setRoomByFloor(filtered);
  }, [rooms, selectedFloor]);

  const handleDetailsRoom = (id) => {
    setOpenDetailsRoom(true);
    setSelectedRoomId(id);
  };

  const handleEditRoom = (id) => {
    setOpenEditRoom(true);
    setSelectedRoomId(id);
  };

  const handleStatusRoom = (id) => {
    setOpenStatusRoomModal(true);
    setSelectedRoomId(id);
  };

  const columns = [
    { field: "name", headerName: "Tên phòng", width: 100 },
    { field: "cateRoom", headerName: "Hạng phòng", width: 200 },
    { field: "area", headerName: "Khu vực", width: 120 },
    { field: "priceHour", headerName: "Giá theo giờ", width: 120 },
    { field: "priceDay", headerName: "Giá theo ngày", width: 120 },
    { field: "priceNight", headerName: "Giá theo đêm", width: 120 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      type: "actions",
      getActions: (params) => {
        const row = params.row;
        let isActive = null;
        if (row.status === "Đang hoạt động") {
          isActive = true;
        } else {
          isActive = false;
        }
        return [
          <GridActionsCellItem
            icon={<i className="fa-solid fa-eye view-details p-1"></i>}
            label="Xem chi tiết"
            onClick={() => handleDetailsRoom(row.id)}
          />,
          isActive ? (
            <GridActionsCellItem
              icon={<i className="fa-solid fa-lock inactive-action p-1"></i>}
              label="Dừng hoạt động"
              onClick={() => handleStatusRoom(row.id)}
            />
          ) : (
            <GridActionsCellItem
              icon={<i className="fa-solid fa-unlock active-action p-1"></i>}
              label="Hoạt động"
              onClick={() => handleStatusRoom(row.id)}
            />
          ),
          <GridActionsCellItem
            icon={<i className="fa-solid fa-pen-to-square edit-action p-1"></i>}
            label="Chỉnh sửa"
            onClick={() => handleEditRoom(row.id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-trash delete-action p-1"></i>}
            label="Xoá"
            onClick={() => {
              setOpenDeleteRoomModal(true);
              setSelectedRoomId(row.id);
            }}
          />,
        ];
      },
      width: 200,
    },
  ];

  const rows = roomsByFloor
    ? roomsByFloor.map((room) => {
        const status = room.status === 1 ? "Đang hoạt động" : "Ngừng hoạt động";
        return {
          id: room.roomId,
          name: room.roomName,
          cateRoom: room.roomCategory.roomCategoryName,
          area: room.floor.floorName,
          priceHour: room.roomCategory.priceByHour
            ? room.roomCategory.priceByHour.toLocaleString()
            : 0,
          priceDay: room.roomCategory.priceByDay
            ? room.roomCategory.priceByDay.toLocaleString()
            : 0,
          priceNight: room.roomCategory.priceByNight
            ? room.roomCategory.priceByNight.toLocaleString()
            : 0,
          status: status,
        };
      })
    : [];
  const newCateRoomHandler = () => {
    setOpenNewCateRoomModal(true);
  };

  const newRoomHandler = () => {
    if (categories.length <= 0) {
      Swal.fire({
        position: "bottom",
        html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Bạn phải tạo hạng phòng trước</button>`,
        showConfirmButton: false,
        background: "transparent",
        backdrop: "none",
        timer: 2000,
      });
    } else if (floors.length <= 0) {
      Swal.fire({
        position: "bottom",
        html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Bạn phải tạo khu vực trước</button>`,
        showConfirmButton: false,
        background: "transparent",
        backdrop: "none",
        timer: 2000,
      });
    } else {
      setOpenNewRoomModal(true);
    }
  };

  const deleteRoomsHandler = () => {
    setOpenDeleteRoomsModal(true);
  };
  return (
    <div className="flex flex-row">
      <div className="mt-10 mx-5">
        <div className="flex pt-1 mt-10">
          <div className="w-10/12 text-1xl ">
            <p className="text-lg font-bold">Khu vực</p>
          </div>
          <div className="w-2/12">
            <button
              type="button"
              className="text-2xl text-gray-500"
              onClick={() => setOpenNewAreaModal(true)}
            >
              <i className="fa-solid fa-plus "></i>
            </button>
            {openNewAreaModal && (
              <NewArea
                open={openNewAreaModal}
                onClose={() => setOpenNewAreaModal(false)}
              />
            )}
          </div>
        </div>
        <div className="">
          <input
            type="text"
            placeholder="Tìm kiếm khu vực"
            className="w-full p-2 border border-gray-300 rounded"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="pt-2">
          <button
            type="button"
            className="w-full p-1 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300"
            onClick={handleSelectAllFloors}
          >
            Tất cả khu vực
          </button>
          <div className="overflow-y-auto h-max-40">
            {filteredFloors.map((floor, index) => (
              <div
                className="w-full p-1 border border-gray-300 rounded bg-gray-200 hover:bg-gray-500"
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor:
                    selectedFloorName === floor.floorName
                      ? "lightgray"
                      : "transparent",
                }}
                onMouseEnter={() => setHoveredFloor(floor.floorName)}
                onMouseLeave={() => setHoveredFloor(null)}
                onClick={() => handleFloorSelection(floor.floorName)}
              >
                <div
                  className="pt-1"
                  style={{
                    width: "80%",
                    backgroundColor:
                      selectedFloorName === floor.floorName
                        ? "lightgray"
                        : "transparent",
                  }}
                >
                  {floor.floorName}
                </div>
                {hoveredFloor === floor.floorName && (
                  <button
                    type="button"
                    className="w-1/12 mx-2 text-1xl text-gray-500"
                    onClick={() => handleEditArea(floor.floorId)}
                  >
                    <i className="fa-solid fa-pen-to-square edit-action"></i>
                  </button>
                )}
                {hoveredFloor === floor.floorName && (
                  <button
                    type="button"
                    className="w-1/12 mx-2 text-1xl text-gray-500"
                    onClick={() => handleDeleteArea(floor.floorId)}
                  >
                    <i className="fa-solid fa-trash delete-action"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
          {openEditAreaModal && (
            <EditArea
              open={openEditAreaModal}
              onClose={() => setOpenEditAreaModal(false)}
              floorId={selectedFloorId}
              floor={floors.find((floor) => floor.floorId === selectedFloorId)}
            />
          )}
          {openDeleteAreaModal && (
            <DeleteArea
              open={openDeleteAreaModal}
              onClose={() => setOpenDeleteAreaModal(false)}
              floorId={selectedFloorId}
            />
          )}
        </div>
      </div>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex">
          <h1 className="text-4xl">Phòng</h1>
          <div className="ml-auto flex">
            {rowSelectionModel.length > 0 ? (
              <div className="mx-2">
                <ButtonClick
                  name="Xoá phòng"
                  iconAction="fa-solid fa-trash"
                  action={deleteRoomsHandler}
                />
              </div>
            ) : null}
            <div className="mx-2">
              <ButtonClick
                name="Thêm hạng phòng"
                iconAction="fa-solid fa-plus"
                action={newCateRoomHandler}
              />
            </div>
            <div className="mx-2">
              <ButtonClick
                name="Thêm phòng"
                iconAction="fa-solid fa-plus"
                action={newRoomHandler}
              />
            </div>
          </div>
        </div>
        <RoomRootLayout isActive={false} />
        <div className={`${rows.length <= 0 && "h-60"}`}>
          <DataGrid
            className="bg-white"
            columns={columns}
            rows={rows}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            slots={{
              toolbar: GridToolbar,
              noRowsOverlay: () => (
                <div className="pt-8 text-center">
                  Không có phòng nào, hãy tạo phòng mới!
                </div>
              ),
            }}
          />
        </div>
      </Box>
      {openNewRoomModal && (
        <NewRoom
          open={openNewRoomModal}
          onClose={() => setOpenNewRoomModal(false)}
          floors={floors}
          categories={categories}
          rooms={rooms}
        />
      )}
      {openNewCateRoomModal && (
        <NewCategoryRoom
          open={openNewCateRoomModal}
          onClose={() => setOpenNewCateRoomModal(false)}
          categories={categories}
        />
      )}
      {openDetailsRoom && selectedRoomId && (
        <DetailsRoom
          open={openDetailsRoom}
          onClose={() => setOpenDetailsRoom(false)}
          roomId={selectedRoomId}
        />
      )}
      {openEditRoom && selectedRoomId && (
        <EditRoom
          open={openEditRoom}
          onClose={() => setOpenEditRoom(false)}
          floors={floors}
          categories={categories}
          roomId={selectedRoomId}
          rooms={rooms}
        />
      )}
      {openDeleteRoomsModal && rowSelectionModel.length > 0 && (
        <DeleteRoom
          open={openDeleteRoomsModal}
          onClose={() => setOpenDeleteRoomsModal(false)}
          listRoomId={rowSelectionModel}
        />
      )}
      {openDeleteRoomModal && selectedRoomId && (
        <DeleteRoom
          open={openDeleteRoomModal}
          onClose={() => setOpenDeleteRoomModal(false)}
          listRoomId={[selectedRoomId]}
        />
      )}
      {openStatusRoomModal && selectedRoomId && (
        <SetStatusRoom
          open={openStatusRoomModal}
          onClose={() => setOpenStatusRoomModal(false)}
          room={rooms.find((room) => room.roomId === selectedRoomId)}
        />
      )}
      <Tooltip anchorSelect=".view-details" place="top">
        Xem chi tiết
      </Tooltip>
      <Tooltip anchorSelect=".edit-action" place="top">
        Chỉnh sửa
      </Tooltip>
      <Tooltip anchorSelect=".delete-action" place="top">
        Xoá
      </Tooltip>
      <Tooltip anchorSelect=".active-action" place="top">
        Hoạt động
      </Tooltip>
      <Tooltip anchorSelect=".inactive-action" place="top">
        Ngừng hoạt động
      </Tooltip>
    </div>
  );
}

export default RoomManagementPage;

async function loadRooms() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  try {
    const response = await axiosPrivate
      .get("room")
      .catch((e) => console.log(e));
    return response.data;
  } catch (e) {
    window.location.href = "/login";
    return;
  }
}

async function loadFloors() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  try {
    const response = await axiosPrivate
      .get("Floor")
      .catch((e) => console.log(e));
    return response.data;
  } catch (e) {
    window.location.href = "/login";
    return;
  }
}

async function loadCategories() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  try {
    const response = await axiosPrivate
      .get("room-class")
      .catch((e) => console.log(e));
    return response.data;
  } catch (e) {
    window.location.href = "/login";
    return;
  }
}

export async function loader() {
  return defer({
    floors: await loadFloors(),
    categories: await loadCategories(),
    rooms: await loadRooms(),
  });
}

export async function action({ request }) {
  const method = request.method;
  console.log(method);
  const data = await request.formData();
  const formData = new FormData();
  if (data.get("roomCategoryName")) {
    formData.append("roomCategoryName", data.get("roomCategoryName"));
    formData.append("roomCapacity", data.get("roomCapacity"));
    formData.append("roomArea", data.get("roomArea"));
    formData.append("priceByHour", data.get("priceByHour"));
    formData.append("priceByDay", data.get("priceByDay"));
    formData.append("priceByNight", data.get("priceByNight"));
    formData.append("description", data.get("description"));
    formData.append("image", data.get("image"));
    if (method === "POST") {
      const response = await axiosPrivate
        .post("room-class", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch((e) => {
          console.log(e);
        });
      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      return redirect("/manager/roomManagement");
    }
    return redirect("/manager/roomManagement");
  }
  if (data.get("floorName")) {
    const formData = new FormData();
    formData.append("floorName", data.get("floorName"));
    formData.append("status", 1);
    const response = await axiosPrivate.post("Floor", formData).catch((e) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title: e.response.data,
        showConfirmButton: false,
        timer: 1500,
      });
    });
    Swal.fire({
      position: "center",
      icon: "success",
      title: response.data,
      showConfirmButton: false,
      timer: 1500,
    });
    return redirect("/manager/roomManagement");
  }
  if (data.get("isEditFloor") && method === "PUT") {
    const formData = new FormData();
    console.log("start");
    formData.append("floorName", data.get("floorNameEdit"));
    const response = await axiosPrivate
      .put("Floor/" + data.get("floorId"), formData)
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Thêm khu vực thất bại",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    console.log(response);

    if (response.status == 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: response.data,
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: response.data,
        showConfirmButton: false,
        timer: 1500,
      });
    }
    return redirect("/manager/roomManagement");
  }
  if (data.get("status")) {
    formData.append("status", data.get("status"));
    if (method === "PUT") {
      console.log(data.get("roomId"));
      const response = await axiosPrivate
        .put("room/" + data.get("roomId"), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Cập nhật trạng thái phòng thành công",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: e.response.data,
            showConfirmButton: false,
            timer: 1500,
          });
        });
      return redirect("/manager/roomManagement");
    }
  }

  formData.append("roomName", data.get("roomName"));
  formData.append("roomCategoryId", data.get("roomCategoryId"));
  formData.append("floorId", data.get("floorId"));
  formData.append("bookingStatus", 0);
  formData.append("conditionStatus", 0);
  formData.append("note", data.get("note"));
  formData.append("image", data.get("image"));

  if (method === "POST") {
    const response = await axiosPrivate
      .post("room", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((e) => {
        console.log(e);
      });
    if (response) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Thêm phòng thành công",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Thêm phòng thất bại",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    return redirect("/manager/roomManagement");
  }
  if (method === "PUT") {
    const response = await axiosPrivate
      .put("room/" + data.get("roomId"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/roomManagement");
  }
  if (method === "DELETE" && !data.get("roomId")) {

    const dataArray = data.get("floorId");
    await axiosPrivate
      .delete("Floor/" + dataArray)
      .then((response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Xóa khu vực thành công",
          showConfirmButton: false,
        });
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/roomManagement");
  }
  if (method === "DELETE") {
    const dataArray = data.get("roomId").split(",");
    await axiosPrivate
      .delete("room/" + dataArray)
      .then((response) => {
        let message = "";
        dataArray.map((id) => {
          message += response.data[id] + " có mã phòng là " + id + "<br/>";
        });
        Swal.fire({
          position: "center",
          html: `<p>${message}</p>`,
          showConfirmButton: true,
        });
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/roomManagement");
  }
}
