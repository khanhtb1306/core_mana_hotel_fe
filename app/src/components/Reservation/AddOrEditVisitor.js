import { Form, useLoaderData } from "react-router-dom";
import Modal from "../UI/Modal";
import ImageInput from "../UI/ImageInput";
import { useState } from "react";
import dayjs from "dayjs";
import Swal from "sweetalert2";

function AddOrEditVisitor(props) {
  const { customers, customerGroups } = useLoaderData();
  const canAddAdult = props.canAddAdult;
  const canAddChildren = props.canAddChildren;
  const visitor = props.visitor;
  const reservationDetail = props.reservationDetail;
  const activeCustomers = customers.filter((cus) => cus.status === "ACTIVE");
  console.log(activeCustomers);
  const [nameVisitor, setNameVisitor] = useState(
    visitor ? visitor.customerName : ""
  );
  const [identity, setIdentity] = useState(visitor ? visitor.identity : "");
  const [phoneNumber, setPhoneNumber] = useState(
    visitor ? visitor.phoneNumber : ""
  );
  const [dob, setDob] = useState(
    visitor ? dayjs(visitor.dob).format("YYYY-MM-DD") : dayjs()
  );
  let age = dayjs().diff(dob, "year");
  // console.log(age);

  return (
    <>
      <Form
        method={props.method}
        onSubmit={props.onClose}
        encType="multipart/form-data"
      >
        <Modal
          open={props.open}
          onClose={props.onClose}
          button={true}
          size="w-8/12 h-.5/6"
        >
          <div className="p-2 w-full">
            <div>
              <h1 className="text-lg pb-5 font-bold">{props.name}</h1>
              <input type="hidden" name="isVisitor" defaultValue={true} />
              <input
                type="hidden"
                name="isAdult"
                value={age < 16 ? false : true}
                onChange={() => console.log()}
              />
              {visitor && (
                <input
                  type="hidden"
                  name="isChange"
                  value={
                    dayjs().diff(dayjs(visitor.dob), "year") >= 16 && age < 16
                      ? true
                      : dayjs().diff(dayjs(visitor.dob), "year") < 16 &&
                        age >= 16
                      ? false
                      : null
                  }
                  onChange={() => console.log()}
                />
              )}

              <input
                type="hidden"
                name="reservationDetailId"
                defaultValue={reservationDetail.reservationDetailId}
              />
            </div>
            <div className="flex w-full">
              <div className="ml-auto w-3/12 mr-5">
                <ImageInput
                  name="image"
                  src={
                    visitor
                      ? visitor.image
                        ? `data:image/png;base64,${visitor.image}`
                        : null
                      : null
                  }
                />
              </div>
              <table className="ml-auto w-9/12 mr-5">
                <tbody>
                  {props.method === "PUT" && (
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
                          defaultValue={visitor ? visitor.customerId : ""}
                        />
                      </td>
                    </tr>
                  )}
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
                        value={nameVisitor}
                        onChange={(e) => setNameVisitor(e.target.value)}
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
                          visitor
                            ? visitor.customerGroup.customerGroupId
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
                      <h2>Chứng minh nhân dân</h2>
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
                        defaultValue={visitor ? visitor.address : ""}
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
                        className="border-0 border-b border-gray-500 w-10/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="date"
                        name="dob"
                        value={dob}
                        onChange={(e) => {
                          setDob(e.target.value);
                        }}
                        required
                      />
                      <span className="w-2/12 ml-4">
                        {age ? age + " tuổi" : ""}
                      </span>
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
                        name="email"
                        defaultValue={visitor ? visitor.email : ""}
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
                        defaultValue={visitor ? visitor.nationality : ""}
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
                        defaultValue={visitor ? visitor.taxCode : ""}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Giới tính</h2>
                    </td>
                    <td className="w-9/12 flex">
                      {visitor && visitor.gender === true ? (
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
                type={
                  (((canAddAdult ||
                    (visitor &&
                      dayjs().diff(dayjs(visitor.dob), "year") >= 16)) &&
                    age >= 16 &&
                    age < 100) ||
                    ((canAddChildren ||
                      (visitor &&
                        dayjs().diff(dayjs(visitor.dob), "year") < 16)) &&
                      age < 16 &&
                      age > 0)) &&
                  !(
                    nameVisitor === "" ||
                    (identity !== "" &&
                      activeCustomers.some(
                        (cus) => cus.identity === identity
                      ) &&
                      identity !== visitor.identity) ||
                    (phoneNumber !== "" &&
                      activeCustomers.some(
                        (cus) => cus.phoneNumber === phoneNumber
                      ) &&
                      phoneNumber !== visitor.phoneNumber)
                  )
                    ? ""
                    : "button"
                }
                className="bg-green-500 mr-2 py-2 px-6 text-white rounded hover:bg-green-600"
                onClick={() => {
                  if (
                    (((canAddAdult ||
                      (visitor &&
                        dayjs().diff(dayjs(visitor.dob), "year") >= 16)) &&
                      age >= 16 &&
                      age < 100) ||
                      ((canAddChildren ||
                        (visitor &&
                          dayjs().diff(dayjs(visitor.dob), "year") < 16)) &&
                        age < 16 &&
                        age > 0)) &&
                    !(
                      nameVisitor === "" ||
                      (identity !== "" &&
                        activeCustomers.some(
                          (cus) => cus.identity === identity
                        ) &&
                        identity !== visitor.identity) ||
                      (phoneNumber !== "" &&
                        activeCustomers.some(
                          (cus) => cus.phoneNumber === phoneNumber
                        ) &&
                        phoneNumber !== visitor.phoneNumber)
                    )
                  ) {
                  } else {
                    let mes = "";
                    if (nameVisitor === "") {
                      mes = "Không được để trống tên khách lưu trú";
                    } else if (
                      identity !== "" &&
                      activeCustomers.some(
                        (cus) => cus.identity === identity
                      ) &&
                      identity !== visitor.identity
                    ) {
                      mes =
                        "Không được trùng chứng mình nhân dân với khách khác";
                    } else if (
                      phoneNumber !== "" &&
                      activeCustomers.some(
                        (cus) => cus.phoneNumber === phoneNumber
                      ) &&
                      phoneNumber !== visitor.phoneNumber
                    ) {
                      mes = "Không được trùng số điện thoại với khách khác";
                    } else if (
                      !(
                        canAddAdult ||
                        (visitor &&
                          dayjs().diff(dayjs(visitor.dob), "year") >= 16)
                      )
                    ) {
                      mes = "Người lớn trong phòng đã đạt tối đa!";
                    } else if (
                      !(
                        canAddChildren ||
                        (visitor &&
                          dayjs().diff(dayjs(visitor.dob), "year") < 16)
                      )
                    ) {
                      mes = "Trẻ em trong phòng đã đạt tối đa!";
                    } else if (age >= 100 || age <= 0) {
                      mes = "Xin hãy nhập đúng tuổi!";
                    }
                    Swal.fire({
                      position: "bottom",
                      html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">${mes}</button>`,
                      showConfirmButton: false,
                      background: "transparent",
                      backdrop: "none",
                      timer: 2500,
                    });
                  }
                }}
              >
                Xong
              </button>
              <button
                type="button"
                className="bg-gray-400 py-2 px-6 text-white rounded hover:bg-gray-500"
                onClick={() => props.onClose()}
              >
                Bỏ qua
              </button>
            </div>
          </div>
        </Modal>
      </Form>
    </>
  );
}

export default AddOrEditVisitor;
