import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import RoomRootLayout from "../RoomRootLayout";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";

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

  const columns = [
    { field: "name", headerName: "Name" },
    { field: "age", headerName: "Age", type: "number" },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      getActions: ({ id }) => {
        console.log(rows[id]);
        return [
          <GridActionsCellItem
            icon={<i className="fa-solid fa-eye"></i>}
            label="Xem chi tiết"
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
    console.log("category room");
  };

  const newRoomHandler = () => {
    setOpenNewRoomModal(true);
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
                      action: newCateRoomHandler,
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
      <Modal open={openNewRoomModal} onClose={() => setOpenNewRoomModal(false)} size="w-8/12 h-4/6">
        <div className="p-2">
          <h1 className="text-lg">Thêm phòng mới</h1>
          <div className="flex w-full">
            <table className="ml-auto w-7/12">
              <tr>
                <td>
                  <h2>Tên phòng</h2>
                </td>
                <td>
                  <input type="text" />
                </td>
              </tr>
              <tr>
                <td>
                  <h2>Khu vực</h2>
                </td>
                <td>
                  <input type="text" />
                </td>
              </tr>
              <tr>
                <td>
                  <h2>Hạng phòng</h2>
                </td>
                <td>
                  <input type="text" />
                </td>
              </tr>
              <tr>
                <td>
                  <h2>Bắt đầu sử dụng</h2>
                </td>
                <td>
                  <input type="text" />
                </td>
              </tr>
            </table>
            <table className="ml-auto w-5/12">
              <tr>
                <td>
                  <h2>Giá theo giờ</h2>
                </td>
                <td>
                  <input type="text" />
                </td>
              </tr>
              <tr>
                <td>
                  <h2>Giá theo ngày</h2>
                </td>
                <td>
                  <input type="text" />
                </td>
              </tr>
              <tr>
                <td>
                  <h2>Giá theo đêm</h2>
                </td>
                <td>
                  <input type="text" />
                </td>
              </tr>
            </table>
          </div>
          <div className="flex">
            <img
              className="w-20 h-20"
              src="https://media.architecturaldigest.com/photos/5eac5fa22105f13b72dede45/4:3/w_1420,h_1065,c_limit/111LexowAve_Aug18-1074.jpg"
            />
            <img
              className="w-20 h-20"
              src="https://media.architecturaldigest.com/photos/5eac5fa22105f13b72dede45/4:3/w_1420,h_1065,c_limit/111LexowAve_Aug18-1074.jpg"
            />
            <img
              className="w-20 h-20"
              src="https://media.architecturaldigest.com/photos/5eac5fa22105f13b72dede45/4:3/w_1420,h_1065,c_limit/111LexowAve_Aug18-1074.jpg"
            />
            <img
              className="w-20 h-20"
              src="https://media.architecturaldigest.com/photos/5eac5fa22105f13b72dede45/4:3/w_1420,h_1065,c_limit/111LexowAve_Aug18-1074.jpg"
            />
          </div>
          <div>
            <button className="bg-green-500">Luu</button>
            <button className="bg-gray-300">Bo luu</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default RoomManagementPage;
