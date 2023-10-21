import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import { axiosConfig } from "../../utils/axiosConfig";

function DetailsProduct(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openWarehouse, setOpenWarehouse] = useState(false);
  const [openSameGood, setOpenSameGood] = useState(false);

  const product = props.product;
  let isManyUnit = false;
  if (product.listGoodsUnit.length > 1) {
    isManyUnit = true;
  }

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenWarehouse(false);
    setOpenSameGood(false);
  };

  const handleWarehouse = () => {
    setOpenInfo(false);
    setOpenWarehouse(true);
    setOpenSameGood(false);
  };

  const handleSameGood = () => {
    setOpenInfo(false);
    setOpenWarehouse(false);
    setOpenSameGood(true);
  };

  const columnsWarehouse = [
    { field: "code", headerName: "Chứng từ", width: 150 },
    { field: "method", headerName: "Phương thức", width: 150 },
    { field: "time", headerName: "Thời gian", width: 150 },
    { field: "capitalPrice", headerName: "Giá vốn", width: 150 },
    { field: "amount", headerName: "Số lượng", width: 150 },
    { field: "inventory", headerName: "Tồn cuối", width: 150 },
  ];

  const rowsWarehouse = [
    {
      id: 1,
      code: "HD000001",
      method: "Bán hàng",
      time: "26/09/2023",
      capitalPrice: "20,000",
      amount: "-100",
      inventory: "900",
    },
  ];

  const columnsGoods = [
    { field: "code", headerName: "Mã đơn vị", width: 100 },
    { field: "name", headerName: "Tên hàng hoá", width: 200 },
    { field: "cost", headerName: "Giá vốn", width: 150 },
    { field: "price", headerName: "Giá bán", width: 150 },
    { field: "inventory", headerName: "Tồn kho", width: 150 },
  ];

  const defaultVal = product.listGoodsUnit.find((unit) => unit.isDefault);
  const defaultCost = defaultVal.cost;
  const name = product.goods.goodsName + " (" + defaultVal.goodsUnitName + ")";

  const rowsGoods = product.listGoodsUnit.map((unit) => {
    const name = product.goods.goodsName + " (" + unit.goodsUnitName + ")";
    let inventory = product.goods.inventory;
    if (!unit.isDefault) {
      inventory = (product.goods.inventory * defaultCost) / unit.cost;
    }
    return {
      id: unit.goodsUnitId,
      code: unit.goodsUnitId,
      name: name,
      cost: unit.cost,
      price: unit.price,
      inventory: inventory,
    };
  });

  return (
    product && (
      <Modal
        open={props.open}
        onClose={props.onClose}
        reset={props.onClose}
        button={true}
        size="w-8/12 h-4/6"
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thông tin hàng hoá</h1>
            <div className="flex w-6/12">
              <div className="w-4/12">
                <button
                  className={`border-0 border-b border-gray-500 w-full ${
                    openInfo ? "border-b-2 border-green-500 ring-0" : ""
                  }`}
                  onClick={handleInfo}
                >
                  Thông tin
                </button>
              </div>
              <div className="w-4/12">
                <button
                  className={`border-0 border-b border-gray-500 w-full ${
                    openWarehouse ? "border-b-2 border-green-500 ring-0" : ""
                  }`}
                  onClick={handleWarehouse}
                >
                  Thẻ kho
                </button>
              </div>
              {isManyUnit && (
                <div className="w-4/12">
                  <button
                    className={`border-0 border-b border-gray-500 w-full ${
                      openSameGood ? "border-b-2 border-green-500 ring-0" : ""
                    }`}
                    onClick={handleSameGood}
                  >
                    Hàng hoá cùng loại
                  </button>
                </div>
              )}
            </div>
          </div>
          {openInfo && (
            <div className="flex">
              <div className="w-4/12">
                <h2 className="text-lg pb-5 font-bold">
                  {name ? name : ""}
                </h2>
                <ImageDisplay
                  image1={
                    product.goods.image
                      ? `data:image/png;base64,${product.goods.image}`
                      : null
                  }
                  image2={
                    product.goods.image
                      ? `data:image/png;base64,${product.goods.image}`
                      : null
                  }
                  image3={
                    product.goods.image
                      ? `data:image/png;base64,${product.goods.image}`
                      : null
                  }
                />
              </div>
              <div className="w-8/12 mx-5">
                <table className="m-4 w-full">
                  <tbody>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Mã hàng hoá:</td>
                      <td className="w-7/12 pt-2">
                        {product.goods.goodsId ? product.goods.goodsId : ""}
                      </td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Loại hàng:</td>
                      <td className="w-7/12 pt-2">Hàng hoá</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Định mức tồn:</td>
                      <td className="w-7/12 pt-2">
                        {product.goods.minInventory
                          ? product.goods.minInventory
                          : ""}{" "}
                        {"  >  "}{" "}
                        {product.goods.maxInventory
                          ? product.goods.maxInventory
                          : ""}
                      </td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Giá bán:</td>
                      <td className="w-7/12 pt-2">
                        {product.listGoodsUnit[0].price
                          ? product.listGoodsUnit[0].price
                          : 0}
                      </td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Giá vốn:</td>
                      <td className="w-7/12 pt-2">
                        {product.listGoodsUnit[0].cost
                          ? product.listGoodsUnit[0].cost
                          : 0}
                      </td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Mô tả chi tiết</td>
                      <td className="w-7/12 pt-2">
                        {product.goods.description
                          ? product.goods.description
                          : ""}
                      </td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Ghi chú</td>
                      <td className="w-7/12 pt-2">
                        {product.goods.note ? product.goods.note : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {openWarehouse && (
            <DataGrid
              columns={columnsWarehouse}
              rows={rowsWarehouse}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          )}
          {openSameGood && (
            <DataGrid
              columns={columnsGoods}
              rows={rowsGoods}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          )}
        </div>
      </Modal>
    )
  );
}

export default DetailsProduct;
