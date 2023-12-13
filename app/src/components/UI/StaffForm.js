import { Form } from "react-router-dom";
import Modal from "./Modal";
import ImageInput from "../UI/ImageInput";
import { useState } from "react";
import DepartmentForm from "../UI/DepartmentForm";
function StaffForm({ name, open, onClose, method, staff, departments }) {
  const [openNewDeparmentModal, setOpenNewDepartmentModal] = useState(false);
  const optionDeparment = departments.map((department) => {
    return (
        <option key={department.departmentId} value={department.departmentId}>
          {department.departmentName}
        </option>
    );
  });

  let formattedDate = null;
  if (staff.dob) {
    const dateNow = new Date(staff.dob);
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, "0");
    const day = String(dateNow.getDate()).padStart(2, "0");
    formattedDate = `${year}-${month}-${day}`;
  }
  return (
        <Form method={method} onSubmit={onClose} encType="multipart/form-data">
          <Modal open={open} onClose={onClose} size="w-8/12 h-.5/6">
            <div className="p-2 w-full">
              <div>
                <h1 className="text-lg pb-5 font-bold">{name}</h1>
              </div>
              <div className="flex w-full">
                <div className="ml-auto w-3/12 mr-5">
                  <ImageInput
                      name="image"
                      src={
                        staff.image
                            ? `data:image/png;base64,${staff.image}`
                            : null
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
                              defaultValue={
                                staff.staffId ? staff.staffId : ""
                              }
                          />
                        </td>
                      </tr>
                  )}
                  <tr>
                    <td className="w-3/12">
                      <h2>Tên nhân viên</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="text"
                          name="staffName"
                          minLength="1"
                          maxLength="255"
                          defaultValue={
                            staff.staffName ? staff.staffName : ""
                          }
                          required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Tên đăng nhập</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="text"
                          minLength="1"
                          maxLength="255"
                          name="userName"
                          defaultValue={
                            staff.username ? staff.username : ""
                          }

                      />
                    </td>
                  </tr>


                  <tr>
                    <td className="w-3/12">
                      <h2>Chứng minh nhân dân</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="text"
                          name="identity"
                          minLength="1"
                          maxLength="255"
                          defaultValue={
                            staff.identity ? staff.identity : ""
                          }
                          required
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
                          minLength="1"
                          maxLength="255"
                          defaultValue={staff.address ? staff.address : ""}
                          required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Số điện thoại</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="text"
                          name="phoneNumber"
                          minLength="1"
                          maxLength="255"
                          defaultValue={
                            staff.phoneNumber ? staff.phoneNumber : ""
                          }
                          required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Năm sinh</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="date"
                          name="dob"
                          defaultValue={formattedDate ? formattedDate : ""}
                          required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Email</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="text"
                          minLength="1"
                          maxLength="255"
                          pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                          name="email"
                          defaultValue={staff.email ? staff.email : ""}
                          required
                      />
                    </td>
                  </tr>
                 
                  <tr>
                    <td className="w-3/12">
                      <h2>Phòng ban</h2>
                    </td>
                    <td className="w-9/12">
                      <select
                          className="border-0 border-b border-gray-500 w-11/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          name="departmentId"
                          defaultValue={staff.department ? staff.department.deparmentId : ""}
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
          </Modal>
        </Form>
      
  );
}

export default StaffForm;