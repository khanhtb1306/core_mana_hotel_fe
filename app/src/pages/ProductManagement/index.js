import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  viVN,
} from "@mui/x-data-grid";
import { useState } from "react";
import Button from "../../components/UI/Button";
import NewProduct from "../../components/Product/NewProduct";
import NewService from "../../components/Service/NewService";
import DetailsProduct from "../../components/Product/DetailsProduct";
import DetailsService from "../../components/Service/DetailsService";
import { defer, useLoaderData } from "react-router-dom";
import { axiosConfig } from "../../utils/axiosConfig";
import EditProduct from "../../components/Product/EditProduct";

function ProductManagementPage() {
  const { products } = useLoaderData();

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openDeleteProductModal, setOpenDeleteProductModal] = useState(false);
  const [openNewProductModal, setOpenNewProductModal] = useState(false);
  const [openEditProductModal, setOpenEditProductModal] = useState(false);
  const [openNewServiceModal, setOpenNewServiceModal] = useState(false);
  const [openEditServiceModal, setOpenEditServiceModal] = useState(false);

  const [openDetailsProduct, setOpenDetailsProduct] = useState(false);
  const [openDetailsService, setOpenDetailsService] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedUnitId, setSelectedunitId] = useState(null);

  const handleDetailsProduct = (row) => {
    setSelectedunitId(null);
    setSelectedProductId(row.id);
    if (row.goodsCategory === "Hàng hoá") {
      setOpenDetailsProduct(true);
    } else {
      setOpenDetailsService(true);
    }
  };

  const handleEditProduct = (row) => {
    setSelectedunitId(null);
    setSelectedProductId(row.id);
    if (row.goodsCategory === "Hàng hoá") {
      setOpenEditProductModal(true);
    } else {
      setOpenEditServiceModal(true);
    }
  };

  const columns = [
    { field: "code", headerName: "Mã hàng hoá", width: 150 },
    {
      field: "goodsName",
      headerName: "Tên hàng",
      width: 200,
      type: "actions",
      getActions: (params) => {
        const row = params.row;
        let options = null;
        if (row.listUnit.length > 1) {
          options = row.listUnit.map((unit) => {
            return (
              <option
                key={unit.goodsUnitId}
                value={unit.goodsUnitId}
                className="text-xs"
              >
                {unit.goodsUnitName}
              </option>
            );
          });
        }
        return [
          <GridActionsCellItem
            icon={<p className="text-black text-sm">{row.goodsName}</p>}
            label="name"
          />,
          <GridActionsCellItem
            icon={
              options ? (
                <select
                  className="h-9"
                  onChange={(e) => {
                    setSelectedunitId(parseInt(e.target.value, 10));
                    setSelectedProductId(row.id);
                  }}
                >
                  {options}
                </select>
              ) : (
                <>{" (" + row.unitDefault + ")"}</>
              )
            }
            label="unit"
          />,
          ,
        ];
      },
    },
    { field: "goodsCategory", headerName: "Loại hàng", width: 100 },
    { field: "sellingPrice", headerName: "Giá bán", width: 100 },
    { field: "capitalPrice", headerName: "Giá vốn", width: 100 },
    { field: "quantityInStock", headerName: "Tồn kho", width: 100 },
    { field: "minStock", headerName: "Định mức tồn ít nhất", width: 100 },
    { field: "maxStock", headerName: "Định mức tồn nhiều nhất", width: 100 },
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
            onClick={() => handleDetailsProduct(row)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-pen-to-square"></i>}
            label="Edit"
            onClick={() => handleEditProduct(row)}
          />,
        ];
      },
    },
  ];

  const rows = products.map((product) => {
    const status = product.goods.status
      ? "Đang kinh doanh"
      : "Ngừng kinh doanh";
    let unitDefault = product.listGoodsUnit.find((unit) => unit.isDefault);
    if (selectedUnitId && product.goods.goodsId === selectedProductId) {
      unitDefault = product.listGoodsUnit.find(
        (unit) => unit.goodsUnitId === selectedUnitId
      );
    }
    const category = product.goods.goodsCategory ? "Hàng hoá" : "Dịch vụ";
    return {
      id: product.goods.goodsId,
      code: product.goods.goodsId,
      goodsName: product.goods.goodsName,
      unitDefault: unitDefault.goodsUnitName,
      goodsCategory: category,
      sellingPrice: unitDefault.price,
      capitalPrice: unitDefault.cost,
      quantityInStock: product.goods.inventory,
      minStock: product.goods.minInventory,
      maxStock: product.goods.maxInventory,
      status: status,
      listUnit: product.listGoodsUnit,
    };
  });

  const newProductHandler = () => {
    setOpenNewProductModal(true);
  };
  const newServiceHandler = () => {
    setOpenNewServiceModal(true);
  };

  const deleteProductHandler = () => {
    setOpenDeleteProductModal(true);
  };

  return (
    <>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex mb-10">
          <h1 className="text-4xl">Hàng hoá</h1>
          <div className="ml-auto flex">
            {rowSelectionModel.length > 0 ? (
              <div className="mx-2">
                <Button
                  action="Thao tác"
                  iconAction="fa-solid fa-ellipsis-vertical"
                  names={[
                    {
                      name: "Xoá hàng hoá",
                      icon: "fa-solid fa-trash",
                      action: deleteProductHandler,
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
                    name: "Hàng hoá",
                    icon: "fa-solid fa-plus",
                    action: newProductHandler,
                  },
                  {
                    name: "Dịch vụ",
                    icon: "fa-solid fa-plus",
                    action: newServiceHandler,
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
      {openNewProductModal && (
        <NewProduct
          open={openNewProductModal}
          onClose={() => setOpenNewProductModal(false)}
        />
      )}

      <NewService
        open={openNewServiceModal}
        onClose={() => setOpenNewServiceModal(false)}
      />
      {openDetailsProduct && selectedProductId && (
        <DetailsProduct
          open={openDetailsProduct}
          onClose={() => setOpenDetailsProduct(false)}
          product={products.find(
            (pro) => pro.goods.goodsId === selectedProductId
          )}
        />
      )}
      {openDetailsService && selectedProductId && (
        <DetailsService
          open={openDetailsService}
          onClose={() => setOpenDetailsService(false)}
          service={products.find(
            (pro) => pro.goods.goodsId === selectedProductId
          )}
        />
      )}
      {openEditProductModal && selectedProductId && (
        <EditProduct
          open={openEditProductModal}
          onClose={() => setOpenEditProductModal(false)}
          product={products.find(
            (pro) => pro.goods.goodsId === selectedProductId
          )}
        />
      )}
    </>
  );
}

export default ProductManagementPage;

async function loadProducts() {
  const response = await axiosConfig.get("goods");
  return response.data;
}

export async function loader() {
  return defer({
    products: await loadProducts(),
  });
}
