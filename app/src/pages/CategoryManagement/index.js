import { useState } from "react";
import FilterSearch from "../../components/FilterSearch";
import FilterStatus from "../../components/FilterStatus";
import RoomRootLayout from "../RoomRootLayout";
import Button from "../../components/UI/Button";

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const DUMMY_CATEGORY_ROOM = [
  {
    id: "Double Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi",
    amount: "2",
    priceHour: 180000,
    priceDay: 720000,
    priceNight: 720000,
    status: "Dang kinh doanh",
  },
  {
    id: "Double1 Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi 3 nguoi 4 nguoi 5 nguoi 6 nguoi ",
    amount: "2",
    priceHour: 180000,
    priceDay: 720000,
    priceNight: 720000,
    status: "Dang kinh doanh",
  },
];

function CategoryManagementPage() {
  const all = ["Tat ca", "Tang 1", "Tang 2"];

  const [showButtonAction, setShowButtonAction] = useState(false);

  //Get each row from list category room
  const listCate = DUMMY_CATEGORY_ROOM.map((item) => (
    <tr key={item.id} className="border-gray-300 border even:bg-white">
      <td className="p-2">
        <input
          type="checkbox"
          className="w-5 h-5 border-gray-300 focus:ring-green-200 text-green-500"
          onChange={() => setShowButtonAction(!showButtonAction)}
        />
      </td>
      <td className="p-2">{item.id}</td>
      <td className="p-2">{item.name}</td>
      <td className="p-2">{item.amount}</td>
      <td className="p-2">{item.priceHour}</td>
      <td className="p-2">{item.priceDay}</td>
      <td className="p-2">{item.priceNight}</td>
      <td className="p-2">{item.status}</td>
    </tr>
  ));

  return (
    <>
      <div className="flex">
        <div className="w-2/12 mr-10 ml-10 mt-5">
          <FilterSearch
            name="Tìm kiếm"
            subName="Tìm kiếm hạng phòng"
            all={all}
          />
          <FilterSearch name="Hang phong" subName="Tìm kiếm hạng phòng" />
          <FilterStatus />
        </div>

        <div className="w-10/12 pt-5 pl-5 mr-10">
          <div className="flex">
            <h1 className="text-4xl">Hạng phòng & Phòng</h1>
            {showButtonAction ? (
              <Button
                action="Thao tác"
                iconAction="fa-solid fa-ellipsis-vertical"
                names={[{ name: "Xoá hạng phòng", icon: "fa-solid fa-trash" }]}
              />
            ) : null}
            <Button
              action="Thêm mới"
              iconAction="fa-solid fa-plus"
              names={[
                { name: "Hạng phòng", icon: "fa-solid fa-plus" },
                { name: "Phòng", icon: "fa-solid fa-plus" },
              ]}
            />
          </div>
          <RoomRootLayout />
          <table className="table-auto w-full">
            <thead className="bg-blue-200">
              <tr className="border-blue-300 border">
                <td className="p-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 border-gray-300 focus:ring-green-200 text-green-500"
                  />
                </td>
                <td className="p-2">Mã hạng phòng</td>
                <td className="p-2">Tên hạng phòng</td>
                <td className="p-2">SL phòng</td>
                <td className="p-2">Giá theo giờ</td>
                <td className="p-2">Giá theo ngày</td>
                <td className="p-2">Giá qua đêm</td>
                <td className="p-2">Trạng thái</td>
              </tr>
            </thead>
            <tbody>{listCate}</tbody>
          </table>
          <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
        </div>
      </div>
    </>
  );
}

export default CategoryManagementPage;
