import Modal from "../UI/Modal";
import { Form } from "react-router-dom";

function PointModal(props) {
  const points = props.points;
  const details = points.LIST_SETUP_POINT_SYSTEM_DETAIL;
//   console.log(points);
  return (
    <Form method="put" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-4/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thiết lập tích điểm</h1>
            <input type="hidden" name="isPoint" defaultValue={true} />
            <input
              type="hidden"
              name="policyId"
              defaultValue={points.Policy.policyId}
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
            Điểm thưởng{" "}
            <input
              className="border-0 border-b border-gray-500 w-40 focus:border-b-2 focus:border-green-500 focus:ring-0"
              type="number"
              name="limitValue"
              defaultValue={details[0] ? details[0].limitValue : 1}
              min={1}
            />{" "}
            VND
            {" = "}
            <input
              className="border-0 border-b border-gray-500 w-16 focus:border-b-2 focus:border-green-500 focus:ring-0"
              type="number"
              name="policyValue"
              defaultValue={details[0] ? details[0].policyValue : 1}
              min={1}
            />{" "}
            điểm
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default PointModal;
