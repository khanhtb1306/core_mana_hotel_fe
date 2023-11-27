import Modal from "../UI/Modal";
import { Form } from "react-router-dom";

function PromotionModal(props) {
  const promotion = props.promotion;
  const details = promotion.LIST_PROMOTION_POLICY_DETAIL;
  // console.log(promotion);
  return (
    <Form method="put" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-4/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thiết lập khuyến mãi</h1>
            <input type="hidden" name="isPromotion" defaultValue={true} />
            <input
              type="hidden"
              name="policyId"
              defaultValue={promotion.Policy.policyId}
            />
          </div>
          <div className="ml-5 mb-4">
            {details[0] && (
              <input
                type="hidden"
                name={"policyDetailId"}
                defaultValue={details[0].policyDetailId}
              />
            )}
            Số điểm{" "}
            <input
              className="border-0 border-b border-gray-500 w-16 focus:border-b-2 focus:border-green-500 focus:ring-0"
              type="number"
              name="limitValue"
              defaultValue={details[0] ? details[0].limitValue : 1}
              min={1}
            />{" "}
            thành tiền{" "}
            <input
              className="border-0 border-b border-gray-500 w-28 focus:border-b-2 focus:border-green-500 focus:ring-0"
              type="number"
              name="policyValue"
              defaultValue={details[0] ? details[0].policyValue : 1}
              min={1}
            />{" "}
            VND
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default PromotionModal;
