import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  viVN,
} from "@mui/x-data-grid";
import { useState } from "react";
import ButtonHover from "../../components/UI/ButtonHover";
import NewRoom from "../../components/Room/NewRoom";
import NewCategoryRoom from "../../components/CategoryRoom/NewCategoryRoom";
import DeleteRoom from "../../components/Room/DeleteRoom";
import DetailsRoom from "../../components/Room/DetailsRoom";
import { axiosConfig } from "../../utils/axiosConfig";
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

function RoomManagementPage() {
  const token = useRouteLoaderData("root");
  const { rooms, categories, floors } = useLoaderData();
  // let response = useActionData();

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewRoomModal, setOpenNewRoomModal] = useState(false);
  const [openDeleteRoomsModal, setOpenDeleteRoomsModal] = useState(false);
  const [openDeleteRoomModal, setOpenDeleteRoomModal] = useState(false);
  const [openNewCateRoomModal, setOpenNewCateRoomModal] = useState(false);
  const [openDetailsRoom, setOpenDetailsRoom] = useState(false);
  const [openEditRoom, setOpenEditRoom] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleDetailsRoom = (id) => {
    setOpenDetailsRoom(true);
    setSelectedRoomId(id);
  };

  const handleEditRoom = (id) => {
    setOpenEditRoom(true);
    setSelectedRoomId(id);
  };

  const handleStatusRoom = (id) => {
    const cate = categories.find(
      (cate) => cate.roomCategory.roomCategoryId === id
    );
    console.log(cate);
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
              label="Đang hoạt động"
              onClick={() => handleStatusRoom(row.id)}
            />
          ) : (
            <GridActionsCellItem
              icon={<i className="fa-solid fa-unlock active-action p-1"></i>}
              label="Ngừng hoạt động"
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

  const rows = rooms.map((room) => {
    const status = room.status ? "Đang hoạt động" : "Ngừng hoạt động";
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
  });

  const newCateRoomHandler = () => {
    setOpenNewCateRoomModal(true);
  };

  const newRoomHandler = () => {
    setOpenNewRoomModal(true);
  };

  const deleteRoomsHandler = () => {
    setOpenDeleteRoomsModal(true);
  };

  return (
    <>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex">
          <h1 className="text-4xl">Hạng phòng & Phòng</h1>
          <div className="ml-auto flex">
            {rowSelectionModel.length > 0 ? (
              <div className="mx-2">
                <ButtonHover
                  action="Thao tác"
                  iconAction="fa-solid fa-ellipsis-vertical"
                  names={[
                    {
                      name: "Xoá phòng",
                      icon: "fa-solid fa-trash",
                      action: deleteRoomsHandler,
                    },
                  ]}
                />
              </div>
            ) : null}
            <div className="mx-2">
              <ButtonHover
                action="Thêm mới"
                iconAction="fa-solid fa-plus"
                names={[
                  {
                    name: "Hạng phòng",
                    icon: "fa-solid fa-plus",
                    action: newCateRoomHandler,
                  },
                  {
                    name: "Phòng",
                    icon: "fa-solid fa-plus",
                    action: newRoomHandler,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <RoomRootLayout isActive={false} />
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
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
      {openNewRoomModal && (
        <NewRoom
          open={openNewRoomModal}
          onClose={() => setOpenNewRoomModal(false)}
          floors={floors}
          categories={categories}
        />
      )}
      {openNewCateRoomModal && (
        <NewCategoryRoom
          open={openNewCateRoomModal}
          onClose={() => setOpenNewCateRoomModal(false)}
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
    </>
  );
}

export default RoomManagementPage;

async function loadRooms() {
  const response = await axiosConfig.get("room");
  return response.data;
}

async function loadFloors() {
  const response = await axiosConfig.get("Floor");
  return response.data;
}

async function loadCategories() {
  const response = await axiosConfig.get("room-class");
  return response.data;
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
      const response = await axiosConfig
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
    const formData = {
      floorName: data.get("floorName"),
      status: 1,
    };
    const response = await axiosConfig
      .post("Floor", formData)
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
  formData.append("roomName", data.get("roomName"));
  formData.append("roomCategoryId", data.get("roomCategoryId"));
  formData.append("floorId", data.get("floorId"));
  formData.append("bookingStatus", 0);
  formData.append("conditionStatus", 0);
  formData.append("note", data.get("note"));
  formData.append("image", data.get("image"));

  if (method === "POST") {
    const response = await axiosConfig
      .post("room", formData, {
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
  if (method === "PUT") {
    console.log(data.get("roomId"));
    const response = await axiosConfig
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
  if (method === "DELETE") {
    const dataArray = data.get("roomId").split(",");
    dataArray.map(async (id) => {
      await axiosConfig
        .delete("room/" + id)
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
    });
    return redirect("/manager/roomManagement");
  }
}
