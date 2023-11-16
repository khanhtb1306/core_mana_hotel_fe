import Modal from "../UI/Modal";
import { useState } from "react";
import { Form } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";

function OtherFeeModal(props) {
  const revenue = props.revenue;
    // console.log(revenue);
  const [isVND, setIsVND] = useState(
    revenue ? (revenue.typeValue === "VND" ? true : false) : true
  );
  const [isAuto, setIsAuto] = useState(
    revenue ? revenue.autoAddToInvoice : false
  );
  return (
    <Form method={props.method} onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-5/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">{props.name}</h1>
            <input type="hidden" name="isOtherFee" defaultValue={true} />
            <input
              type="hidden"
              name="policyId"
              defaultValue={props.policyId}
            />
            <input
              type="hidden"
              name="policyDetailId"
              defaultValue={revenue ? revenue.policyDetailId : 0}
            />
          </div>
          <div>
            <div className="flex mb-2">
              <div className="w-3/12 my-auto">Loại thu</div>
              <div className="w-9/12">
                <input
                  className="w-full border-0 border-b border-gray-500 w-16 focus:border-b-2 focus:border-green-500 focus:ring-0"
                  type="text"
                  name="type"
                  defaultValue={revenue ? revenue.type : ""}
                  required
                />
              </div>
            </div>
            <div className="flex mb-2">
              <div className="w-3/12 my-auto">Giá trị</div>
              <div className="w-9/12">
                <input type="hidden" name="isVND" value={isVND} />
                <input
                  className="w-8/12 border-0 border-b border-gray-500 w-16 focus:border-b-2 focus:border-green-500 focus:ring-0"
                  type="number"
                  name="typeValue"
                  defaultValue={revenue ? revenue.policyValue : 0}
                  min={0}
                  max={isVND ? 10000000000 : 100}
                />
                <button
                  type="button"
                  className={`py-1 px-2 mx-2 rounded text-white ${
                    isVND ? "bg-green-500" : "bg-gray-400 hover:bg-gray-500"
                  } `}
                  onClick={() => setIsVND(true)}
                >
                  VND
                </button>
                <button
                  type="button"
                  className={`py-1 px-2 rounded text-white ${
                    isVND ? "bg-gray-400 hover:bg-gray-500" : "bg-green-500"
                  } `}
                  onClick={() => setIsVND(false)}
                >
                  %
                </button>
              </div>
            </div>
            <div className="flex">
              <div className="w-3/12"></div>
              <div className="w-9/12">
                <input type="hidden" name="isAuto" value={isAuto} />
                <Checkbox
                  color="success"
                  checked={isAuto}
                  onChange={() => setIsAuto(!isAuto)}
                />
                Tự động đưa vào hoá đơn
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default OtherFeeModal;
