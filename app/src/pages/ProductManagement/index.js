import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  viVN,
} from "@mui/x-data-grid";
import { useState } from "react";
import ButtonHover from "../../components/UI/ButtonHover";
import ButtonClick from "../../components/UI/ButtonClick";
import NewProduct from "../../components/Product/NewProduct";
import NewService from "../../components/Service/NewService";
import DetailsProduct from "../../components/Product/DetailsProduct";
import DetailsService from "../../components/Service/DetailsService";
import { defer, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import EditProduct from "../../components/Product/EditProduct";
import EditService from "../../components/Service/EditService";
import Swal from "sweetalert2";
import DeleteProduct from "../../components/Product/DeleteProduct";
import { Tooltip } from "react-tooltip";

function ProductManagementPage() {
  const { products } = useLoaderData();

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openDeleteProductModal, setOpenDeleteProductModal] = useState(false);
  const [openDeleteProductsModal, setOpenDeleteProductsModal] = useState(false);
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

  const newProductHandler = () => {
    setOpenNewProductModal(true);
  };
  const newServiceHandler = () => {
    setOpenNewServiceModal(true);
  };

  const deleteProductsHandler = () => {
    setOpenDeleteProductsModal(true);
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
      headerName: "Hoạt động",
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
          <GridActionsCellItem
            icon={<i className="fa-solid fa-trash"></i>}
            label="Delete"
            onClick={() => {
              setOpenDeleteProductModal(true);
              setSelectedProductId(row.id);
            }}
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
    const defaultCost = unitDefault.cost;
    if (selectedUnitId && product.goods.goodsId === selectedProductId) {
      unitDefault = product.listGoodsUnit.find(
        (unit) => unit.goodsUnitId === selectedUnitId
      );
    }
    let minStock = "...";
    let maxStock = "...";
    if (product.goods.goodsCategory) {
      if (unitDefault.isDefault) {
        minStock = product.goods.minInventory;
        maxStock = product.goods.maxInventory;
      }
    }
    const category = product.goods.goodsCategory ? "Hàng hoá" : "Dịch vụ";
    return {
      id: product.goods.goodsId,
      code: product.goods.goodsId,
      goodsName: product.goods.goodsName,
      unitDefault: unitDefault.goodsUnitName,
      goodsCategory: category,
      sellingPrice: unitDefault.price,
      capitalPrice: product.goods.goodsCategory ? unitDefault.cost : "...",
      quantityInStock: product.goods.goodsCategory
        ? (product.goods.inventory * defaultCost) / unitDefault.cost
        : "...",
      minStock: minStock,
      maxStock: maxStock,
      status: status,
      listUnit: product.listGoodsUnit,
    };
  });

  return (
    <>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex mb-10">
          <h1 className="text-4xl">Hàng hoá & Dịch vụ</h1>
          <div className="ml-auto flex">
            {rowSelectionModel.length > 0 ? (
              <div className="mx-2">
                <ButtonClick
                  name="Xoá hàng hoá/dịch vụ"
                  iconAction="fa-solid fa-trash"
                  action={deleteProductsHandler}
                />
              </div>
            ) : null}
            <div className="mx-2">
              <ButtonHover
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
      {openEditServiceModal && selectedProductId && (
        <EditService
          open={openEditServiceModal}
          onClose={() => setOpenEditServiceModal(false)}
          product={products.find(
            (pro) => pro.goods.goodsId === selectedProductId
          )}
        />
      )}
      {openDeleteProductsModal && rowSelectionModel.length > 0 && (
        <DeleteProduct
          open={openDeleteProductsModal}
          onClose={() => setOpenDeleteProductsModal(false)}
          listGoodsId={rowSelectionModel}
        />
      )}
      {openDeleteProductModal && selectedProductId && (
        <DeleteProduct
          open={openDeleteProductModal}
          onClose={() => setOpenDeleteProductModal(false)}
          listGoodsId={[selectedProductId]}
        />
      )}
    </>
  );
}

export default ProductManagementPage;

async function loadProducts() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("goods");
  return response.data;
}

export async function loader() {
  return defer({
    pro: await loadProducts(),
    products: await loadProducts(),
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();

  if (method === "DELETE") {
    const dataArray = data.get("listGoodsId").split(",");
    const response = await axiosPrivate
      .delete("goods/" + dataArray)
      .then((response) => {
        let message = "";
        dataArray.map((id) => {
          message += response.data[id] + " có mã sản phẩm là " + id + "<br/>";
        });
        Swal.fire({
          position: "center",
          html: `<p>${message}</p>`,
          showConfirmButton: true,
        });
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          text: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/productManagement");
  }
  if (data.get("categoryGoods")) {
    const formData = new FormData();
    formData.append("goodsDTO.goodsName", data.get("goodsName"));
    formData.append("goodsDTO.goodsCategory", true);
    formData.append("goodsDTO.minInventory", data.get("minInventory"));
    formData.append("goodsDTO.maxInventory", data.get("maxInventory"));
    formData.append("goodsDTO.note", data.get("note"));
    formData.append("goodsDTO.description", data.get("description"));
    formData.append("goodsDTO.image", data.get("image1"));
    const defaultCost = data.get("cost");
    const defaultPrice = data.get("price");
    const defaultUnit = data.get("unit");
    formData.append("goodsUnitDTO.goodsUnitName", defaultUnit);
    formData.append("goodsUnitDTO.cost", defaultCost);
    formData.append("goodsUnitDTO.price", defaultPrice);
    const units = data.get("numberUnit");
    if (method === "POST") {
      formData.append("goodsDTO.inventory", 10);
      const response = await axiosPrivate
        .post("goods", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "error",
            title: e.response.data,
            showConfirmButton: false,
            timer: 1500,
          });
        });
      if (response) {
        if (units >= 0) {
          for (let i = 0; i < units; i++) {
            const cost = defaultCost * data.get("amount" + i);
            const unit = data.get("unit" + i);
            const price = data.get("price" + i);
            const formUnit = new FormData();
            formUnit.append("goodsUnitName", unit);
            formUnit.append("goodsId", response.data.goodsId);
            formUnit.append("cost", cost);
            formUnit.append("price", price);
            await axiosPrivate
              .post("goods-unit", formUnit, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((response) => console.log(response))
              .catch((e) => {
                console.log(e);
              });
          }
        }
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      return redirect("/manager/productManagement");
    }
    if (method === "PUT") {
      const response = await axiosPrivate
        .put("goods/" + data.get("goodsId"), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
      if (response) {
        if (units >= 0) {
          const goodsId = data.get("goodsId");
          await axiosPrivate
            .delete("goods-unit/" + goodsId, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => console.log(response))
            .catch((e) => {
              console.log(e);
            });
          for (let i = 0; i < units; i++) {
            const cost = data.get("cost") * data.get("amount" + i);
            const unit = data.get("unit" + i);
            const price = data.get("price" + i);
            const formUnit = new FormData();
            formUnit.append("goodsUnitName", unit);
            formUnit.append("goodsId", goodsId);
            formUnit.append("cost", cost);
            formUnit.append("price", price);
            await axiosPrivate
              .post("goods-unit", formUnit, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((response) => console.log(response))
              .catch((e) => {
                console.log(e);
              });
          }
        }
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      return redirect("/manager/productManagement");
    }
  } else {
    const formData = new FormData();
    formData.append("goodsDTO.goodsName", data.get("goodsName"));
    formData.append("goodsDTO.goodsCategory", false);
    formData.append("goodsDTO.note", data.get("note"));
    formData.append("goodsDTO.description", data.get("description"));
    formData.append("goodsDTO.image", data.get("image1"));
    formData.append("goodsUnitDTO.goodsUnitName", data.get("unit"));
    formData.append("goodsUnitDTO.price", data.get("price"));
    if (method === "POST") {
      await axiosPrivate
        .post("goods", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: e.response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    }
    if (method === "PUT") {
      await axiosPrivate
        .put("goods/" + data.get("goodsId"), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
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
    }
  }
  return redirect("/manager/productManagement");
}
