import { Form, useLoaderData } from "react-router-dom";
import Modal from "../UI/Modal";
import SearchProduct from "../Search/SearchProduct";
import { useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

function StocktakeForm({ name, open, onClose, method, stocktake }) {
  const { goodsUnit } = useLoaderData();
  const productUnit = goodsUnit.filter((unit) => unit.goods.goodsCategory);
  const [products, setProducts] = useState([]);
  const [productsAdd, setProductsAdd] = useState(productUnit);
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
      return {
        ...acc,
        [`actualInventory${unit.id}`]: 0,
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
    if (status === 5) {
      setInputStatus(5);
    }
    if (status === 4) {
      setInputStatus(4);
    }
  }

  const columns = [
    { field: "goodsId", headerName: "Mã hàng hoá", width: 150 },
    { field: "goodsName", headerName: "Tên hàng hoá", width: 200 },
    { field: "inventory", headerName: "Tồn kho", width: 200 },
    {
      field: "actualInventory",
      headerName: "Thực tế",
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
      return {
        id: pro.goodsUnitId,
        goodsId: pro.goods.goodsId,
        goodsName: pro.goods.goodsName + ` (${pro.goodsUnitName})`,
        inventory: pro.goods.inventory,
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
    <Form method={method}>
      <Modal open={open} onClose={onClose} button={true} size="w-8/12 h-.5/6">
        <div className="p-2 w-full">
          <div>
            <h1 className="text-lg pb-5 font-bold">{name}</h1>
            <div className="flex w-5/12">
              <div className="w-6/12">
                <button
                  className={`border-0 border-b border-gray-500 w-full ${
                    openInfo ? "border-b-2 border-green-500 ring-0" : ""
                  }`}
                  onClick={handleInfo}
                >
                  Thông tin
                </button>
              </div>
              <div className="w-6/12">
                <button
                  className={`border-0 border-b border-gray-500 w-full ${
                    openNote ? "border-b-2 border-green-500 ring-0" : ""
                  }`}
                  onClick={handleNote}
                >
                  Ghi chú
                </button>
              </div>
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
              onClick={() => handleStatus(5)}
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

export default StocktakeForm;
