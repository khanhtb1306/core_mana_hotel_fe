import { useState } from "react";
import RoomRootLayout from "../RoomRootLayout";
import Button from "../../components/UI/Button";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "id",
    headerName: "Mã hàng hoá",
    width: 150,
    headerClassName: "bg-blue-300",
  },
  {
    field: "name",
    headerName: "Tên hạng phòng",
    sortable: true,
    width: 300,
    // valueGetter: (params) =>
    //   `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
  {
    field: "amount",
    headerName: "SL phòng",
    width: 110,
    editable: true,
  },
  {
    field: "priceHour",
    headerName: "Giá theo giờ",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "priceDay",
    headerName: "Giá theo ngày",
    //description: "This column has a value getter and is not sortable.",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "priceNight",
    headerName: "Giá qua đêm",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 150,
    sortable: false,
    valueGetter: (params) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const DUMMY_CATEGORY_ROOM = [
  {
    id: "Double Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi",
    amount: 3,
    priceHour: 170000,
    priceDay: 620000,
    priceNight: 620000,
    status: "Dang kinh doanh",
  },
  {
    id: "Double1 Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi 3 nguoi 4 nguoi 5 nguoi 6 nguoi ",
    amount: 2,
    priceHour: 180000,
    priceDay: 720000,
    priceNight: 720000,
    status: "Dang kinh doanh",
  },
  {
    id: "Double2 Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi 3 nguoi 4 nguoi 5 nguoi 6 nguoi ",
    amount: 2,
    priceHour: 180000,
    priceDay: 720000,
    priceNight: 720000,
    status: "Dang kinh doanh",
  },
  {
    id: "Double3 Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi 3 nguoi 4 nguoi 5 nguoi 6 nguoi ",
    amount: 2,
    priceHour: 180000,
    priceDay: 720000,
    priceNight: 720000,
    status: "Dang kinh doanh",
  },
  {
    id: "Double4 Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi 3 nguoi 4 nguoi 5 nguoi 6 nguoi ",
    amount: 2,
    priceHour: 180000,
    priceDay: 720000,
    priceNight: 720000,
    status: "Dang kinh doanh",
  },
  {
    id: "Double5 Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi 3 nguoi 4 nguoi 5 nguoi 6 nguoi ",
    amount: 2,
    priceHour: 180000,
    priceDay: 720000,
    priceNight: 720000,
    status: "Dang kinh doanh",
  },
  {
    id: "Double6 Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi 3 nguoi 4 nguoi 5 nguoi 6 nguoi ",
    amount: 2,
    priceHour: 180000,
    priceDay: 720000,
    priceNight: 720000,
    status: "Dang kinh doanh",
  },
  {
    id: "Double7 Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi 3 nguoi 4 nguoi 5 nguoi 6 nguoi ",
    amount: 2,
    priceHour: 180000,
    priceDay: 720000,
    priceNight: 720000,
    status: "Dang kinh doanh",
  },
  {
    id: "Double8 Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi 3 nguoi 4 nguoi 5 nguoi 6 nguoi ",
    amount: 2,
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
          <RoomRootLayout isActive={true} />
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={DUMMY_CATEGORY_ROOM}
              columns={columns}
            />
          </Box>
        </div>
      </div>
    </>
  );
}

export default CategoryManagementPage;
