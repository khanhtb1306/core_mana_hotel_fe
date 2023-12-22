import { Form, useLoaderData } from "react-router-dom";
import Modal from "./Modal";
import ImageInput from "../UI/ImageInput";
import { useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
function StaffForm({ name, open, onClose, method, staff }) {
  const { staffs, departments } = useLoaderData();
  // console.log(staffs);
  const [username, setUsername] = useState(
    staff.username ? staff.username : ""
  );
  const [staffName, setStaffName] = useState(
    staff.staffName ? staff.staffName : ""
  );
  const [identity, setIdentity] = useState(
    staff.identity ? staff.identity : ""
  );
  const [dob, setDob] = useState(
    staff.dob
      ? dayjs(staff.dob).format("YYYY-MM-DD")
      : dayjs().add(-1, "year").format("YYYY-MM-DD")
  );
  const [address, setAddress] = useState(staff.address ? staff.address : "");
  const [phoneNumber, setPhoneNumber] = useState(
    staff.phoneNumber ? staff.phoneNumber : ""
  );
  const [email, setEmail] = useState(staff.email ? staff.email : "");
  const optionDeparment = departments.map((department) => {
    return (
      <option key={department.departmentId} value={department.departmentId}>
        {department.departmentName}
      </option>
    );
  });

  let check = false;

  if (
    staffName.trim() === "" ||
    staffName.length > 255 ||
    username.trim() === "" ||
    username.length > 255 ||
    (staffs.some((cus) => cus.username === username) &&
      staff.username !== username) ||
    identity.trim() === "" ||
    identity.length > 50 ||
    (staffs.some((cus) => cus.identity === identity) &&
      staff.identity !== identity) ||
    address.trim() === "" ||
    address.length > 255 ||
    phoneNumber.trim() === "" ||
    phoneNumber.length > 255 ||
    (staffs.some((cus) => cus.phoneNumber === phoneNumber) &&
      staff.phoneNumber !== phoneNumber) ||
    email.trim() === "" ||
    email.length > 255 ||
    (staffs.some((cus) => cus.email === email) && staff.email !== email)
  ) {
    check = false;
  } else {
    check = true;
  }

  return (
    <Form method={method} onSubmit={onClose} encType="multipart/form-data">
      <Modal open={open} onClose={onClose} size="w-8/12 h-.5/6" button={true}>
        <div className="p-2 w-full">
          <div>
            <h1 className="text-lg pb-5 font-bold">{name}</h1>
          </div>
          <div className="flex w-full">
            <div className="ml-auto w-3/12 mr-5">
              <ImageInput
                name="image"
                src={
                  staff.image ? `data:image/png;base64,${staff.image}` : null
                }
              />
            </div>
            <table className="ml-auto w-9/12 mr-5">
              <tbody>
                {staff.staffId !== null && (
                  <tr>
                    <td className="w-3/12">
                      <h2>Mã nhân viên</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        readOnly
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="number"
                        name="staffId"
                        defaultValue={staff.staffId ? staff.staffId : ""}
                      />
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="w-3/12">
                    <h2>
                      <span className="text-red-500">*</span> Tên nhân viên
                    </h2>
                  </td>
                  <td className="w-9/12">
                    <input
                      className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                      type="text"
                      name="staffName"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="w-3/12">
                    <h2>
                      <span className="text-red-500">*</span> Tên đăng nhập
                    </h2>
                  </td>
                  <td className="w-9/12">
                    <input
                      className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                      type="text"
                      name="userName"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
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
                    <h2>
                      <span className="text-red-500">*</span> Địa chỉ
                    </h2>
                  </td>
                  <td className="w-9/12">
                    <input
                      className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                      type="text"
                      name="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
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
                      type="text"
                      name="phoneNumber"
                      minLength="1"
                      maxLength="255"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
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
                    <h2>
                      <span className="text-red-500">*</span> Phòng ban
                    </h2>
                  </td>
                  <td className="w-9/12">
                    <select
                      className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                      name="departmentId"
                      defaultValue={
                        staff.department ? staff.department.deparmentId : ""
                      }
                    >
                      {optionDeparment}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="w-3/12">
                    <h2>Giới tính</h2>
                  </td>
                  <td className="w-9/12 flex">
                    {staff.gender === true ? (
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
                  if (staffName.trim() === "") {
                    message = "Không được để trống tên nhân viên";
                  } else if (staffName.length > 255) {
                    message = "Tên nhân viên không được vượt quá 255 ký tự";
                  } else if (username.trim() === "") {
                    message = "Không được để trống tên đăng nhập";
                  } else if (username.length > 255) {
                    message = "Tên đăng nhập không được vượt quá 255 ký tự";
                  } else if (
                    staffs.some((cus) => cus.username === username) &&
                    staff.username !== username
                  ) {
                    message = "Không được trùng tên đăng nhập với người khác";
                  } else if (identity.trim() === "") {
                    message = "Không được để trống chứng minh nhân dân";
                  } else if (identity.length > 50) {
                    message =
                      "Chứng minh nhân dân không được vượt quá 50 ký tự";
                  } else if (
                    staffs.some((cus) => cus.identity === identity) &&
                    staff.identity !== identity
                  ) {
                    message =
                      "Không được trùng chứng minh nhân dân với người khác";
                  } else if (address.trim() === "") {
                    message = "Không được để trống địa chỉ";
                  } else if (address.length > 255) {
                    message = "Địa chỉ không được vượt quá 255 ký tự";
                  } else if (phoneNumber.trim() === "") {
                    message = "Không được để trống số điện thoại";
                  } else if (phoneNumber.length > 255) {
                    message = "Số điện thoại không được vượt quá 255 ký tự";
                  } else if (
                    staffs.some((cus) => cus.phoneNumber === phoneNumber) &&
                    staff.phoneNumber !== phoneNumber
                  ) {
                    message = "Không được trùng số điện thoại với người khác";
                  } else if (email.trim() === "") {
                    message = "Không được để trống email";
                  } else if (email.length > 255) {
                    message = "Email không được vượt quá 255 ký tự";
                  } else if (
                    staffs.some((cus) => cus.email === email) &&
                    staff.email !== email
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
  );
}

export default StaffForm;
