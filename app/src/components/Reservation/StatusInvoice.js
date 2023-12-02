import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function StatusInvoice(props) {
  const invoice = props.invoice;
  return (
    <Form method="PUT" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-7/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">
              Chuyển trạng thái hoá đơn
            </h1>
            <input type="hidden" name="isStatusInvoice" defaultValue={true} />
            <input
              type="hidden"
              name="orderId"
              defaultValue={invoice.order.orderId}
            />
            <input
              type="hidden"
              name="status"
              defaultValue={
                invoice.order.status === "CONFIRMED" ? "PAID" : "CONFIRMED"
              }
            />
          </div>
          <div>
            Từ{" "}
            <span
              className={`w-3/12 ${
                invoice.order.status === "UNCONFIRMED" && "text-orange-500"
              } ${invoice.order.status === "CONFIRMED" && "text-blue-500"}`}
            >
              {invoice.order.status === "UNCONFIRMED" && "Chưa xác nhận"}
              {invoice.order.status === "CONFIRMED" && "Xác nhận"}
            </span>{" "}
            thành{" "}
            <span
              className={`w-3/12 ${
                invoice.order.status === "UNCONFIRMED" && "text-blue-500"
              } ${invoice.order.status === "CONFIRMED" && "text-green-500"} `}
            >
              {invoice.order.status === "UNCONFIRMED" && "Xác nhận"}
              {invoice.order.status === "CONFIRMED" && "Đã trả"}
            </span>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default StatusInvoice;
