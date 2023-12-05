import { Form, useLoaderData } from "react-router-dom";
import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import CreateInvoiceRoomModal from "./CreateInvoiceRoomModal";
import ViewInvoice from "./ViewInvoice";
import Swal from "sweetalert2";
import {
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import NewAccBankModal from "./NewAccBankModal";
import OtherFeeModal from "./OtherFeeModal";
import dayjs from "dayjs";

function PaymentModal(props) {
  const { listQR, otherFees, listSurchage, invoiceReservation } =
    useLoaderData();
  // console.log(listSurchage);
  // console.log(otherFees);
  const reservation = props.reservation;
  const invoices = props.invoices;
  // console.log(reservation);
  // console.log(invoices);
  const [openCreateInvoice, setOpenCreateInvoice] = useState(false);
  const [openDetailsInvoiceModal, setOpenDetailsInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payType, setPayType] = useState(1);
  const [openNewAccBankModal, setOpenNewAccBankModal] = useState(false);
  const [openOtherFeeModal, setOpenOtherFeeModal] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState(
    listQR.length > 0 ? listQR[0].bankAccountId : 0
  );
  const [otherFeePrice, setOtherFeePrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [payPrice, setPayPrice] = useState(0);
  const [banks, setBanks] = useState([]);
  useEffect(() => {
    fetch("https://api.vietqr.io/v2/banks")
      .then((response) => response.json())
      .then((data) => {
        setBanks(data.data);
      })
      .catch((error) => console.error(error));
  }, []);
  let priceAll = 0;
  const listCheckout = reservation.listReservationDetails.filter(
    (details) => details.status === "CHECK_OUT"
  );
  const listNotCheckOut = reservation.listReservationDetails.filter(
    (details) => details.status === "CHECK_IN" || details.status === "BOOKING"
  );

  const handleOtherFeeChange = (price) => {
    setOtherFeePrice(price);
  };
  return (
    <>
      <Form onSubmit={() => props.onClose()} className="print:hidden">
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
                {listCheckout.length !== 0 && (
                  <button
                    type="button"
                    className="ml-4 rounded px-1 text-sm bg-white border border-green-500 text-green-500 font-normal hover:bg-green-200"
                    onClick={() => setOpenCreateInvoice(true)}
                  >
                    Tạo hoá đơn một phần
                  </button>
                )}
              </h1>
              <div className="w-full flex text-sm">
                <div className="w-9/12 pr-4 border-r-2 border-gray-500 border-dotted overflow-y-auto h-[41.5rem]">
                  <table className="text-left min-w-full divide-y divide-gray-300">
                    <thead className="bg-green-200">
                      <tr className="border border-black">
                        <td className="px-4 py-2 text-center border-r border-black">
                          Thông tin phòng
                        </td>
                        <td className="px-4 py-2">Thành tiền</td>
                      </tr>
                    </thead>
                    <tbody>
                      {reservation.listReservationDetails.map(
                        (details, index) => {
                          // console.log(details);
                          let priceRoom = details.price;
                          const invoiceByDetails = invoices.find(
                            (invoice) =>
                              invoice.ReservationDetailId ===
                              details.reservationDetailId
                          );
                          const surcharge = listSurchage[index];
                          return (
                            <tr className="border border-black">
                              <td className="px-4 py-2 border-r border-black">
                                <h2 className="flex">
                                  <div className="mr-4">{index + 1}.</div>
                                  <div className="font-bold">
                                    {details.room.roomCategory.roomCategoryName}
                                  </div>
                                  <div
                                    className={`ml-2 px-2 rounded ${
                                      details.status === "BOOKING" &&
                                      "bg-orange-200 text-orange-500"
                                    } ${
                                      details.status === "CHECK_IN" &&
                                      "bg-green-200 text-green-500"
                                    } ${
                                      (details.status === "CHECK_OUT" ||
                                        details.status === "DONE") &&
                                      "bg-gray-200"
                                    }`}
                                  >
                                    {details.room.roomName}
                                  </div>
                                  <div
                                    className={`ml-2 px-2 rounded ${
                                      details.status === "BOOKING" &&
                                      "bg-orange-200 text-orange-500"
                                    } ${
                                      details.status === "CHECK_IN" &&
                                      "bg-green-200 text-green-500"
                                    } ${
                                      (details.status === "CHECK_OUT" ||
                                        details.status === "DONE") &&
                                      "bg-gray-200"
                                    }`}
                                  >
                                    {details.status === "BOOKING" &&
                                      "Đã đặt trước"}
                                    {details.status === "CHECK_IN" &&
                                      "Đang sử dụng"}
                                    {(details.status === "CHECK_OUT" ||
                                      details.status === "DONE") &&
                                      "Đã trả"}
                                  </div>
                                  <div className="ml-auto mr-10">
                                    {details.price.toLocaleString() + " VND"}
                                  </div>
                                </h2>
                                {surcharge.length > 0 && (
                                  <div className="ml-2 mt-2">
                                    {surcharge.map((sur) => {
                                      priceRoom += sur.value;
                                      return (
                                        <div>
                                          {sur.note +
                                            ": " +
                                            sur.value.toLocaleString() +
                                            " " +
                                            sur.typeValue}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                {invoiceByDetails && (
                                  <div className="mt-2">
                                    <h3 className="ml-2 font-medium mb-1">
                                      Hoá đơn mua hàng
                                    </h3>
                                    <div className="flex b">
                                      <div className="w-1/4">Mã hoá đơn</div>
                                      <div className="w-1/4">Trạng thái</div>
                                      <div className="w-1/4">Tiền</div>
                                      <div className="w-1/4"></div>
                                    </div>
                                    {invoiceByDetails.listOrderByReservationDetailId.map(
                                      (invoice) => {
                                        // console.log(invoice);
                                        if (
                                          invoice.order.status === "PAID" ||
                                          invoice.order.status === "CONFIRMED"
                                        ) {
                                          if (
                                            invoice.order.status === "CONFIRMED"
                                          ) {
                                            priceRoom += invoice.order.totalPay;
                                          }
                                          return (
                                            <div className="flex mt-1">
                                              <div className="w-1/4">
                                                {invoice.order.orderId}
                                              </div>
                                              <div
                                                className={`w-1/4 ${
                                                  invoice.order.status ===
                                                    "PAID" && "text-green-500"
                                                } ${
                                                  invoice.order.status ===
                                                    "CONFIRMED" &&
                                                  "text-blue-500"
                                                }`}
                                              >
                                                {invoice.order.status ===
                                                  "PAID" && "Đã trả"}
                                                {invoice.order.status ===
                                                  "CONFIRMED" && "Xác nhận"}
                                              </div>
                                              <div className="w-1/4">
                                                {invoice.order.totalPay.toLocaleString() +
                                                  " VND"}
                                              </div>
                                              <div className="w-1/4">
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setSelectedInvoice(invoice);
                                                    setOpenDetailsInvoiceModal(
                                                      true
                                                    );
                                                  }}
                                                >
                                                  <i className="fa-solid fa-eye"></i>
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        }
                                      }
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="px-2 py-1 font-bold">
                                {priceRoom.toLocaleString()}
                              </td>
                              <div className="hidden">
                                {(priceAll += priceRoom)}
                              </div>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="w-3/12 ml-4">
                  <div className="flex mt-2">
                    <div className="mr-auto">Tổng tiền</div>
                    <div className="ml-auto">{priceAll.toLocaleString()}</div>
                  </div>
                  {listNotCheckOut.length === 0 && (
                    <>
                      <div className="flex mt-2">
                        <div className="my-auto w-6/12">Giảm giá</div>
                        <input
                          className="p-0 text-sm border-0 border-b border-gray-500 text-right w-6/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="text"
                          name="discountPrice"
                          defaultValue={0}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              e.target.value = 0;
                            }
                            let num = e.target.value.replace(/[^\d]/g, "");
                            if (num > priceAll) {
                              num = 0;
                            }
                            setDiscountPrice(num);
                            e.target.value = parseInt(num, 10).toLocaleString();
                          }}
                        />
                      </div>
                      <div className="flex mt-2">
                        <div className="w-6/12">Phí khác</div>
                        <button
                          type="button"
                          className="w-6/12 text-right"
                          onClick={() => {
                            setOpenOtherFeeModal(true);
                          }}
                        >
                          {otherFeePrice.toLocaleString()}
                        </button>
                      </div>
                    </>
                  )}
                  <div className="flex mt-2">
                    <div className="mr-auto">Khách đã trả</div>
                    <div className="ml-auto">
                      {reservation.reservation.totalDeposit.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex mt-4 font-bold">
                    <div className="mr-auto">Khách cần trả</div>
                    <div className="ml-auto text-green-500">
                      {(
                        priceAll -
                        reservation.reservation.totalDeposit +
                        otherFeePrice -
                        discountPrice
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex mt-2">
                    <div className="mr-auto my-auto">Khách thanh toán</div>
                    <input
                      className="p-0 text-sm border-0 border-b border-gray-500 text-right w-6/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                      type="text"
                      name="bankAccountNumber"
                      defaultValue={0}
                      onChange={(e) => {
                        if (e.target.value === "") {
                          e.target.value = 0;
                        }
                        const num = e.target.value.replace(/[^\d]/g, "");
                        setPayPrice(num);
                        e.target.value = num
                          ? parseInt(num, 10).toLocaleString()
                          : "";
                      }}
                      // onBlur={(e) => {
                      //   e.target.setCustomValidity("");
                      // }}
                    />
                  </div>
                  {payPrice -
                    (priceAll -
                      reservation.reservation.totalDeposit +
                      otherFeePrice -
                      discountPrice) >
                    0 && (
                    <div className="flex mt-2">
                      <div className="mr-auto my-auto">Tiền thừa trả khách</div>
                      <div className="ml-auto">
                        {(
                          payPrice -
                          (priceAll -
                            reservation.reservation.totalDeposit +
                            otherFeePrice -
                            discountPrice)
                        ).toLocaleString()}
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <div className="flex">
                      <RadioGroup
                        value={payType}
                        onChange={(e) => {
                          setPayType(e.target.value);
                        }}
                        name="radio-buttons-group"
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label="Tiền mặt"
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.875rem",
                            },
                          }}
                        />
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label="Chuyển khoản"
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.875rem",
                            },
                          }}
                        />
                      </RadioGroup>
                    </div>
                    {payType === "2" && (
                      <div className="mt-2">
                        <Select
                          sx={{ width: 265, height: 40 }}
                          value={selectedAcc}
                          onChange={(e) => {
                            setSelectedAcc(e.target.value);
                          }}
                        >
                          {listQR.length > 0 &&
                            listQR.map((qr, index) => {
                              const nameBank = banks.find(
                                (bank) => bank.bin == qr.bankId
                              ).code;
                              return (
                                <MenuItem key={index} value={qr.bankAccountId}>
                                  {nameBank +
                                    " - " +
                                    qr.bankAccountName +
                                    " - " +
                                    qr.bankAccountNumber}
                                </MenuItem>
                              );
                            })}
                        </Select>
                        <button
                          type="button"
                          className="rounded border border-green-500 py-2 mt-2 w-full text-green-500 hover:bg-green-100"
                          onClick={() => {
                            setOpenNewAccBankModal(true);
                          }}
                        >
                          Thêm tài khoản
                        </button>
                      </div>
                    )}
                  </div>
                  {invoiceReservation.length > 0 && (
                    <div className="mt-4 border-t-2 border-gray-500 border-dotted">
                      <div className="flex mt-4">
                        <div className="mr-auto">Lịch sử hoá đơn</div>
                      </div>
                      <div className="mt-2 mx-2 rounded p-2 border border-gray-300 border-dotted flex">
                        <div className="mr-auto">HD000001</div>
                        <div className="ml-auto">1,000,000</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {listNotCheckOut.length > 0 ? (
              <div className="flex pt-5 absolute bottom-0 right-0">
                <div className="mr-10 mb-10 ml-auto">
                  <button className="bg-white border border-green-500 text-green-500 py-2 px-6 rounded hover:bg-green-200">
                    Lưu
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex pt-5 absolute bottom-0 right-0">
                <div className="mr-10 mb-10 ml-auto">
                  <button className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">
                    Hoàn thành
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Form>
      {openCreateInvoice && banks.length > 0 && (
        <CreateInvoiceRoomModal
          open={openCreateInvoice}
          onClose={() => setOpenCreateInvoice(false)}
          listCheckout={listCheckout}
          otherFees={otherFees}
          invoices={invoices}
          listSurchage={listSurchage}
          listQR={listQR}
          banks={banks}
        />
      )}
      {selectedInvoice && openDetailsInvoiceModal && (
        <ViewInvoice
          open={openDetailsInvoiceModal}
          onClose={() => setOpenDetailsInvoiceModal(false)}
          invoice={selectedInvoice}
        />
      )}
      {openNewAccBankModal && (
        <NewAccBankModal
          open={openNewAccBankModal}
          onClose={() => setOpenNewAccBankModal(false)}
          banks={banks}
        />
      )}
      {openOtherFeeModal && (
        <OtherFeeModal
          open={openOtherFeeModal}
          onClose={() => setOpenOtherFeeModal(false)}
          otherFees={otherFees}
          invoicePrice={priceAll}
          changePrice={handleOtherFeeChange}
        />
      )}
      {1 && (
        <div className="hidden print:block">
          <p>Tên cửa hàng: Khách sạn Thành Công</p>
          <p>Điện thoại: 0981987625</p>
          <div className="mt-4 border-t border-black border-dotted">
            Ngày xuất HĐ: {dayjs().format("DD/MM/YYYY HH:mm")}
          </div>
          <div className="mt-4">
            <div className="font-bold text-center">
              <h2>HOÁ ĐƠN BÁN HÀNG</h2>
              <p className="text-sm"></p>
            </div>
            <div>
              {/* <p>Khách hàng: {customer ? customer.customerName : "Khách lẻ"}</p>s */}
              <p>Mã đặt phòng: {reservation.reservation.reservationId}</p>
              <p>Thu ngân: </p>
            </div>
            <div className="flex mt-4">
              <div className="ml-auto mr-10">Tổng tiền hàng: </div>
              <div className="w-32 text-right"></div>
            </div>
            <div className="flex">
              <div className="ml-auto mr-10">Chiếu khấu: </div>
              <div className="w-32 text-right">0</div>
            </div>
            <div className="flex">
              <div className="ml-auto mr-10">Tổng cộng: </div>
              <div className="w-32 text-right"></div>
            </div>
          </div>
          <div className="text-center mt-10 text-sm">Cảm ơn và hẹn gặp lại</div>
        </div>
      )}
    </>
  );
}

export default PaymentModal;
