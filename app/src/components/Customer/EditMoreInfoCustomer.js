import { Form, useLoaderData } from "react-router-dom";
import Modal from "../UI/Modal";
import ImageInput from "../UI/ImageInput";
import { useState } from "react";
import NewGroupCustomer from "../NewGroupCustomer";
import dayjs from "dayjs";
import Swal from "sweetalert2";

function EditCustomerModal({ open, onClose, customer }) {
  const { customers, customerGroups } = useLoaderData();
  const [nameCus, setNameCus] = useState(
    customer.customerName ? customer.customerName : ""
  );
  const [identity, setIdentity] = useState(
    customer.identity ? customer.identity : ""
  );
  const [dob, setDob] = useState(
    customer.dob
      ? dayjs(customer.dob).format("YYYY-MM-DD")
      : dayjs().add(-1, "year").format("YYYY-MM-DD")
  );
  const [phone, setPhone] = useState(
    customer.phoneNumber ? customer.phoneNumber : ""
  );
  const [email, setEmail] = useState(customer.email ? customer.email : "");

  let check = false;
  if (
    nameCus.trim() === "" ||
    nameCus.length > 255 ||
    identity.trim() === "" ||
    identity.length > 50 ||
    (customers.some((cus) => cus.identity === identity) &&
      customer.identity !== identity) ||
    phone.trim() === "" ||
    phone.length > 50 ||
    (customers.some((cus) => cus.phoneNumber === phone) &&
      customer.phoneNumber !== phone) ||
    email.trim() === "" ||
    email.length > 50 ||
    (customers.some((cus) => cus.email === email) && customer.email !== email)
  ) {
    check = false;
  } else {
    check = true;
  }
  return (
    customer && (
      <Form method="PUT" onSubmit={onClose} encType="multipart/form-data">
        <Modal open={open} onClose={onClose} size="w-8/12 h-.5/6" button={true}>
          <div className="p-2 w-full">
            <div>
              <h1 className="text-lg pb-5 font-bold">
                Chỉnh sửa thông tin khách hàng
              </h1>
              <input
                type="hidden"
                name="editMainCustomer"
                defaultValue={true}
              />
              <input
                type="hidden"
                name="isCustomer"
                defaultValue={customer.isCustomer}
              />
            </div>
            <div className="flex w-full">
              <div className="ml-auto w-3/12 mr-5">
                <ImageInput
                  name="image"
                  src={
                    customer.image
                      ? `data:image/png;base64,${customer.image}`
                      : ""
                  }
                />
              </div>
              <table className="ml-auto w-9/12 mr-5">
                <tbody>
                  <tr>
                    <td className="w-3/12">
                      <h2>Mã khách hàng</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        readOnly
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="customerId"
                        defaultValue={
                          customer.customerId ? customer.customerId : ""
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>
                        <span className="text-red-500">*</span> Tên khách hàng
                      </h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="customerName"
                        value={nameCus}
                        onChange={(e) => setNameCus(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>
                        <span className="text-red-500">*</span> Nhóm khách hàng
                      </h2>
                    </td>
                    <td className="w-9/12">
                      <select
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        name="customerGroupId"
                        defaultValue={
                          customer.customerGroup
                            ? customer.customerGroup.customerGroupId
                            : customerGroups.length > 0
                            ? customerGroups[0].customerGroupId
                            : ""
                        }
                      >
                        {customerGroups.map((group, index) => {
                          return (
                            <option key={index} value={group.customerGroupId}>
                              {group.customerGroupName}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>
                        <span className="text-red-500">*</span> CMND
                      </h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="identity"
                        value={identity}
                        onChange={(e) => setIdentity(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Địa chỉ</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="address"
                        defaultValue={customer.address ? customer.address : ""}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>
                        <span className="text-red-500">*</span> Số điện thoại
                      </h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="number"
                        name="phoneNumber"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>
                        <span className="text-red-500">*</span> Năm sinh
                      </h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="date"
                        name="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>
                        <span className="text-red-500">*</span> Email
                      </h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Quốc tịch</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="nationality"
                        defaultValue={
                          customer.nationality ? customer.nationality : ""
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Mã số thuế</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="taxCode"
                        defaultValue={customer.taxCode ? customer.taxCode : ""}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Giới tính</h2>
                    </td>
                    <td className="w-9/12 flex">
                      {customer.gender === true ? (
                        <div>
                          <input
                            type="radio"
                            id="male"
                            name="gender"
                            className="p-2 mr-2 focus:ring-green-200 text-green-500"
                            defaultChecked={true}
                            defaultValue={true}
                          />
                          <label htmlFor="male">Nam</label>
                          <input
                            type="radio"
                            id="female"
                            name="gender"
                            className="p-2 mr-2 focus:ring-green-200 text-green-500 ml-5"
                            defaultValue={false}
                          />
                          <label htmlFor="female">Nữ</label>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="radio"
                            id="male"
                            name="gender"
                            className="p-2 mr-2 focus:ring-green-200 text-green-500"
                            defaultValue={true}
                          />
                          <label htmlFor="male">Nam</label>
                          <input
                            type="radio"
                            id="female"
                            name="gender"
                            className="p-2 mr-2 focus:ring-green-200 text-green-500 ml-5"
                            defaultChecked={true}
                            defaultValue={false}
                          />
                          <label htmlFor="female">Nữ</label>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex pt-5">
            <div className="ml-auto">
              <button
                type={check ? `` : `button`}
                className="bg-green-500 mr-10 py-2 px-6 text-white rounded hover:bg-green-600"
                onClick={() => {
                  if (!check) {
                    let message = "";
                    if (nameCus.trim() === "") {
                      message = "Không được để trống tên khách hàng";
                    } else if (nameCus.length > 255) {
                      message = "Tên khách hàng không được vượt quá 255 ký tự";
                    } else if (identity.trim() === "") {
                      message = "Không được để trống chứng minh nhân dân";
                    } else if (identity.length > 50) {
                      message =
                        "Chứng minh nhân dân không được vượt quá 50 ký tự";
                    } else if (
                      customers.some((cus) => cus.identity === identity) &&
                      customer.identity !== identity
                    ) {
                      message =
                        "Không được trùng chứng minh nhân dân với người khác";
                    } else if (phone.trim() === "") {
                      message = "Không được để trống số điện thoại";
                    } else if (phone.length > 50) {
                      message = "Số điện thoại không được vượt quá 50 ký tự";
                    } else if (
                      customers.some((cus) => cus.phoneNumber === phone) &&
                      customer.phoneNumber !== phone
                    ) {
                      message = "Không được trùng số điện thoại với người khác";
                    } else if (email.trim() === "") {
                      message = "Không được để trống email";
                    } else if (email.length > 50) {
                      message = "Email không được vượt quá 50 ký tự";
                    } else if (
                      customers.some((cus) => cus.email === email) &&
                      customer.email !== email
                    ) {
                      message = "Không được trùng email với người khác";
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
                  onClose();
                }}
              >
                Bỏ qua
              </button>
            </div>
          </div>
        </Modal>
      </Form>
    )
  );
}

export default EditCustomerModal;
