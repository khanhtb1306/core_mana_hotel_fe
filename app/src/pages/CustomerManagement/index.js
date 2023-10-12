import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from "@mui/x-data-grid";
import { useState } from "react";
import Button from "../../components/UI/Button";
import NewStocktakeRoom from "../../components/Stocktake/NewStocktake";
import NewCustomer from "../../components/Customer/NewCustomer";
import DetailsCustomer from "../../components/Customer/DetailsCustomer";

function CustomerManagementPage() {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewCustomerModal, setOpenNewCustomerModal] = useState(false);

  const [openDetailsStocktake, setOpenDetailsStocktake] = useState(false);
  const [selectedStocktakeId, setSelectedStocktakeId] = useState(null);

  const handleDetailsRoom = (id) => {
    setOpenDetailsStocktake(true);
    setSelectedStocktakeId(id);
  };

  const columns = [
    { field: "code", headerName: "Mã khách hàng", width: 150 },
    { field: "nameCus", headerName: "Tên khách hàng", width: 150 },
    { field: "IC", headerName: "CMND", width: 150 },
    { field: "address", headerName: "Địa chỉ", width: 200 },
    { field: "phoneNumber", headerName: "Số điện thoại", width: 150 },
    { field: "DOB", headerName: "Năm sinh", width: 100 },
    { field: "gender", headerName: "Giới tính", width: 100 },
    { field: "email", headerName: "Thư điện tử", width: 200 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    {
      field: "actions",
      headerName: "Hoạt động",
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
            label="Sửa đổi"
          />,
        ];
      },
    },
  ];

  const rows = [
    {
      id: 1,
      code: "KH000001",
      nameCus: "dinh van tien",
      IC: "123456789",
      address: "Yen Khanh / Ninh Binh",
      phoneNumber: "0981987625",
      DOB: "26/10/2001",
      gender: "Nam",
      email: "dinhvantiendev@gmail.com",
      status: "Dang hoat dong"
    },
  ];

  const newCustomerHandler = () => {
    setOpenNewCustomerModal(true);
  };

  return (
    <>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex mb-10">
          <h1 className="text-4xl">Khách hàng</h1>
          <div className="ml-auto flex">
            <div className="mx-2">
              <Button
                action="Thêm mới"
                iconAction="fa-solid fa-plus"
                names={[
                  {
                    name: "Khách hàng",
                    icon: "fa-solid fa-plus",
                    action: newCustomerHandler,
                  }
                ]}
              />
            </div>
          </div>
        </div>
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
      <NewCustomer
        open={openNewCustomerModal}
        onClose={() => setOpenNewCustomerModal(false)}
      />
      {openDetailsStocktake && selectedStocktakeId && (
        <DetailsCustomer
          open={openDetailsStocktake}
          onClose={() => setOpenDetailsStocktake(false)}
          roomId={selectedStocktakeId}
        />
      )}
    </>
  );
}

export default CustomerManagementPage;