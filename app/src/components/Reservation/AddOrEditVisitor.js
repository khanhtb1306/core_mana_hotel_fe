import { Form, useLoaderData } from "react-router-dom";
import Modal from "../UI/Modal";
import ImageInput from "../UI/ImageInput";
import { useState } from "react";
import NewGroupCustomer from "../NewGroupCustomer";
import dayjs from "dayjs";

function AddOrEditVisitor(props) {
  const { customerGroups } = useLoaderData();
  const visitor = props.visitor;
  const reservationDetail = props.reservationDetail;
  console.log(visitor);
  const [dob, setDob] = useState(
    visitor ? dayjs(visitor.dob).format("YYYY-MM-DD") : null
  );
  const [age, setAge] = useState(
    visitor ? dayjs().diff(dayjs(visitor.dob), "year") : null
  );
  const [openNewGroupCusModal, setOpenNewGroupCusModal] = useState(false);
  return (
    <>
      <Form
        method={props.method}
        onSubmit={props.onClose}
        encType="multipart/form-data"
      >
        <Modal open={props.open} onClose={props.onClose} size="w-8/12 h-.5/6">
          <div className="p-2 w-full">
            <div>
              <h1 className="text-lg pb-5 font-bold">{props.name}</h1>
              <input type="hidden" name="isVisitor" defaultValue={true} />
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
                        : ""
                      : ""
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
                      <h2>Tên khách hàng</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="customerName"
                        defaultValue={visitor ? visitor.customerName : ""}
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Nhóm khách hàng</h2>
                    </td>
                    <td className="w-9/12">
                      <select
                        className="border-0 border-b border-gray-500 w-11/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
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
                      <button
                        type="button"
                        className="w-1/12 text-2xl text-gray-500"
                        onClick={() => setOpenNewGroupCusModal(true)}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
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
                        defaultValue={visitor ? visitor.identity : ""}
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
                        defaultValue={visitor ? visitor.phoneNumber : ""}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Năm sinh</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-10/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="date"
                        name="dob"
                        value={dob}
                        onChange={(e) => {
                          setAge(dayjs().diff(dayjs(e.target.value), "year"));
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
        </Modal>
      </Form>
      {openNewGroupCusModal && (
        <NewGroupCustomer
          open={openNewGroupCusModal}
          onClose={() => setOpenNewGroupCusModal(false)}
        />
      )}
    </>
  );
}

export default AddOrEditVisitor;
