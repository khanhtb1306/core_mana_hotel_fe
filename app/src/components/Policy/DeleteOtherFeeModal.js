import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function DeleteOtherFeeModal(props) {
  const revenue = props.revenue;
//   console.log(revenue);
  return (
    <Form method="delete" onSubmit={() => props.onClose()}>
      <Modal open={props.open} onClose={props.onClose} size="w-5/12 h-.5/6">
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Xoá thu phí khác</h1>
          <input
            type="hidden"
            name="isOtherFee"
            defaultValue={true}
          />
          <input
            type="hidden"
            name="policyDetailId"
            defaultValue={revenue.policyDetailId}
          />
          <div className="ml-auto mr-5 w-full">
            <p>Bạn có chắc chắn muốn xoá thu phí khác?</p>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default DeleteOtherFeeModal;
