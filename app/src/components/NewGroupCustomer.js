import { useState } from "react";
import Modal from "./UI/Modal";
import { Form, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

function NewGroupCustomer(props) {
  const { customerGroups } = useLoaderData();
  const [name, setName] = useState("");
  let check = false;
  if (
    name.trim() === "" ||
    customerGroups.some(
      (group) => group.customerGroupName.trim() === name.trim()
    )
  ) {
    check = false;
  } else {
    check = true;
  }
  return (
    <Form method="post" onSubmit={props.onClose} encType="multipart/form-data">
      <Modal
        open={props.open}
        onClose={props.onClose}
        size="w-5/12 h-.5/6"
        button={true}
      >
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Thêm nhóm khách hàng mới</h1>
          <input type="hidden" name="isAddGroup" value={true} />
          <table className="ml-auto mr-5 w-full">
            <tbody>
              <tr>
                <td className="w-3/12">
                  <h2><span className="text-red-500">*</span> Tên nhóm khách</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="groupCusName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex pt-5">
          <div className="ml-auto">
            <button
              type={check ? `` : `button`}
              className="bg-green-500 mr-10 py-2 px-6 text-white rounded hover:bg-green-600"
              onClick={() => {
                if (!check) {
                  let message = "";
                  if (name.trim() === "") {
                    message = "Không được để trống tên nhóm khách hàng";
                  } else if (
                    customerGroups.some(
                      (group) => group.customerGroupName.trim() === name.trim()
                    )
                  ) {
                    message = "Không được trùng với tên nhóm khách hàng khác";
                  }
                  Swal.fire({
                    position: "bottom",
                    html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">${message}</button>`,
                    showConfirmButton: false,
                    background: "transparent",
                    backdrop: "none",
                    timer: 2000,
                  });
                }
              }}
            >
              Lưu
            </button>
            <button
              type="button"
              className="bg-gray-400 py-2 px-6 text-white rounded hover:bg-gray-500"
              onClick={() => {
                props.onClose();
              }}
            >
              Bỏ qua
            </button>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default NewGroupCustomer;
