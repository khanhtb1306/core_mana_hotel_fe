import { DataGrid } from "@mui/x-data-grid";
import Modal from "../UI/Modal";

function ViewInvoice(props) {
  const invoice = props.invoice;
  console.log(invoice);
  const columns = [
    { field: "name", headerName: "Tên mặt hàng", width: 250 },
    { field: "unit", headerName: "Đơn vị", width: 150 },
    { field: "quantity", headerName: "Số lượng", width: 150 },
    { field: "sum", headerName: "Tổng tiền", width: 250 },
  ];
  let rows = invoice.listOrderDetailByOrder.map((goods) => {
    return {
      id: goods.orderDetail.id,
      name: goods.orderDetail.goods.goodsName,
      unit: goods.orderDetail.goodsUnit.goodsUnitName,
      quantity: goods.orderDetail.quantity,
      sum: goods.orderDetail.price,
    };
  });
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      button={true}
      size="w-7/12 h-.5/6"
    >
      <div className="p-2 w-full">
        <div className="mb-5">
          <h1 className="text-lg pb-5 font-bold">Chi tiết hoá đơn</h1>
        </div>
        <div>
          <div>Mã hoá đơn: {invoice.order.orderId}</div>
          <div>
            Trạng thái:{" "}
            <span
              className={`w-3/12 ${
                invoice.order.status === "UNCONFIRMED" && "text-orange-500"
              } ${invoice.order.status === "CONFIRMED" && "text-blue-500"} ${
                invoice.order.status === "PAID" && "text-green-500"
              } ${invoice.order.status === "CANCEL_ORDER" && "text-gray-500"}`}
            >
              {invoice.order.status === "UNCONFIRMED" && "Chưa xác nhận"}
              {invoice.order.status === "CONFIRMED" && "Xác nhận"}
              {invoice.order.status === "PAID" && "Đã thanh toán"}
              {invoice.order.status === "CANCEL_ORDER" && "Huỷ hoá đơn"}
            </span>
          </div>
          <div>Tổng tiền: {invoice.order.totalPay.toLocaleString()}</div>
        </div>
        <DataGrid
          columns={columns}
          rows={rows}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </div>
    </Modal>
  );
}

export default ViewInvoice;
