import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function StatusOtherFeeModal(props) {
  const revenue = props.revenue;
  //   console.log(revenue);
  const status = revenue.status === 1 ? "ngừng thu" : "đang thu";
  return (
    <Form method="put" onSubmit={() => props.onClose()}>
      <Modal open={props.open} onClose={props.onClose} size="w-5/12 h-.5/6">
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Trạng thái thu phí khác</h1>
          <input type="hidden" name="isOtherFee" defaultValue={true} />
          <input type="hidden" name="isStatus" defaultValue={true} />
          <input type="hidden" name="policyId" defaultValue={props.policyId} />
          <input
            type="hidden"
            name="policyDetailId"
            defaultValue={revenue.policyDetailId}
          />
          <input
            type="hidden"
            name="status"
            defaultValue={revenue.status === 1 ? 2 : 1}
          />
          <div className="ml-auto mr-5 w-full">
            <p>
              Bạn có chắc chắn muốn chuyển thành trạng thái{" "}
              <span
                className={
                  revenue.status === 1 ? "text-red-500" : "text-green-500"
                }
              >
                {status}
              </span>{" "}
              của thu phí khác?
            </p>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default StatusOtherFeeModal;
