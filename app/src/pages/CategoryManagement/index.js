import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import RoomRootLayout from "../RoomRootLayout";
import Button from "../../components/UI/Button";
import NewRoom from "../../components/Room/NewRoom";
import NewCategoryRoom from "../../components/CategoryRoom/NewCategoryRoom";
import DeleteRoom from "../../components/Room/DeleteRoom";
import DetailsRoom from "../../components/Room/DetailsRoom";

function CategoryManagementPage() {
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
    { field: "idCateRoom", headerName: "Mã hạng phòng", width: 150 },
    { field: "name", headerName: "Tên hạng phòng", width: 200 },
    { field: "amount", headerName: "SL phòng", width: 100 },
    { field: "priceHour", headerName: "Giá theo giờ", width: 100 },
    { field: "priceDay", headerName: "Giá theo ngày", width: 100 },
    { field: "priceNight", headerName: "Giá theo đêm", width: 100 },
    { field: "status", headerName: "Trạng thái", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
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
            label="Edit"
          />,
        ];
      },
    },
  ];

  const rows = [
    {
      id: 1,
      idCateRoom: "Double bedroom",
      name: "Phòng 1 giường đôi",
      amount: 25,
      priceHour: 180000,
      priceDay: 250000,
      priceNight: 250000,
      status: "Đang hoạt động",
    },
    {
      id: 2,
      idCateRoom: "Double bedroom",
      name: "Phòng 1 giường đôi",
      amount: 25,
      priceHour: 180000,
      priceDay: 250000,
      priceNight: 250000,
      status: "Đang hoạt động",
    },
    {
      id: 3,
      idCateRoom: "Double bedroom",
      name: "Phòng 1 giường đôi",
      amount: 25,
      priceHour: 180000,
      priceDay: 250000,
      priceNight: 250000,
      status: "Đang hoạt động",
    },
    {
      id: 4,
      idCateRoom: "Double bedroom",
      name: "Phòng 1 giường đôi",
      amount: 25,
      priceHour: 180000,
      priceDay: 250000,
      priceNight: 250000,
      status: "Đang hoạt động",
    },
    {
      id: 5,
      idCateRoom: "Double bedroom",
      name: "Phòng 1 giường đôi",
      amount: 25,
      priceHour: 180000,
      priceDay: 250000,
      priceNight: 250000,
      status: "Đang hoạt động",
    },
    {
      id: 6,
      idCateRoom: "Double bedroom",
      name: "Phòng 1 giường đôi",
      amount: 25,
      priceHour: 180000,
      priceDay: 250000,
      priceNight: 250000,
      status: "Đang hoạt động",
    },
    {
      id: 7,
      idCateRoom: "Double bedroom",
      name: "Phòng 1 giường đôi",
      amount: 25,
      priceHour: 180000,
      priceDay: 250000,
      priceNight: 250000,
      status: "Đang hoạt động",
    },
    {
      id: 8,
      idCateRoom: "Double bedroom",
      name: "Phòng 1 giường đôi",
      amount: 25,
      priceHour: 180000,
      priceDay: 250000,
      priceNight: 250000,
      status: "Đang hoạt động",
    },
    {
      id: 9,
      idCateRoom: "Double bedroom",
      name: "Phòng 1 giường đôi",
      amount: 25,
      priceHour: 180000,
      priceDay: 250000,
      priceNight: 250000,
      status: "Đang hoạt động",
    },
  ];

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
        <RoomRootLayout isActive={true} />
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

export default CategoryManagementPage;
