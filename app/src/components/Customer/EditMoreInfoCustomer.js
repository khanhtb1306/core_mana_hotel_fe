import { Form, useLoaderData } from "react-router-dom";
import Modal from "../UI/Modal";
import ImageInput from "../UI/ImageInput";
import { useState } from "react";
import NewGroupCustomer from "../NewGroupCustomer";
import dayjs from "dayjs";

function EditCustomerModal(props) {
  const { customerGroups } = useLoaderData();
  const customer = props.customer;
  //   console.log(customer);
  const [openNewGroupCusModal, setOpenNewGroupCusModal] = useState(false);
  const [openEditInfo, setOpenEditInfo] = useState(true);
  const [openHistoryReservation, setOpenHistoryReservation] = useState(false);
  const [openInvoices, setOpenInvoices] = useState(false);
  return (
    <>
      <Form method="PUT" onSubmit={props.onClose} encType="multipart/form-data">
        <Modal
          open={props.open}
          onClose={props.onClose}
          button={!openEditInfo}
          size="w-8/12 h-.5/6"
        >
          <div className="p-2 w-full">
            <div className="mb-4">
              <h1 className="text-lg pb-5 font-bold">
                Thông tin khách hàng {" " + customer.customerName}{" "}
                <input
                  type="hidden"
                  name="editMainCustomer"
                  defaultValue={true}
                />
              </h1>
              <div className="flex bg-gray-100 rounded p-1">
                <button
                  type="button"
                  className={`px-2 py-1 rounded mr-2 ${
                    openEditInfo
                      ? "bg-green-500 text-white"
                      : "hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    setOpenEditInfo(true);
                    setOpenHistoryReservation(false);
                    setOpenInvoices(false);
                  }}
                >
                  Thông tin
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 rounded mr-2 ${
                    openHistoryReservation
                      ? "bg-green-500 text-white"
                      : "hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    setOpenEditInfo(false);
                    setOpenHistoryReservation(true);
                    setOpenInvoices(false);
                  }}
                >
                  Lịch sử đặt phòng
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 rounded mr-2 ${
                    openInvoices
                      ? "bg-green-500 text-white"
                      : "hover:bg-gray-300"
                  }`}
                  onClick={() => {
                    setOpenEditInfo(false);
                    setOpenHistoryReservation(false);
                    setOpenInvoices(true);
                  }}
                >
                  Hoá đơn thanh toán
                </button>
              </div>
            </div>
            {openEditInfo && (
              <div className="flex w-full">
                <div className="ml-auto w-3/12">
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
                          defaultValue={customer.identity}
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
                          defaultValue={customer.phoneNumber}
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
                          defaultValue={dayjs(customer.dob).format(
                            "YYYY-MM-DD"
                          )}
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
            )}
            {openHistoryReservation && <div>Lịch sử đặt phòng</div>}
            {openInvoices && <div>Hoá đơn thanh toán</div>}
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

export default EditCustomerModal;
