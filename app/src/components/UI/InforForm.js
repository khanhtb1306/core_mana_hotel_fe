import { Form } from "react-router-dom";
import { useState } from "react";
import ImageInput from "../UI/ImageInput";
function InforForm({ staff, method }) {
  let formattedDate = null;
  if (staff.dob) {
    const dateNow = new Date(staff.dob);
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, "0");
    const day = String(dateNow.getDate()).padStart(2, "0");
    formattedDate = `${year}-${month}-${day}`;
  }
  return (
    <Form
      method="post"
      className="bg-white flex flex-row "
      encType="multipart/form-data"
    >
      <div className="basis-1/4">
        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
          <ImageInput
            name="image"
            src={staff.image ? `data:image/png;base64,${staff.image}` : null}
          />
        </div>
      </div>
      <div className="col-span-2 basis-3/4">
        <div className="col-md-12 ">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-left text-lg font-bold">
                {" "}
                <i className="bi bi-person-circle me-3"></i>Thông tin cá nhân
              </h4>
            </div>
            <input
              readOnly
              hidden
              type="text"
              name="role"
              defaultValue={staff.role ? staff.role : ""}
            />
            <div className="flex flex-row mb-3 ">
              <div className="basis-1/2 flex flex-row  ">
                <div className="w-3/12 basis-1/4">
                  <h2 className="mt-3">Mã nhân viên</h2>
                </div>
                <div className="w-9/12  basis-3/4">
                  <input
                    readOnly
                    className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="number"
                    name="staffId"
                    defaultValue={staff.staffId ? staff.staffId : ""}
                  />
                </div>
              </div>
              <div className="basis-1/2 flex flex-row  ">
                <div className="w-3/12 basis-1/4">
                  <h2 className="mt-3">Tên nhân viên</h2>
                </div>
                <div className="w-9/12  basis-3/4">
                  <input
                    className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="staffName"
                    minLength="1"
                    maxLength="255"
                    defaultValue={staff.staffName ? staff.staffName : ""}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row mb-3 ">
              <div className="basis-1/2 flex flex-row  ">
                <div className="w-3/12 basis-1/4">
                  <h2 className="mt-3">Tên đăng nhập</h2>
                </div>
                <div className="w-9/12  basis-3/4">
                  <input
                    className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    minLength="1"
                    maxLength="255"
                    name="userName"
                    defaultValue={staff.username ? staff.username : ""}
                    required
                  />
                </div>
              </div>
              <div className="basis-1/2 flex flex-row  ">
                <div className="w-3/12 basis-1/4">
                  <h2 className="mt-3">Giới tính</h2>
                </div>
                <div className="w-9/12 basis-3/4 flex">
                  {staff.gender === true ? (
                    <div className="mt-3">
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
                    <div className="mt-3">
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
                </div>
              </div>
            </div>
            <div className="flex flex-row mb-3 ">
              <div className="basis-1/2 flex flex-row  ">
                <div className="w-3/12 basis-1/4">
                  <h2 className="mt-3">Địa chỉ</h2>
                </div>
                <div className="w-9/12  basis-3/4">
                  <input
                    className="w-9/12 border-0 border-b border-gray-500 focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="address"
                    minLength="1"
                    maxLength="255"
                    defaultValue={staff.address ? staff.address : ""}
                    required
                  />
                </div>
              </div>
              <div className="basis-1/2 flex flex-row  ">
                <div className="w-3/12 basis-1/4">
                  <h2 className="mt-3">Số điện thoại</h2>
                </div>
                <div className="w-9/12  basis-3/4">
                  <input
                    className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="phoneNumber"
                    minLength="1"
                    maxLength="255"
                    defaultValue={staff.phoneNumber ? staff.phoneNumber : ""}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row mb-3 ">
              <div className="basis-1/2 flex flex-row  ">
                <div className="w-3/12 basis-1/4">
                  <h2 className="mt-3">Năm sinh</h2>
                </div>
                <div className="w-9/12  basis-3/4">
                  <input
                    className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="date"
                    name="dob"
                    defaultValue={formattedDate ? formattedDate : ""}
                    required
                  />
                </div>
              </div>
              <div className="basis-1/2 flex flex-row  ">
                <div className="w-3/12 basis-1/4">
                  <h2 className="mt-3">Email</h2>
                </div>
                <div className="w-9/12  basis-3/4">
                  <input
                    className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="email"
                    name="email"
                    defaultValue={staff.email ? staff.email : ""}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row mb-3 ">
              <div className="w-3/12 basis-1/4">
                <h2 className="mt-3">Chứng minh nhân dân</h2>
              </div>
              <div className="w-9/12  basis-3/4">
                <input
                  className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                  type="text"
                  name="identity"
                  minLength="1"
                  maxLength="255"
                  defaultValue={staff.identity ? staff.identity : ""}
                  required
                />
              </div>
            </div>

            <div className="mt-5 text-center">
              <button
                className="btn btn-primary bg-green-500 hover:bg-green-700 text-white py-2 px-4"
                type="submit"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}

export default InforForm;
