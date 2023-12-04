import { Form } from "react-router-dom";
import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import { MenuItem, Select } from "@mui/material";

function NewAccBankModal(props) {
  const banks = props.banks;
  const [selectedBank, setSelectedBank] = useState(banks[0].bin);
  return (
    <Form method="POST" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-4/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thêm tài khoản</h1>
            <input type="hidden" name="isAddAccountBank" defaultValue={true} />
            <input
              type="hidden"
              name="bankId"
              value={selectedBank}
              onChange={() => console.log()}
            />
          </div>
          <div>
            <div className="flex">
              <div className="w-4/12 my-auto">Ngân hàng:</div>
              <div className="w-8/12">
                <Select
                  sx={{ width: 300, height: 40 }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        width: 300,
                        maxHeight: 400,
                      },
                    },
                  }}
                  value={selectedBank}
                  onChange={(e) => {
                    setSelectedBank(e.target.value);
                  }}
                >
                  {banks.map((bank, index) => {
                    return (
                      <MenuItem key={index} value={bank.bin}>
                        <img src={bank.logo} className="w-20 h-4" />
                        {bank.shortName + " - " + bank.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className="flex">
              <div className="w-4/12 my-auto">Số tài khoản:</div>
              <div className="w-8/12">
                <input
                  className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                  type="number"
                  name="bankAccountNumber"
                  defaultValue=""
                  onInvalid={(e) => {
                    if (e.target.value === "") {
                      e.target.setCustomValidity(
                        "Không được để trống số tài khoản"
                      );
                    } else {
                      e.target.setCustomValidity("");
                    }
                  }}
                  required
                />
              </div>
            </div>
            <div className="flex">
              <div className="w-4/12 my-auto">Chủ tài khoản:</div>
              <div className="w-8/12">
                <input
                  className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                  type="text"
                  name="bankAccountName"
                  defaultValue=""
                  onInvalid={(e) => {
                    if (e.target.value === "") {
                      e.target.setCustomValidity(
                        "Không được để trống tên tài khoản"
                      );
                    } else {
                      e.target.setCustomValidity("");
                    }
                  }}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default NewAccBankModal;
