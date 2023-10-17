import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar, viVN } from "@mui/x-data-grid";
import { useState } from "react";
import Button from "../../components/UI/Button";
import NewStocktakeRoom from "../../components/Stocktake/NewStocktake";

function StocktakeManagementPage() {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewStockModal, setOpenNewStocktModal] = useState(false);

  const [openDetailsStocktake, setOpenDetailsStocktake] = useState(false);
  const [selectedStocktakeId, setSelectedStocktakeId] = useState(null);

  const handleDetailsRoom = (id) => {
    setOpenDetailsStocktake(true);
    setSelectedStocktakeId(id);
  };

  const columns = [
    { field: "code", headerName: "Mã kiểm kho", width: 150 },
    { field: "time", headerName: "Thời gian", width: 150 },
    { field: "totalDif", headerName: "Tổng chênh lệch", width: 100 },
    { field: "totalPriceDif", headerName: "Tổng giá trị lệnh", width: 150 },
    { field: "incDif", headerName: "SL lệch tăng", width: 100 },
    { field: "incPriceDif", headerName: "Tổng giá trị tăng", width: 150 },
    { field: "decDif", headerName: "SL lệch giảm", width: 100 },
    { field: "decPriceDif", headerName: "Tổng giá trị giảm", width: 150 },
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
      code: "KK000001",
      time: "26/10/2022",
      totalDif: -2,
      totalPriceDif: -71000,
      incDif: 7,
      incPriceDif: 91000,
      decDif: -9,
      decPriceDif: -162000
    },
    {
      id: 2,
      code: "KK000002",
      time: "26/11/2022",
      totalDif: -13,
      totalPriceDif: -182000,
      incDif: 0,
      incPriceDif: 0,
      decDif: -13,
      decPriceDif: -182000
    },
  ];

  const newStockHandler = () => {
    setOpenNewStocktModal(true);
  };

  return (
    <>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex mb-10">
          <h1 className="text-4xl">Phiếu kiểm kho</h1>
          <div className="ml-auto flex">
            <div className="mx-2">
              <Button
                action="Thêm mới"
                iconAction="fa-solid fa-plus"
                names={[
                  {
                    name: "Kiểm kho",
                    icon: "fa-solid fa-plus",
                    action: newStockHandler,
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
      <NewStocktakeRoom
        open={openNewStockModal}
        onClose={() => setOpenNewStocktModal(false)}
      />
    </>
  );
}

export default StocktakeManagementPage;