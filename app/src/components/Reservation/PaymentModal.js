import { Form } from "react-router-dom";
import Modal from "../UI/Modal";
import { useState } from "react";
import CreateInvoiceRoomModal from "./CreateInvoiceRoomModal";

function PaymentModal(props) {
  const reservation = props.reservation;
  console.log(reservation);
  const [openCreateInvoice, setOpenCreateInvoice] = useState(false);
  return (
    <>
      <Form onSubmit={() => props.onClose()}>
        <div
          onClick={props.onClose}
          className={`fixed inset-0 flex justify-center items-center transition-colors overflow-auto z-10 ${
            props.open ? "visible bg-black/20" : "invisible"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white absolute top-0 right-0 rounded-xl shadow p-6 transition-all w-9/12 h-full ${
              props.open ? "scale-100 opacity-100" : "scale-125 opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                props.onClose();
              }}
              className={`absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600`}
            >
              <i className="fa-solid fa-x"></i>
            </button>
            <div className="p-2 w-full">
              <h1 className="text-lg pb-10 font-bold">
                Thanh toán{" "}
                {reservation.reservation.reservationId +
                  " - " +
                  reservation.reservation.customer.customerName}
                <button
                  type="button"
                  className="ml-4 rounded px-1 text-sm bg-white border border-green-500 text-green-500 font-normal hover:bg-green-200"
                  onClick={() => setOpenCreateInvoice(true)}
                >
                  Tạo hoá đơn một phần
                </button>
              </h1>
              <div className="w-full flex text-sm">
                <div className="w-9/12 pr-4 border-r-2 border-gray-500 border-dotted">
                  <table className="text-left min-w-full divide-y divide-gray-300">
                    <thead className="bg-green-200">
                      <tr className="border border-black">
                        <td className="px-2 py-1 text-center border-r border-black">
                          Thông tin phòng
                        </td>
                        <td className="px-2 py-1">Thành tiền</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border border-black">
                        <td className="px-2 py-1 border-r border-black">
                          <h2 className="flex">
                            <div className="mr-4">1.</div>
                            <div className="font-bold">
                              Phòng 01 giường đôi và 1 giường đơn cho 3 người
                            </div>
                            <button
                              type="button"
                              className="ml-2 bg-gray-200 px-2 rounded"
                            >
                              P.102
                            </button>
                          </h2>
                          <div className="mt-4">
                            <div className="flex b">
                              <div className="w-1/4">Mã hoá đơn</div>
                              <div className="w-1/4">Trạng thái</div>
                              <div className="w-1/4">Tiền</div>
                              <div className="w-1/4"></div>
                            </div>
                            <div className="flex mt-1">
                              <div className="w-1/4">HD000001</div>
                              <div className="w-1/4 text-green-500">Đã trả</div>
                              <div className="w-1/4">1,000,000</div>
                              <div className="w-1/4">
                                <button type="button">
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                              </div>
                            </div>
                            <div className="flex mt-1">
                              <div className="w-1/4">HD000002</div>
                              <div className="w-1/4 text-blue-500">
                                Xác nhận
                              </div>
                              <div className="w-1/4">800,000</div>
                              <div className="w-1/4">
                                <button type="button">
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-1 font-bold">3,800,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="w-3/12 ml-4">
                  <div className="flex mt-2">
                    <div className="mr-auto">Tổng tiền</div>
                    <div className="ml-auto">3,800,000</div>
                  </div>
                  <div className="flex mt-2">
                    <div className="mr-auto">Giảm giá</div>
                    <div className="ml-auto">0</div>
                  </div>
                  <div className="flex mt-2">
                    <div className="mr-auto">Phí khác</div>
                    <div className="ml-auto">0</div>
                  </div>
                  <div className="flex mt-2">
                    <div className="mr-auto">Khách đã trả</div>
                    <div className="ml-auto">1,000,000</div>
                  </div>
                  <div className="flex mt-4">
                    <div className="mr-auto">Khách cần trả</div>
                    <div className="ml-auto">2,800,000</div>
                  </div>
                  <div className="mt-4 border-t-2 border-gray-500 border-dotted">
                    <div className="flex mt-4">
                      <div className="mr-auto">Lịch sử hoá đơn</div>
                    </div>
                    <div className="mt-2 mx-2 rounded p-2 border border-gray-300 border-dotted flex">
                      <div className="mr-auto">HD000001</div>
                      <div className="ml-auto">1,000,000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex pt-5 absolute bottom-0 right-0">
              <div className="mr-10 mb-10 ml-auto">
                <button className="bg-white border border-green-500 text-green-500 py-2 px-6 rounded hover:bg-green-200">
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
      {openCreateInvoice && (
        <CreateInvoiceRoomModal
          open={openCreateInvoice}
          onClose={() => setOpenCreateInvoice(false)}
        />
      )}
    </>
  );
}

export default PaymentModal;
