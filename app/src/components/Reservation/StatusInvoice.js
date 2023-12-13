import { Form, useLoaderData } from "react-router-dom";
import Modal from "../UI/Modal";
import {
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";

function StatusInvoice(props) {
  const { listQR } = useLoaderData();
  const invoice = props.invoice;
  const [payType, setPayType] = useState(1);
  const [openNewAccBankModal, setOpenNewAccBankModal] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState(
    listQR.length > 0 ? listQR[0].bankAccountId : 0
  );
  const [banks, setBanks] = useState([]);
  useEffect(() => {
    fetch("https://api.vietqr.io/v2/banks")
      .then((response) => response.json())
      .then((data) => {
        setBanks(data.data);
      })
      .catch((error) => console.error(error));
  }, []);
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
