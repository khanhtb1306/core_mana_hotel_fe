import { DataGrid } from "@mui/x-data-grid";
import Modal from "../UI/Modal";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";

function DetailsStocktake(props) {
  const stocktake = props.stocktake;
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
    actualInventory: 0,
    actualPriceInventory: 0,
    incDif: 0,
    incPriceDif: 0,
    decDif: 0,
    decPriceDif: 0,
  };

  stocktake.listInventoryCheckDetails.map((inven) => {
    balance.actualInventory += inven.actualInventory;
    balance.actualPriceInventory += Math.abs(
      inven.actualInventory * inven.valueDiscrepancy
    );
    if (inven.quantityDiscrepancy > 0) {
      balance.incDif += inven.quantityDiscrepancy;
      balance.incPriceDif += inven.quantityDiscrepancy * inven.valueDiscrepancy;
    } else if (inven.quantityDiscrepancy < 0) {
      balance.decDif += inven.quantityDiscrepancy;
      balance.decPriceDif -= inven.quantityDiscrepancy * inven.valueDiscrepancy;
    }
  });
  console.log(props.stocktake);

  const columnsReser = [
    { field: "goodsId", headerName: "Mã hàng hoá", width: 150 },
    { field: "goodsName", headerName: "Tên hàng", width: 150 },
    { field: "inventory", headerName: "Tồn kho", width: 150 },
    { field: "actualInventory", headerName: "Thực tế", width: 150 },
    { field: "quantityDiscrepancy", headerName: "SL lệch", width: 150 },
    { field: "valueDiscrepancy", headerName: "Giá trị lệch", width: 150 },
  ];

  const rowsReser = stocktake.listInventoryCheckDetails.map((inven) => {
    return {
      id: inven.inventoryCheckDetailId,
      goodsId: inven.goods.goodsId,
      goodsName: inven.goods.goodsName,
      inventory: inven.inventory,
      actualInventory: inven.actualInventory,
      quantityDiscrepancy: inven.quantityDiscrepancy,
      valueDiscrepancy: inven.valueDiscrepancy,
    };
  });

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      button={true}
      size="w-8/12 h-.5/6"
    >
      <div className="p-2 w-full">
        <div className="mb-2">
          <h1 className="text-lg pb-5 font-bold">Thông tin phiếu kiểm kho</h1>
        </div>
        <div className="flex">
          <div className="w-6/12 mx-5">
            <table className="m-4 w-full">
              <tbody>
                <tr className="border-0 border-b">
                  <td className="w-5/12 pt-2">Mã kiểm kho:</td>
                  <td className="w-7/12 pt-2">
                    {stocktake.inventoryCheck.inventoryCheckId}
                  </td>
                </tr>
                <tr className="border-0 border-b">
                  <td className="w-5/12 pt-2">Trạng thái:</td>
                  <td className="w-7/12 pt-2">{status}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-6/12 mx-5">
            <table className="m-4 w-full">
              <tbody>
                <tr className="border-0 border-b">
                  <td className="w-5/12 pt-2">Thời gian:</td>
                  <td className="w-7/12 pt-2">{timeCreate}</td>
                </tr>
                <tr className="border-0 border-b">
                  <td className="w-5/12 pt-2">Ngày cân bằng:</td>
                  <td className="w-7/12 pt-2">{timeBalance}</td>
                </tr>
                <tr className="border-0 border-b">
                  <td className="w-5/12 pt-2">Ghi chú:</td>
                  <td className="w-7/12 pt-2">
                    {stocktake.inventoryCheck.note}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <DataGrid
            columns={columnsReser}
            rows={rowsReser}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </div>
        <div className="flex mr-4">
          <div className="w-6/12 ml-auto text-right">
            <table className="m-4 w-full">
              <tbody>
                <tr className="border-0 border-b">
                  <td className="w-5/12 pt-2">
                    Tổng thực tế ({balance.actualInventory.toLocaleString()}):
                  </td>
                  <td className="w-7/12 pt-2">
                    {balance.actualPriceInventory.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-0 border-b">
                  <td className="w-5/12 pt-2">
                    Tổng lệch tăng ({balance.incDif}):
                  </td>
                  <td className="w-7/12 pt-2">
                    {balance.incPriceDif.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-0 border-b">
                  <td className="w-5/12 pt-2">
                    Tổng lệch giảm ({balance.decDif}):
                  </td>
                  <td className="w-7/12 pt-2">
                    {balance.decPriceDif.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-0 border-b">
                  <td className="w-5/12 pt-2">
                    Tổng chênh lệch ({balance.incDif + balance.decDif}):
                  </td>
                  <td className="w-7/12 pt-2">
                    {(
                      balance.incPriceDif + balance.decPriceDif
                    ).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default DetailsStocktake;
