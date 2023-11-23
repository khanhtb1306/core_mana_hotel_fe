import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function CancelInvoice(props) {
  const invoice = props.invoice;
  return (
    <Form method="PUT" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-7/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Huỷ hoá đơn</h1>
            <input type="hidden" name="isCancelInvoice" defaultValue={true} />
            <input
              type="hidden"
              name="orderId"
              defaultValue={invoice.order.orderId}
            />
            <input type="hidden" name="status" defaultValue="CANCEL_ORDER" />
          </div>
          <div>Bạn chắc chắn muốn huỷ hoá đơn?</div>
        </div>
      </Modal>
    </Form>
  );
}

export default CancelInvoice;
