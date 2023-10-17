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

function ProductManagementPage() {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openDeleteProductModal, setOpenDeleteProductModal] = useState(false);
  const [openNewProductModal, setOpenNewProductModal] = useState(false);
  const [openNewServiceModal, setOpenNewServiceModal] = useState(false);

  const [openDetailsProduct, setOpenDetailsProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleDetailsRoom = (id) => {
    setOpenDetailsProduct(true);
    setSelectedProductId(id);
  };

  const columns = [
    { field: "code", headerName: "Mã hàng hoá", width: 150 },
    { field: "nameProduct", headerName: "Tên hàng", width: 200 },
    { field: "cateProduct", headerName: "Loại hàng", width: 100 },
    { field: "sellingPrice", headerName: "Giá bán", width: 100 },
    { field: "capitalPrice", headerName: "Giá vốn", width: 100 },
    { field: "quantityInStock", headerName: "Tồn kho", width: 100 },
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
      code: "DV000001",
      nameProduct: "Bắn bi-a",
      cateProduct: "Dịch vụ",
      sellingPrice: 25000,
      capitalPrice: 18000,
      quantityInStock: 100,
    },
    {
      id: 2,
      code: "SP000001",
      nameProduct: "Coca-cola",
      cateProduct: "Hàng hoá",
      sellingPrice: 25000,
      capitalPrice: 18000,
      quantityInStock: 100,
    },
    {
      id: 3,
      code: "SP000002",
      nameProduct: "Sprite",
      cateProduct: "Hàng hoá",
      sellingPrice: 25000,
      capitalPrice: 18000,
      quantityInStock: 100,
    },
    {
      id: 4,
      code: "SP000003",
      nameProduct: "Nước khoáng",
      cateProduct: "Hàng hoá",
      sellingPrice: 25000,
      capitalPrice: 18000,
      quantityInStock: 100,
    },
    {
      id: 5,
      code: "SP000004",
      nameProduct: "Bim bim",
      cateProduct: "Hàng hoá",
      sellingPrice: 25000,
      capitalPrice: 18000,
      quantityInStock: 100,
    },
  ];

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
      <NewProduct
        open={openNewProductModal}
        onClose={() => setOpenNewProductModal(false)}
      />
      <NewService
        open={openNewServiceModal}
        onClose={() => setOpenNewServiceModal(false)}
      />
      {/* {openDetailsProduct && selectedProductId && (
        <DetailsProduct
          open={openDetailsProduct}
          onClose={() => setOpenDetailsProduct(false)}
          roomId={selectedProductId}
        />
      )} */}
      <DetailsService
        open={openDetailsProduct}
        onClose={() => setOpenDetailsProduct(false)}
        roomId={selectedProductId}
      />
    </>
  );
}

export default ProductManagementPage;
