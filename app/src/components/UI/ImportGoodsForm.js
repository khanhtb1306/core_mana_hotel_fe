import { Form, useLoaderData } from "react-router-dom";
import Modal from "./Modal";
import { useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import SearchProduct from "../Search/SearchProduct";


function ImportGoodsForm({ name, open, onClose, method, importGoods,importGoodsDetail }) {
  const { goodsUnit } = useLoaderData();
  const productUnit = goodsUnit.filter((unit) => unit.goods.goodsCategory);
  let formattedDate = null;
  
  if (importGoods.timeImport ) {
    const dateNow = new Date(importGoods.timeImport);
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, "0");
    const day = String(dateNow.getDate()).padStart(2, "0");
    formattedDate = `${year}-${month}-${day}`;
  }
  let array = [];
  if (importGoodsDetail) {
    array = goodsUnit.filter((unit) => {
      for (const stock of importGoodsDetail) {
        if (stock.goodsUnit.goodsUnitId === unit.goodsUnitId) {
          return true;
        }

      }
      return false;
    });
  }
  const listUnit = productUnit.filter((unit) => {
    if (importGoodsDetail) {
      for (const stock of importGoodsDetail) {
        if (stock.goodsUnit.goodsUnitId === unit.goodsUnitId) {
          return false;
        }
      }
    }
    return true;
  });

  const [products, setProducts] = useState(array);
  const [productsAdd, setProductsAdd] = useState(listUnit);
  const handleProductClick = (goodsUnitId) => {
    const updateProducts = [
      ...products,
      productsAdd.find((unit) => unit.goodsUnitId === goodsUnitId),
    ];
    setProductsAdd(
      productsAdd.filter((unit) => unit.goodsUnitId !== goodsUnitId)
    );
    setProducts(updateProducts);

  };
  const [formData, setFormData] = useState(() => {
    const initialFormData = productUnit.reduce((acc, unit) => {
      let actualInventory = 0;
      if (importGoodsDetail) {
        importGoodsDetail.map((check) => {
          if (check.goodsUnit.goodsUnitId === unit.goodsUnitId ) {
            actualInventory = check.amount;
          }
        });
      }
      return {
        ...acc,
        [`actualInventory${unit.goodsUnitId}`]: actualInventory,
      };
    }, {});

    return initialFormData;
  });

  function handleChange(e) {
    const { name, value } = e.target;
    const id = parseInt(name.match(/\d+/)[0], 10);
    setFormData({
      ...formData,
      [name]: parseInt(value),
    });
  }

  const handleProductDelete = (goodsUnitId) => {
    const updateProducts = products.filter(
      (unit) => unit.goodsUnitId !== goodsUnitId
    );
    setProductsAdd([
      ...productsAdd,
      products.find((unit) => unit.goodsUnitId === goodsUnitId),
    ]);
    setProducts(updateProducts);
  };

  const [inputStatus, setInputStatus] = useState(4);

  function handleStatus(status) {
    if (status === 7) {
      setInputStatus(7);
    }
    if (status === 4) {
      setInputStatus(4);
    }
  }

  const columns = [
    { field: "goodsId", headerName: "Mã hàng hoá", width: 150 },
    { field: "goodsName", headerName: "Tên hàng hoá", width: 150 },
    { field: "cost", headerName: "Đơn giá", width: 150 },
    {
      field: "actualInventory",
      headerName: "Số lượng",
      width: 250,
      type: "actions",
      getActions: (params) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={
              <div className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0">
                <input
                  type="number"
                  min={0}
                  name={`actualInventory${row.id}`}
                  value={
                    formData[`actualInventory${row.id}`]
                      ? formData[`actualInventory${row.id}`]
                      : 0
                  }
                  onChange={handleChange}
                />
              </div>
            }
            label="unit"
          />,
        ];
      },
    },
    // { field: "total", headerName: "Thành tiền", width: 150 },
    {
      field: "action",
      headerName: "Hành động",
      width: 150,
      type: "actions",
      getActions: (params) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<i className="fa-solid fa-trash"></i>}
            label="unit"
            onClick={() => handleProductDelete(row.id)}
          />,
        ];
      },
    },
  ];

  let rows = [];
  if (products.length > 0) {
    rows = products.map((pro, index) => {
      // let inventory = pro.goods.inventory;
      // if (!pro.isDefault) {
      //   const defaultPro = goodsUnit.find(
      //     (unit) => unit.goods.goodsId && unit.isDefault
      //   );
      //   inventory /= pro.cost / defaultPro.cost;
      // }
      return {
        id: pro.goodsUnitId,
        goodsId: pro.goods.goodsId,
        goodsName: pro.goods.goodsName + ` (${pro.goodsUnitName})`,
        cost: pro.cost,
        actualInventory: 0,
      };
    });
  }
  const [openInfo, setOpenInfo] = useState(true);
  const [openNote, setOpenNote] = useState(false);

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenNote(false);
  };

  const handleNote = () => {
    setOpenInfo(false);
    setOpenNote(true);
  };

  return (
    <Form method={method} onSubmit={onClose}>
      <Modal open={open} onClose={onClose} button={true} size="w-8/12 h-.5/6">
        <div className="p-2 w-full">
          <div>
            <h1 className="text-lg pb-5 font-bold">{name}</h1>
            <div className="flex flex-row mb-3 ">
              <div className="basis-1/2 flex flex-row  ">
                <div className="w-3/12 basis-1/4">
                  <h2 className="mt-3">Ngày nhập</h2>
                </div>
                <div className="w-9/12  basis-3/4">
                  <input
                    className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="date"
                    name="timeImport"
                    defaultValue={formattedDate ? formattedDate : ""}
                    required
                  />
                </div>
              </div>
              <div className="basis-1/2 flex flex-row  ">
                <div className="w-3/12 basis-1/4">
                  <h2 className="mt-3">Nhà cung cấp</h2>
                </div>
                <div className="w-9/12  basis-3/4">
                  <input
                    className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="supplier"
                    minLength="1"
                    maxLength="255"
                    defaultValue={importGoods.supplier ? importGoods.supplier : ""}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row mb-3 ">
              <div className="basis-1/2 flex flex-row  ">
                <div className="w-3/12 basis-1/4">
                  <h2 className="mt-3">Đã trả</h2>
                </div>
                <div className="w-9/12  basis-3/4">
                  <input
                    className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="number"
                    name="paid"
                    defaultValue={importGoods.paid ? importGoods.paid : ""}
                    required
                  />
                </div>
              </div>
              <input type="hidden" name="status" value={inputStatus} />

            </div>
          </div>
          <div className={`pt-5 ${openInfo ? "" : "hidden"}`}>
            <div className="flex w-full">
              <table className="w-8/12 mr-5">
                <tbody>
                  <tr>
                    <td className="w-3/12">
                      <h2>Tìm hàng hoá</h2>
                    </td>
                    <td className="w-9/12">
                      <SearchProduct
                        goodsUnit={productsAdd}
                        handleProductClick={handleProductClick}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <input type="hidden" name="status" value={inputStatus} />
            {importGoods && (
              <input
                type="hidden"
                name="importGoodsId"
                defaultValue={importGoods.importGoodsId?importGoods.importGoodsId: ""}
              />
            )}
            {rows.length > 0 && (
              <div className="pt-10">
                <DataGrid
                  columns={columns}
                  rows={rows}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                />
                <input
                  type="hidden"
                  name="products"
                  value={products.map((pro) => {
                    if (pro.isDefault) {
                      return (
                        pro.goodsUnitId + "|" + pro.goods.goodsId + "|" + 1
                      );
                    } else {
                      const defaultPro = goodsUnit.find(
                        (unit) => pro.goods.goodsId === unit.goods.goodsId && unit.isDefault
                      );
                      return (
                        pro.goodsUnitId +
                        "|" +
                        pro.goods.goodsId +
                        "|" +
                        pro.cost / defaultPro.cost
                      );
                    }
                  })}
                />
              </div>
            )}
          </div>
          <div className={`mt-10 ${openNote ? "" : "hidden"}`}>
            <h2 className="px-4 py-2 bg-gray-200">Mô tả</h2>
            <textarea
              className="textarea border-0 textarea-lg w-full h-40 max-h-40"
              name="note"
              defaultValue={""}
            ></textarea>
          </div>
        </div>
        <div className="flex pt-5">
          <div className="ml-auto">
            <button
              className="bg-green-500 mr-10 py-2 px-6 text-white rounded"
              onClick={() => handleStatus(7)}
              disabled={``}
            >
              Lưu
            </button>
            <button
              className="bg-orange-500 mr-10 py-2 px-6 text-white rounded"
              onClick={() => handleStatus(4)}
            >
              Lưu tạm
            </button>
            <button
              type="button"
              className="bg-gray-400 py-2 px-6 text-white rounded"
              onClick={() => {
                onClose();
              }}
            >
              Bỏ qua
            </button>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default ImportGoodsForm;
