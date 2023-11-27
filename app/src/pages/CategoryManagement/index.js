import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridNoRowsOverlay,
  GridToolbar,
} from "@mui/x-data-grid";
import { useState } from "react";
import RoomRootLayout from "../RoomLayout";
import ButtonHover from "../../components/UI/ButtonHover";
import NewRoom from "../../components/Room/NewRoom";
import NewCategoryRoom from "../../components/CategoryRoom/NewCategoryRoom";
import DetailsCategoryRoom from "../../components/CategoryRoom/DetailsCategoryRoom";
import { axiosPrivate } from "../../utils/axiosConfig";
import {
  defer,
  redirect,
  useLoaderData,
  useRouteLoaderData,
} from "react-router-dom";
import EditCategoryRoom from "../../components/CategoryRoom/EditCategoryRoom";
import DeleteCategoryRoom from "../../components/CategoryRoom/DeleteCategoryRoom";
import Swal from "sweetalert2";
import ButtonClick from "../../components/UI/ButtonClick";
import { Tooltip } from "react-tooltip";
import SetStatusCategoryRoom from "../../components/CategoryRoom/SetStateCategoryRoom";

function CategoryManagementPage() {
  const { rooms, categories, floors } = useLoaderData();

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewRoomModal, setOpenNewRoomModal] = useState(false);
  const [openDeleteCateRoomsModal, setOpenDeleteCateRoomsModal] =
    useState(false);
  const [openDeleteCateRoomModal, setOpenDeleteCateRoomModal] = useState(false);
  const [openStatusCateRoomModal, setOpenStatusCateRoomModal] = useState(false);
  const [openNewCateRoomModal, setOpenNewCateRoomModal] = useState(false);
  const [openDetailsCateRoom, setOpenDetailsCateRoom] = useState(false);
  const [openEditCateRoom, setOpenEditCateRoom] = useState(false);
  const [selectedCateRoomId, setSelectedCateRoomId] = useState(null);

  const handleDetailsCateRoom = (id) => {
    setOpenDetailsCateRoom(true);
    setSelectedCateRoomId(id);
  };

  const handleStatusCateRoom = (id) => {
    setOpenStatusCateRoomModal(true);
    setSelectedCateRoomId(id);
  };

  const handleEditCateRoom = (id) => {
    setOpenEditCateRoom(true);
    setSelectedCateRoomId(id);
  };

  const newCateRoomHandler = () => {
    setOpenNewCateRoomModal(true);
  };

  const newRoomHandler = () => {
    setOpenNewRoomModal(true);
  };

  const deleteCateRoomsHandler = () => {
    setOpenDeleteCateRoomsModal(true);
  };

  const columns = [
    { field: "idCateRoom", headerName: "Mã hạng phòng", width: 150 },
    { field: "name", headerName: "Tên hạng phòng", width: 200 },
    { field: "amount", headerName: "SL phòng", width: 100 },
    { field: "emptyRoom", headerName: "Phòng còn trống", width: 100 },
    { field: "priceHour", headerName: "Giá theo giờ", width: 100 },
    { field: "priceDay", headerName: "Giá theo ngày", width: 100 },
    { field: "priceNight", headerName: "Giá theo đêm", width: 100 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    {
      field: "actions",
      headerName: "Hoạt động",
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
            onClick={() => handleDetailsCateRoom(row.id)}
          />,
          isActive ? (
            <>
              <GridActionsCellItem
                icon={<i className="fa-solid fa-lock inactive-action p-1"></i>}
                label="Dừng hoạt động"
                onClick={() => handleStatusCateRoom(row.id)}
              />
            </>
          ) : (
            <GridActionsCellItem
              icon={<i className="fa-solid fa-unlock active-action p-1"></i>}
              label="Hoạt động"
              onClick={() => handleStatusCateRoom(row.id)}
            />
          ),
          <GridActionsCellItem
            icon={<i className="fa-solid fa-pen-to-square edit-action p-1"></i>}
            label="Chỉnh sửa"
            onClick={() => handleEditCateRoom(row.id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-trash delete-action p-1"></i>}
            label="Xoá"
            onClick={() => {
              setOpenDeleteCateRoomModal(true);
              setSelectedCateRoomId(row.id);
            }}
          />,
        ];
      },
      width: 200,
    },
  ];

  const rows = categories.map((row) => {
    const cateRoom = row.roomCategory;
    const status = cateRoom.status === 1 ? "Đang hoạt động" : "Ngừng hoạt động";
    const emptyRoom = row.ListRoom.filter((room) => room.bookingStatus === 0);
    return {
      id: cateRoom.roomCategoryId,
      idCateRoom: cateRoom.roomCategoryId,
      name: cateRoom.roomCategoryName,
      amount: row.roomTotal,
      emptyRoom: emptyRoom.length,
      priceHour: cateRoom.priceByHour
        ? cateRoom.priceByHour.toLocaleString()
        : 0,
      priceDay: cateRoom.priceByDay ? cateRoom.priceByDay.toLocaleString() : 0,
      priceNight: cateRoom.priceByNight
        ? cateRoom.priceByNight.toLocaleString()
        : 0,
      status: status,
    };
  });
  return (
    <>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex">
          <h1 className="text-4xl">Hạng phòng & Phòng</h1>
          <div className="ml-auto flex">
            {rowSelectionModel.length > 0 ? (
              <div className="mx-2">
                <ButtonClick
                  name="Xoá hạng phòng"
                  iconAction="fa-solid fa-trash"
                  action={deleteCateRoomsHandler}
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
        <RoomRootLayout isActive={true} />
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
            slots={{
              toolbar: GridToolbar,
              noRowsOverlay: () => (
                <div className="pt-8 text-center">
                  Không có hạng phòng nào, hãy tạo hàng phòng!
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
      {openDetailsCateRoom && selectedCateRoomId && (
        <DetailsCategoryRoom
          open={openDetailsCateRoom}
          onClose={() => setOpenDetailsCateRoom(false)}
          cateRoomId={selectedCateRoomId}
        />
      )}
      {openEditCateRoom && selectedCateRoomId && (
        <EditCategoryRoom
          open={openEditCateRoom}
          onClose={() => setOpenEditCateRoom(false)}
          cateRoomId={selectedCateRoomId}
          categories={categories}
        />
      )}
      {openDeleteCateRoomsModal && rowSelectionModel.length > 0 && (
        <DeleteCategoryRoom
          open={openDeleteCateRoomsModal}
          onClose={() => setOpenDeleteCateRoomsModal(false)}
          listCateRoomId={rowSelectionModel}
        />
      )}
      {openDeleteCateRoomModal && selectedCateRoomId && (
        <DeleteCategoryRoom
          open={openDeleteCateRoomModal}
          onClose={() => setOpenDeleteCateRoomModal(false)}
          listCateRoomId={[selectedCateRoomId]}
        />
      )}
      {openStatusCateRoomModal && selectedCateRoomId && (
        <SetStatusCategoryRoom
          open={openStatusCateRoomModal}
          onClose={() => setOpenStatusCateRoomModal(false)}
          categoryRoom={categories.find(
            (cate) => cate.roomCategory.roomCategoryId === selectedCateRoomId
          )}
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

export default CategoryManagementPage;

async function loadFloors() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  const response = await axiosPrivate.get("Floor").catch((e) => {
    console.log(e);
  });
  return response.data;
}

async function loadCategories() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  const response = await axiosPrivate.get("room-class").catch((e) => {
    console.log(e);
  });
  return response.data;
}

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
  if (data.get("floorName")) {
    const formData = {
      floorName: data.get("floorName"),
      status: 1,
    };
    const response = await axiosPrivate
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
    return redirect("/manager/categoryRoomManagement");
  }
  const formData = new FormData();
  if (data.get("roomName")) {
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
    }
    return redirect("/manager/categoryRoomManagement");
  }
  if (data.get("status")) {
    formData.append("status", data.get("status"));
    if (method === "PUT") {
      const response = await axiosPrivate
        .put("room-class/" + data.get("roomCategoryId"), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Cập nhật trạng thái hạng phòng thành công",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Cập nhật trạng thái hạng phòng thất bại",
            showConfirmButton: false,
            timer: 1500,
          });
        });
      return redirect("/manager/categoryRoomManagement");
    }
  }

  formData.append("roomCategoryName", data.get("roomCategoryName"));
  formData.append("numOfAdults", data.get("numOfAdults"));
  formData.append("numOfChildren", data.get("numOfChildren"));
  formData.append("numMaxOfAdults", data.get("numMaxOfAdults"));
  formData.append("numMaxOfChildren", data.get("numMaxOfChildren"));
  formData.append("roomArea", data.get("roomArea"));
  formData.append("priceByHour", data.get("priceByHour"));
  formData.append("priceByDay", data.get("priceByDay"));
  formData.append("priceByNight", data.get("priceByNight"));
  formData.append("description", data.get("description"));
  formData.append("image", data.get("image"));

  if (method === "POST") {
    await axiosPrivate
      .post("room-class", formData, {
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
    return redirect("/manager/categoryRoomManagement");
  }
  if (method === "PUT") {
    // console.log(data.get("roomCategoryId"));
    const response = await axiosPrivate
      .put("room-class/" + data.get("roomCategoryId"), formData, {
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
    return redirect("/manager/categoryRoomManagement");
  }
  if (method === "DELETE") {
    const dataArray = data.get("roomCategoryId").split(",");
    const response = await axiosPrivate
      .delete("room-class/" + dataArray)
      .then((response) => {
        let message = "";
        dataArray.map((id) => {
          message += response.data[id] + " có mã hạng phòng là " + id + "<br/>";
        });
        Swal.fire({
          position: "center",
          html: `<p>${message}</p>`,
          showConfirmButton: true,
        });
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          position: "center",
          icon: "error",
          text: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/categoryRoomManagement");
  }

  return redirect("/manager/categoryRoomManagement");
}
