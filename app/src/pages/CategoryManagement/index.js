import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  viVN,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import RoomRootLayout from "../RoomLayout";
import Button from "../../components/UI/Button";
import NewRoom from "../../components/Room/NewRoom";
import NewCategoryRoom from "../../components/CategoryRoom/NewCategoryRoom";
import DeleteRoom from "../../components/Room/DeleteRoom";
import DetailsCategoryRoom from "../../components/CategoryRoom/DetailsCategoryRoom";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import { useRouteLoaderData } from "react-router-dom";
import EditCategoryRoom from "../../components/CategoryRoom/EditCategoryRoom";

function CategoryManagementPage() {
  const token = useRouteLoaderData("root");

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewRoomModal, setOpenNewRoomModal] = useState(false);
  const [openDeleetRoomModal, setOpenDeleetRoomModal] = useState(false);
  const [openNewCateRoomModal, setOpenNewCateRoomModal] = useState(false);
  const [openDetailsCateRoom, setOpenDetailsCateRoom] = useState(false);
  const [openEditCateRoom, setOpenEditCateRoom] = useState(false);
  const [selectedCateRoomId, setSelectedCateRoomId] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axiosConfig.get("room-class");
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategories();
  }, []);

  const handleDetailsCateRoom = (id) => {
    setOpenDetailsCateRoom(true);
    setSelectedCateRoomId(id);
  };

  const handleEditCateRoom = (id) => {
    setOpenEditCateRoom(true);
    setSelectedCateRoomId(id);
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
      headerName: "Hoạt động",
      type: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<i className="fa-solid fa-eye"></i>}
            label="Xem chi tiết"
            onClick={() => handleDetailsCateRoom(id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-pen-to-square"></i>}
            label="Chỉnh sửa"
            onClick={() => handleEditCateRoom(id)}
          />,
        ];
      },
    },
  ];
  
  const rows = categories.map((row) => {
    const cateRoom = row.roomCategory;
    const status = cateRoom.status ? "Đang hoạt động" : "Ngừng hoạt động";
    return {
      id: cateRoom.roomCategoryId,
      idCateRoom: cateRoom.roomCategoryId,
      name: cateRoom.roomCategoryName,
      amount: row.roomTotal,
      priceHour: cateRoom.priceByHour.toLocaleString(),
      priceDay: cateRoom.priceByDay.toLocaleString(),
      priceNight: cateRoom.priceByNight.toLocaleString(),
      status: status,
    };
  });

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
                      name: "Xoá hạng phòng",
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
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
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
        />
      )}
    </>
  );
}

export default CategoryManagementPage;
