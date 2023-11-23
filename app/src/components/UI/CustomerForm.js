import { Form, useLoaderData } from "react-router-dom";
import Modal from "./Modal";
import ImageInput from "../UI/ImageInput";
import { useState } from "react";
import NewGroupCustomer from "../NewGroupCustomer";
import dayjs from "dayjs";

function CustomerForm({ name, open, onClose, method, customer }) {
  const { customerGroups } = useLoaderData();
  // console.log(customerGroups);
  let formattedDate = null;
  const [openNewGroupCusModal, setOpenNewGroupCusModal] = useState(false);
  // console.log(customer);
  if (customer.dob) {
    const dateNow = new Date(customer.dob);
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, "0");
    const day = String(dateNow.getDate()).padStart(2, "0");
    formattedDate = `${year}-${month}-${day}`;
  }
  return (
    customer && (
      <>
        <Form method={method} onSubmit={onClose} encType="multipart/form-data">
          <Modal open={open} onClose={onClose} size="w-8/12 h-.5/6">
            <div className="p-2 w-full">
              <div>
                <h1 className="text-lg pb-5 font-bold">{name}</h1>
                <input
                  type="hidden"
                  name="newMainCustomer"
                  defaultValue={true}
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
                    {method === "put" && (
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
                          defaultValue={
                            customer.customerName ? customer.customerName : ""
                          }
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
                          defaultValue={
                            customer.identity ? customer.identity : ""
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
                          defaultValue={
                            customer.address ? customer.address : ""
                          }
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
                          defaultValue={
                            customer.phoneNumber ? customer.phoneNumber : ""
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
                          defaultValue={
                            customer.dob
                              ? dayjs(customer.dob).format("YYYY-MM-DD")
                              : ""
                          }
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
                          name="email"
                          defaultValue={customer.email ? customer.email : ""}
                          required
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
                          defaultValue={
                            customer.taxCode ? customer.taxCode : ""
                          }
                          required
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
          </Modal>
        </Form>
        {openNewGroupCusModal && (
          <NewGroupCustomer
            open={openNewGroupCusModal}
            onClose={() => setOpenNewGroupCusModal(false)}
          />
        )}
      </>
    )
  );
}

export default CustomerForm;
