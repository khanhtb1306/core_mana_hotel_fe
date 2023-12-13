import Modal from "../UI/Modal";
import { Form } from "react-router-dom";

function DepositModal(props) {
  const deposits = props.deposits;
  const listDeposit = deposits.LIST_SETUP_DEPOSIT_DETAIL;
  console.log(deposits);
  return (
    <Form method="put" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-6/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thiết lập tiền cọc</h1>
            <input type="hidden" name="isDeposit" defaultValue={true} />
            <input
              type="hidden"
              name="policyId"
              defaultValue={deposits.Policy.policyId}
            />
          </div>
          <div>
            {listDeposit.length > 0 && (
              <input
                type="hidden"
                name="policyDetailId"
                defaultValue={
                  listDeposit.length > 0 ? listDeposit[0].policyDetailId : 0
                }
              />
            )}
            Cọc tối thiểu{" "}
            <input
              className="border-0 border-b border-gray-500 w-16 focus:border-b-2 focus:border-green-500 focus:ring-0"
              type="number"
              name={`policyValue`}
              defaultValue={
                listDeposit.length > 0 ? listDeposit[0].policyValue : 0
              }
              min={0}
              max={100}
            />
            % / tổng hoá đơn
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default DepositModal;
