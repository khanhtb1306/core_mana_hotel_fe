import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  viVN,
} from "@mui/x-data-grid";
import { useState } from "react";
import NewStocktakeRoom from "../../components/Stocktake/NewStocktake";
import { defer, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import DetailsStocktake from "../../components/Stocktake/DetailsStocktake";
import Swal from "sweetalert2";
import ButtonClick from "../../components/UI/ButtonClick";
import EditStocktake from "../../components/Stocktake/EditStocktake";
import DeleteStocktake from "../../components/Stocktake/DeleteStocktake";

function StocktakeManagementPage() {
  const { stocktakes } = useLoaderData();
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewStockModal, setOpenNewStocktModal] = useState(false);

  const [openDetailsStocktakeModal, setOpenDetailsStocktakeModal] =
    useState(false);
  const [openEditStocktakerModal, setOpenEditStocktakeModal] = useState(false);
  const [openDeleteStocktakerModal, setOpenDeleteStocktakeModal] =
    useState(false);
  const [selectedStocktakeId, setSelectedStocktakeId] = useState(null);

  const handleDetailsStocktake = (id) => {
    setOpenDetailsStocktakeModal(true);
    setSelectedStocktakeId(id);
  };

  const handleEditStocktake = (id) => {
    setOpenEditStocktakeModal(true);
    setSelectedStocktakeId(id);
  };

  const handleDeleteStocktake = (id) => {
    setOpenDeleteStocktakeModal(true);
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
      headerName: "Hoạt động",
      type: "actions",
      getActions: (params) => {
        const row = params.row;
        let isActive = null;
        if (row.status === "Phiếu tạm") {
          isActive = true;
        } else {
          isActive = false;
        }
        return [
          <GridActionsCellItem
            icon={<i className="fa-solid fa-eye"></i>}
            label="Xem chi tiết"
            onClick={() => handleDetailsStocktake(row.id)}
          />,
          isActive ? (
            <GridActionsCellItem
              icon={<i className="fa-solid fa-pen-to-square"></i>}
              label="Chỉnh sửa"
              onClick={() => handleEditStocktake(row.id)}
            />
          ) : (
            <></>
          ),
          isActive ? (
            <GridActionsCellItem
              icon={<i className="fa-solid fa-trash"></i>}
              label="Xoá"
              onClick={() => handleDeleteStocktake(row.id)}
            />
          ) : (
            <></>
          ),
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
        balance.incPriceDif += inven.valueDiscrepancy;
      } else if (inven.quantityDiscrepancy < 0) {
        balance.decDif += inven.quantityDiscrepancy;
        balance.decPriceDif += inven.valueDiscrepancy;
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
              <ButtonClick
                name="Thêm mới kiểm kho"
                iconAction="fa-solid fa-plus"
                action={newStockHandler}
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
      {openEditStocktakerModal && selectedStocktakeId && (
        <EditStocktake
          open={openEditStocktakerModal}
          onClose={() => setOpenEditStocktakeModal(false)}
          stocktake={stocktakes.find(
            (stocktake) =>
              stocktake.inventoryCheck.inventoryCheckId === selectedStocktakeId
          )}
        />
      )}
      {openDeleteStocktakerModal && selectedStocktakeId && (
        <DeleteStocktake
          open={openDeleteStocktakerModal}
          onClose={() => setOpenDeleteStocktakeModal(false)}
          stocktakeId={selectedStocktakeId}
        />
      )}
    </>
  );
}

export default StocktakeManagementPage;

async function loadStocktakes() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("inventory-check");
  return response.data;
}

async function loadProducts() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("goods");
  return response.data;
}

async function loadGoodsUnit() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("goods-unit");
  return response.data;
}

export async function loader() {
  return defer({
    products: await loadProducts(),
    goodsUnit: await loadGoodsUnit(),
    stocktakes: await loadStocktakes(),
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const formData = new FormData();
  if (method === "DELETE") {
    await axiosPrivate
      .delete("inventory-check/" + data.get("inventoryCheckId"))
      .then((response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/stocktakeManagement");
  }
  formData.append("inventoryCheckDTO.note", data.get("note"));
  formData.append("inventoryCheckDTO.status", data.get("status"));
  const unitsArray = data.get("products").split(",");
  const units = unitsArray.map((units) => {
    const unit = units.split("|");
    return {
      unitId: unit[0],
      productId: unit[1],
      amount: unit[2],
    };
  });
  const result = units.reduce((acc, curr) => {
    const actualInventory = data.get("actualInventory" + curr.unitId);
    const existingItem = acc.find((item) => item.productId === curr.productId);
    if (existingItem) {
      existingItem.actualInventory +=
        Number(actualInventory) * Number(curr.amount);
    } else {
      acc.push({
        productId: curr.productId,
        actualInventory: Number(actualInventory) * Number(curr.amount),
      });
    }
    return acc;
  }, []);
  result.map((pro, index) => {
    formData.append(
      `listInventoryCheckDetailDTO[${index}].goodsId`,
      pro.productId
    );
    formData.append(
      `listInventoryCheckDetailDTO[${index}].actualInventory`,
      pro.actualInventory
    );
  });
  if (method === "POST") {
    await axiosPrivate
      .post("inventory-check", formData)
      .then((response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/stocktakeManagement");
  }
  if (method === "PUT") {
    await axiosPrivate
      .put("inventory-check/" + data.get("inventoryCheckId"), formData)
      .then((response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/stocktakeManagement");
  }

  return redirect("/manager/stocktakeManagement");
}
