import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from "@mui/x-data-grid";
import { useState } from "react";
import Button from "../../components/UI/Button";
import NewRoom from "../../components/Room/NewRoom";
import NewCategoryRoom from "../../components/CategoryRoom/NewCategoryRoom";
import DeleteRoom from "../../components/Room/DeleteRoom";
import DetailsRoom from "../../components/Room/DetailsRoom";
import { axiosConfig } from "../../utils/axiosConfig";
import RoomRootLayout from "../RoomLayout";
import { defer, useLoaderData } from "react-router-dom";

function RoomManagementPage() {
  const { rooms } = useLoaderData();
  console.log(rooms);

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewRoomModal, setOpenNewRoomModal] = useState(false);
  const [openDeleetRoomModal, setOpenDeleetRoomModal] = useState(false);
  const [openNewCateRoomModal, setOpenNewCateRoomModal] = useState(false);
  const [openDetailsRoom, setOpenDetailsRoom] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleDetailsRoom = (id) => {
    setOpenDetailsRoom(true);
    setSelectedRoomId(id);
  };

  const columns = [
    { field: "name", headerName: "Tên phòng", width: 100 },
    { field: "cateRoom", headerName: "Hạng phòng", width: 300 },
    { field: "area", headerName: "Khu vực", width: 120 },
    { field: "priceHour", headerName: "Giá theo giờ", width: 120 },
    { field: "priceDay", headerName: "Giá theo ngày", width: 120 },
    { field: "priceNight", headerName: "Giá theo đêm", width: 120 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      type: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<i className="fa-solid fa-eye"></i>}
            label="Xem chi tiết"
            onClick={() => handleDetailsRoom(id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-pen-to-square"></i>}
            label="Chỉnh sửa"
          />,
        ];
      },
    },
  ];

  const rows = rooms.map((room) => {
    const status = room.status ? "Đang hoạt động" : "Ngừng hoạt động"
    return {
      id: room.roomId,
      name: room.roomName,
      cateRoom: room.roomCategory.roomCategoryName,
      area: room.floor.floorName,
      priceHour: room.roomCategory.priceByHour,
      priceDay: room.roomCategory.priceByDay,
      priceNight: room.roomCategory.priceByNight,
      status: status,
    }
  })

  const newCateRoomHandler = () => {
    setOpenNewCateRoomModal(true);
  };

  const newRoomHandler = () => {
    setOpenNewRoomModal(true);
  };

  const deleteRoomHandler = () => {
    setOpenDeleetRoomModal(true);
  };

  return (
    <>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex">
          <h1 className="text-4xl">Hạng phòng & Phòng</h1>
          <div className="ml-auto flex">
            {rowSelectionModel.length > 0 ? (
              <div className="mx-2">
                <Button
                  action="Thao tác"
                  iconAction="fa-solid fa-ellipsis-vertical"
                  names={[
                    {
                      name: "Xoá phòng",
                      icon: "fa-solid fa-trash",
                      action: deleteRoomHandler,
                    },
                  ]}
                />
              </div>
            ) : null}
            <div className="mx-2">
              <Button
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
          localeText={viVN  .components.MuiDataGrid.defaultProps.localeText}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
      <NewRoom
        open={openNewRoomModal}
        onClose={() => setOpenNewRoomModal(false)}
      />
      <NewCategoryRoom
        open={openNewCateRoomModal}
        onClose={() => setOpenNewCateRoomModal(false)}
      />
      <DeleteRoom
        open={openDeleetRoomModal}
        onClose={() => setOpenDeleetRoomModal(false)}
      />
      {openDetailsRoom && selectedRoomId && (
        <DetailsRoom
          open={openDetailsRoom}
          onClose={() => setOpenDetailsRoom(false)}
          roomId={selectedRoomId}
        />
      )}
    </>
  );
}

export default RoomManagementPage;

async function loadRooms() {
  const response = await axiosConfig.get("room");
  return response.data;
}

export async function loader() {
  return defer({
    rooms: await loadRooms(),
  });
}