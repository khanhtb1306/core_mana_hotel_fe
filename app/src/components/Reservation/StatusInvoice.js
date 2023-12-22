import { Form, useLoaderData } from "react-router-dom";
import Modal from "../UI/Modal";
import {
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { useState } from "react";

function StatusInvoice(props) {
  const invoice = props.invoice;
  // console.log(invoice);
  const [payType, setPayType] = useState("2");
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
            {invoice.order.status === "CONFIRMED" && (
              <>
                <input
                  type="hidden"
                  name="paidMethod"
                  defaultValue={payType === "2" ? "TRANSFER" : "CASH"}
                />
                <input
                  type="hidden"
                  name="transactionCode"
                  defaultValue={props.transactionCode}
                />
              </>
            )}
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
              {invoice.order.status === "CONFIRMED" && "Đã thanh toán"}
            </span>
          </div>
          {invoice.order.status === "CONFIRMED" && (
            <div>
              <div className="flex">
                <RadioGroup
                  value={payType}
                  onChange={(e) => {
                    setPayType(e.target.value);
                  }}
                  name="radio-buttons-group"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Tiền mặt"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio />}
                    label="Chuyển khoản"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                </RadioGroup>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </Form>
  );
}

export default StatusInvoice;
