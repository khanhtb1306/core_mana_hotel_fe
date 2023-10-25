import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  viVN,
} from "@mui/x-data-grid";
import { useState } from "react";
import ButtonHover from "../../components/UI/ButtonHover";
import NewStocktakeRoom from "../../components/Stocktake/NewStocktake";
import { defer, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import DetailsStocktake from "../../components/Stocktake/DetailsStocktake";

function StocktakeManagementPage() {
  const { stocktakes } = useLoaderData();
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewStockModal, setOpenNewStocktModal] = useState(false);

  const [openDetailsStocktakeModal, setOpenDetailsStocktakeModal] =
    useState(false);
  const [selectedStocktakeId, setSelectedStocktakeId] = useState(null);

  const handleDetailsRoom = (id) => {
    setOpenDetailsStocktakeModal(true);
    setSelectedStocktakeId(id);
  };

  const columns = [
    { field: "code", headerName: "Mã kiểm kho", width: 150 },
    { field: "timeCreate", headerName: "Thời gian", width: 160 },
    { field: "timeBalance", headerName: "Ngày cân bằng", width: 160 },
    { field: "totalDif", headerName: "Tổng chênh lệch", width: 100 },
    { field: "totalPriceDif", headerName: "Tổng giá trị lệnh", width: 150 },
    { field: "incDif", headerName: "SL lệch tăng", width: 100 },
    { field: "incPriceDif", headerName: "Tổng giá trị tăng", width: 150 },
    { field: "decDif", headerName: "SL lệch giảm", width: 100 },
    { field: "decPriceDif", headerName: "Tổng giá trị giảm", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      getActions: (params) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<i className="fa-solid fa-eye"></i>}
            label="Xem chi tiết"
            onClick={() => handleDetailsRoom(row.id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-pen-to-square"></i>}
            label="Edit"
          />,
        ];
      },
    },
  ];

  const rows = stocktakes.map((stocktake) => {
    let timeBalance = "";
    let status = "";
    const timeCreate = new Date(stocktake.inventoryCheck.createdDate)
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    if (stocktake.inventoryCheck.status === 4) {
      status = "Phiếu tạm";
    }
    if (stocktake.inventoryCheck.status === 5) {
      status = "Đã cân bằng kho";
      timeBalance = new Date(stocktake.inventoryCheck.timeBalance)
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
    }
    const balance = {
      incDif: 0,
      incPriceDif: 0,
      decDif: 0,
      decPriceDif: 0,
    };

    stocktake.listInventoryCheckDetails.map((inven) => {
      if (inven.quantityDiscrepancy > 0) {
        balance.incDif += inven.quantityDiscrepancy;
        balance.incPriceDif +=
          inven.quantityDiscrepancy * inven.valueDiscrepancy;
      } else if (inven.quantityDiscrepancy < 0) {
        balance.decDif += inven.quantityDiscrepancy;
        balance.decPriceDif -=
          inven.quantityDiscrepancy * inven.valueDiscrepancy;
      }
    });
    return {
      id: stocktake.inventoryCheck.inventoryCheckId,
      code: stocktake.inventoryCheck.inventoryCheckId,
      timeCreate: timeCreate,
      timeBalance: timeBalance,
      totalDif: balance.incDif + balance.decDif,
      totalPriceDif: balance.incPriceDif + balance.decPriceDif,
      incDif: balance.incDif,
      incPriceDif: balance.incPriceDif,
      decDif: balance.decDif,
      decPriceDif: balance.decPriceDif,
      status: status,
    };
  });

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
              <ButtonHover
                action="Thêm mới"
                iconAction="fa-solid fa-plus"
                names={[
                  {
                    name: "Kiểm kho",
                    icon: "fa-solid fa-plus",
                    action: newStockHandler,
                  },
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
      {openNewStockModal && (
        <NewStocktakeRoom
          open={openNewStockModal}
          onClose={() => setOpenNewStocktModal(false)}
        />
      )}
      {openDetailsStocktakeModal && selectedStocktakeId && (
        <DetailsStocktake
          open={openDetailsStocktakeModal}
          onClose={() => setOpenDetailsStocktakeModal(false)}
          stocktake={stocktakes.find(
            (stocktake) =>
              stocktake.inventoryCheck.inventoryCheckId === selectedStocktakeId
          )}
        />
      )}
    </>
  );
}

export default StocktakeManagementPage;

async function loadStocktakes() {
  // const token = localStorage.getItem("token");
  // if (!token) {
  //   return redirect("/login");
  // }
  const response = await axiosPrivate.get("inventory-check");
  return response.data;
}

export async function loader() {
  return defer({
    stocktakes: await loadStocktakes(),
  });
}
