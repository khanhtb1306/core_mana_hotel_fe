import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import RoomRootLayout from "../RoomRootLayout";
import Button from "../../components/UI/Button";
import NewRoom from "../../components/Room/NewRoom";
import NewCategoryRoom from "../../components/CategoryRoom/NewCategoryRoom";
import DeleteRoom from "../../components/Room/DeleteRoom";
import DetailsRoom from "../../components/Room/DetailsRoom";

const rows = [
  {
    id: 1,
    name: "1",
    age: 25,
  },
  {
    id: 2,
    name: "2",
    age: 36,
  },
  {
    id: 3,
    name: "3",
    age: 19,
  },
  {
    id: 4,
    name: "4",
    age: 28,
  },
  {
    id: 5,
    name: "5",
    age: 23,
  },
  {
    id: 6,
    name: "5",
    age: 23,
  },
  {
    id: 7,
    name: "5",
    age: 23,
  },
  {
    id: 8,
    name: "5",
    age: 23,
  },
  {
    id: 9,
    name: "5",
    age: 23,
  },
];

function RoomManagementPage() {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewRoomModal, setOpenNewRoomModal] = useState(false);
  const [openDeleetRoomModal, setOpenDeleetRoomModal] = useState(false);
  const [openNewCateRoomModal, setOpenNewCateRoomModal] = useState(false);

  const [openDetailsRoom, setOpenDetailsRoom] = useState(false);

  const handleDetailsRoom = (id) => {
    setOpenDetailsRoom(true);
    console.log(id);
    // return (
    //   <DetailsRoom
    //     open={openDetailsRoom}
    //     onClose={() => setOpenDetailsRoom(false)}
    //   />
    // );
  };

  const columns = [
    { field: "name", headerName: "Name" },
    { field: "age", headerName: "Age", type: "number" },
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
      <DetailsRoom
        open={openDetailsRoom}
        onClose={() => setOpenDetailsRoom(false)}
      />
    </>
  );
}

export default RoomManagementPage;
