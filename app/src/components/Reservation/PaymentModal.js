import { Form, NavLink, useLoaderData } from "react-router-dom";
import Modal from "../UI/Modal";
import { useEffect, useRef, useState } from "react";
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
import { useReactToPrint } from "react-to-print";
import FuncBooksModal from "./FundBooksModal";
import { jwtDecode } from "jwt-decode";

function PaymentModal(props) {
  const {
    listQR,
    otherFees,
    listSurchage,
    listFunds,
    deposit,
    invoiceReservation,
    points,
  } = useLoaderData();
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const printQRRef = useRef();
  const printInvoiceRef = useRef();
  const reservation = props.reservation;
  const reservationId = reservation.reservation.reservationId;
  const invoices = props.invoices;
  let priceAll = 0;
  let priceCheckout = 0;
  let paidOtherPrice = 0;
  let receivedDiscount = 0;
  invoiceReservation.map((invoice) => {
    paidOtherPrice += invoice.Invoice.priceOther;
    receivedDiscount += invoice.Invoice.discount;
  });
  reservation.listReservationDetails.map((reservationDetail, index) => {
    let priceRoom = reservationDetail.price;
    if (reservationDetail.status === "CHECK_OUT") {
      priceCheckout += reservationDetail.price;
    }
    const surcharge = listSurchage[index];
    if (surcharge.length > 0) {
      surcharge.map((sur) => {
        if (reservationDetail.status === "CHECK_OUT") {
          priceCheckout += sur.value;
        }
        priceRoom += Math.floor(sur.value);
      });
    }
    const invoiceByDetails = invoices.find(
      (invoice) =>
        invoice.ReservationDetailId === reservationDetail.reservationDetailId
    );
    if (invoiceByDetails) {
      invoiceByDetails.listOrderByReservationDetailId.map((invoice) => {
        if (invoice.order.status === "CONFIRMED") {
          if (reservationDetail.status === "CHECK_OUT") {
            priceCheckout += invoice.order.totalPay;
          }
          priceRoom += invoice.order.totalPay;
        }
      });
    }
    priceAll += priceRoom;
  });
  const listCheckout = reservation.listReservationDetails.filter(
    (details) => details.status === "CHECK_OUT"
  );
  const listNotCheckOut = reservation.listReservationDetails.filter(
    (details) => details.status === "CHECK_IN" || details.status === "BOOKING"
  );
  const isDone = reservation.listReservationDetails.every(
    (details) => details.status === "DONE"
  );
  const requireDeposit =
    deposit.LIST_SETUP_DEPOSIT_DETAIL.length > 0
      ? deposit.LIST_SETUP_DEPOSIT_DETAIL[0].policyValue
      : 0;
  const [openCreateInvoice, setOpenCreateInvoice] = useState(false);
  const [openDetailsInvoiceModal, setOpenDetailsInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedInvoiceReservationId, setSelectedInvoiceReservationId] =
    useState(null);
  const [payType, setPayType] = useState("2");
  const [openNewAccBankModal, setOpenNewAccBankModal] = useState(false);
  const [openOtherFeeModal, setOpenOtherFeeModal] = useState(false);
  const [openFundBooksModal, setOpenFundBooksModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [selectedAcc, setSelectedAcc] = useState(
    listQR.length > 0 ? listQR[0].bankAccountId : 0
  );
  const account = listQR.find((acc) => acc.bankAccountId === selectedAcc);

  const [otherFeePrice, setOtherFeePrice] = useState(
    otherFees && listNotCheckOut.length === 0
      ? otherFees.LIST_OTHER_REVENUE_DETAIL.reduce((sum, fee) => {
          if (fee.autoAddToInvoice) {
            if (fee.typeValue === "%") {
              return sum + (priceAll * fee.policyValue) / 100;
            } else {
              return sum + fee.policyValue;
            }
          } else {
            return sum;
          }
        }, 0)
      : 0
  );
  const [listFeeIds, setListFeeIds] = useState(
    otherFees
      ? otherFees.LIST_OTHER_REVENUE_DETAIL.filter(
          (fee) => fee.autoAddToInvoice
        ).map((e) => e.policyDetailId)
      : []
  );
  const [usePoint, setUsePoint] = useState(0);
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
  let transactionCode = "";
  if (listNotCheckOut.length > 0) {
    transactionCode =
      listFunds.length > 0
        ? "MGD" +
          reservationId +
          "DC" +
          (listFunds.filter((fund) =>
            fund.transactionCode.includes("MGD" + reservationId + "DC")
          ).length +
            1)
        : "MGD" + reservationId + "DC1";
  } else {
    transactionCode =
      listFunds.length > 0
        ? "MGD" +
          reservationId +
          "HD" +
          (listFunds.filter((fund) =>
            fund.transactionCode.includes("MGD" + reservationId + "HD")
          ).length +
            1)
        : "MGD" + reservationId + "HD1";
  }
  const depositPrice = listFunds.reduce((e, c) => {
    if (c.value > 0) {
      return e + c.value;
    } else {
      return e;
    }
  }, 0);
  const historyListFunds = [];
  let total = 0;
  for (let i = listFunds.length - 1; i >= 0; i--) {
    if (listFunds[i].fundBookId.includes("TTDP") && listFunds[i].value > 0) {
      total += listFunds[i].value;
      historyListFunds.push(listFunds[i]);
    }
    if (listFunds[i].fundBookId.includes("TTHD")) {
      if (listFunds[i].value > 0) {
        historyListFunds.push({
          ...listFunds[i],
          fundBookId: "(Tiền tạm ứng)",
          value: -total,
        });
        total = 0;
      } else {
        total += listFunds[i].value;
        historyListFunds.push({
          ...listFunds[i],
          fundBookId: "(Tiền tạm ứng)",
        });
      }
    }
  }
  const prePail = historyListFunds.reduce((e, c) => {
    return e + c.value;
  }, 0);
  const point =
    (reservation.reservation.customer.point /
      points.LIST_PROMOTION_POLICY_DETAIL[0].limitValue) *
    points.LIST_PROMOTION_POLICY_DETAIL[0].policyValue;
  const discountPrice =
    (usePoint / points.LIST_PROMOTION_POLICY_DETAIL[0].limitValue) *
    points.LIST_PROMOTION_POLICY_DETAIL[0].policyValue;

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (payPrice > 0 && account) {
      setImageUrl(
        `https://img.vietqr.io/image/${account.bankId}-${account.bankAccountNumber}-print.jpg?amount=${payPrice}&addInfo=${transactionCode}`
      );
    }
  }, [account, payPrice]);

  const handleOtherFeeChange = (selectedFeeId, price) => {
    setListFeeIds(selectedFeeId);
    setOtherFeePrice(price);
  };

  const handleInvoicePrint = useReactToPrint({
    content: () => printInvoiceRef.current,
  });

  const handleQRPrint = useReactToPrint({
    content: () => printQRRef.current,
  });

  return (
    <>
      <Form method="POST" onSubmit={() => props.onClose()}>
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
              <h1 className="text-lg pb-5 font-bold">
                Thanh toán{" "}
                {reservation.reservation.reservationId +
                  " - " +
                  reservation.reservation.customer.customerName}
                {listNotCheckOut.length === 0 &&
                  reservation.reservation.customer.point > 0 && (
                    <span className="text-sm font-normal">
                      ({reservation.reservation.customer.point + " điểm"}
                      {point > 0 && " = " + point.toLocaleString() + " VND"})
                    </span>
                  )}
                {listCheckout.length !== 0 && listNotCheckOut.length !== 0 && (
                  <span>
                    <button
                      type="button"
                      className="ml-4 rounded px-1 text-sm bg-white border border-green-500 text-green-500 font-normal hover:bg-green-200"
                      onClick={() => setOpenCreateInvoice(true)}
                    >
                      Tạo hoá đơn một phần
                    </button>
                  </span>
                )}
              </h1>
              <div className="w-full flex text-sm">
                <div className="w-8/12 pr-4 border-r-2 border-gray-500 border-dotted overflow-y-auto h-[41.5rem]">
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
                          console.log(details);
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
                                  {details.status === "DONE" ? (
                                    <div className="ml-2 px-2 rounded bg-blue-200 text-blue-500">
                                      Hoàn thành
                                    </div>
                                  ) : (
                                    <div
                                      className={`ml-2 px-2 rounded ${
                                        details.status === "BOOKING" &&
                                        "bg-orange-200 text-orange-500"
                                      } ${
                                        details.status === "CHECK_IN" &&
                                        "bg-green-200 text-green-500"
                                      } ${
                                        details.status === "CHECK_OUT" &&
                                        "bg-gray-200"
                                      }`}
                                    >
                                      {details.status === "BOOKING" &&
                                        "Đã đặt trước"}
                                      {details.status === "CHECK_IN" &&
                                        "Đang sử dụng"}
                                      {details.status === "CHECK_OUT" &&
                                        "Đã trả"}
                                    </div>
                                  )}
                                  <div className="ml-auto mr-10">
                                    {details.price.toLocaleString() + " VND"}
                                  </div>
                                </h2>
                                {surcharge.length > 0 && (
                                  <div className="ml-2 mt-2">
                                    {surcharge.map((sur) => {
                                      priceRoom += Math.floor(sur.value);
                                      return (
                                        <div>
                                          {sur.note +
                                            ": " +
                                            Math.round(
                                              sur.value
                                            ).toLocaleString() +
                                            " " +
                                            sur.typeValue}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                {invoiceByDetails &&
                                  invoiceByDetails.listOrderByReservationDetailId.filter(
                                    (invoice) =>
                                      invoice.order.status === "PAID" ||
                                      invoice.order.status === "CONFIRMED"
                                  ).length > 0 && (
                                    <div className="mt-2">
                                      <h3 className="ml-2 font-medium mb-1">
                                        Hoá đơn mua hàng
                                      </h3>
                                      <div className="flex b">
                                        <div className="w-3/12">Mã hoá đơn</div>
                                        <div className="w-4/12">Trạng thái</div>
                                        <div className="w-4/12">Tiền</div>
                                        <div className="w-1/12"></div>
                                      </div>
                                      {invoiceByDetails.listOrderByReservationDetailId.map(
                                        (invoice) => {
                                          // console.log(invoice);
                                          if (
                                            invoice.order.status === "PAID" ||
                                            invoice.order.status === "CONFIRMED"
                                          ) {
                                            priceRoom += invoice.order.totalPay;
                                            return (
                                              <div className="flex mt-1">
                                                <div className="w-3/12">
                                                  {invoice.order.orderId}
                                                </div>
                                                <div
                                                  className={`w-4/12 ${
                                                    invoice.order.status ===
                                                      "PAID" && "text-green-500"
                                                  } ${
                                                    invoice.order.status ===
                                                      "CONFIRMED" &&
                                                    "text-blue-500"
                                                  }`}
                                                >
                                                  {invoice.order.status ===
                                                    "PAID" && "Đã thanh toán"}
                                                  {invoice.order.status ===
                                                    "CONFIRMED" && "Xác nhận"}
                                                </div>
                                                <div className="w-4/12">
                                                  {invoice.order.totalPay.toLocaleString() +
                                                    " VND"}
                                                </div>
                                                <div className="w-1/12">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setSelectedInvoice(
                                                        invoice
                                                      );
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
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="w-4/12 ml-4">
                  <input
                    type="hidden"
                    name="reservationId"
                    value={reservation.reservation.reservationId}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="listReservationDetails"
                    value={listCheckout.map(
                      (checkout) => checkout.reservationDetailId
                    )}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="customerId"
                    value={reservation.reservation.customer.customerId}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="priceCheckout"
                    value={priceCheckout}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="discount"
                    value={discountPrice}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="priceOther"
                    value={otherFeePrice}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="depositPrice"
                    value={depositPrice}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="prePail"
                    value={prePail}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="payType"
                    value={payType}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="payPrice"
                    value={payPrice}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="transactionCode"
                    value={transactionCode}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="usePoint"
                    value={usePoint}
                    onChange={() => console.log()}
                  />
                  <input
                    type="hidden"
                    name="priceAll"
                    value={priceAll}
                    onChange={() => console.log()}
                  />
                  {Math.floor((priceAll * requireDeposit) / 100) >
                    depositPrice && (
                    <div className="flex mt-2 text-red-500">
                      <div className="mr-auto">Tiền cọc còn thiếu</div>
                      <div className="ml-auto">
                        {(
                          Math.floor((priceAll * requireDeposit) / 100) -
                          depositPrice
                        ).toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="flex mt-2">
                    <div className="mr-auto">Tổng tiền</div>
                    <div className="ml-auto">{priceAll.toLocaleString()}</div>
                  </div>
                  {listNotCheckOut.length === 0 && (
                    <>
                      {!isDone &&
                        reservation.reservation.customer.point > 0 && (
                          <div className="flex mt-2">
                            <div className="my-auto w-6/12">Sử dụng điểm</div>
                            <input
                              className="p-0 text-sm border-0 border-b border-gray-500 text-right w-6/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                              type="number"
                              name=""
                              value={usePoint}
                              onChange={(e) => {
                                if (
                                  e.target.value > 0 &&
                                  e.target.value <=
                                    reservation.reservation.customer.point
                                ) {
                                  setUsePoint(e.target.value);
                                } else {
                                  setUsePoint(0);
                                }
                              }}
                            />
                          </div>
                        )}
                      <div className="flex mt-2">
                        <div className="my-auto w-6/12">Giảm giá</div>
                        <div className="text-right w-6/12">
                          {isDone
                            ? invoiceReservation
                                .reduce((sum, inv) => {
                                  return (sum += inv.Invoice.discount);
                                }, 0)
                                .toLocaleString()
                            : discountPrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <div className="w-6/12">Phí khác</div>
                        <button
                          type="button"
                          className="w-6/12 text-right"
                          onClick={() => {
                            if (!isDone) {
                              setOpenOtherFeeModal(true);
                            }
                          }}
                        >
                          {isDone
                            ? invoiceReservation
                                .reduce((sum, inv) => {
                                  return (sum += inv.Invoice.priceOther);
                                }, 0)
                                .toLocaleString()
                            : otherFeePrice.toLocaleString()}
                        </button>
                      </div>
                    </>
                  )}
                  {!isDone && (
                    <div className="flex mt-2">
                      <div className="w-6/12">Khách đã trả</div>
                      <button
                        type="button"
                        className="text-right w-6/12"
                        onClick={() => setOpenFundBooksModal(true)}
                      >
                        {depositPrice.toLocaleString()}
                      </button>
                    </div>
                  )}
                  <div className="flex mt-4 font-bold">
                    <div className="mr-auto">Khách cần trả</div>
                    <div className="ml-auto text-green-500">
                      {isDone
                        ? depositPrice.toLocaleString()
                        : (
                            priceAll +
                            otherFeePrice -
                            depositPrice -
                            discountPrice -
                            paidOtherPrice +
                            receivedDiscount
                          ).toLocaleString()}
                    </div>
                  </div>
                  {paidOtherPrice > 0 && (
                    <div className="flex mt-2">
                      <div className="mr-auto my-auto">Phí khác đã thu</div>
                      <div className="ml-auto my-auto">
                        {paidOtherPrice.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {receivedDiscount > 0 && (
                    <div className="flex mt-2">
                      <div className="mr-auto my-auto">Giảm giá đã giảm</div>
                      <div className="ml-auto my-auto">
                        {receivedDiscount.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {isDone && (
                    <div className="flex mt-2">
                      <div className="mr-auto my-auto">Khách thanh toán</div>
                      <div className="ml-auto my-auto">
                        {depositPrice.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {priceAll +
                    otherFeePrice -
                    depositPrice -
                    discountPrice -
                    paidOtherPrice +
                    receivedDiscount >
                    0 && (
                    <div className="flex mt-2">
                      <div className="mr-auto my-auto">Khách thanh toán</div>
                      <input
                        className="p-0 text-sm border-0 border-b border-gray-500 text-right w-6/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name=""
                        defaultValue={0}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            e.target.value = 0;
                          }
                          const num = e.target.value.replace(/[^\d]/g, "");
                          setPayPrice(Number(num));
                          e.target.value = num
                            ? parseInt(num, 10).toLocaleString()
                            : "";
                        }}
                      />
                    </div>
                  )}
                  {!isDone &&
                    payPrice -
                      (priceAll +
                        otherFeePrice -
                        depositPrice -
                        discountPrice -
                        paidOtherPrice +
                        receivedDiscount) >
                      0 && (
                      <div className="flex mt-2">
                        <div className="mr-auto my-auto">
                          Tiền thừa trả khách
                        </div>
                        <div className="ml-auto">
                          {(
                            payPrice -
                            (priceAll +
                              otherFeePrice -
                              depositPrice -
                              discountPrice -
                              paidOtherPrice +
                              receivedDiscount)
                          ).toLocaleString()}
                        </div>
                      </div>
                    )}
                  {!isDone && (
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
                        <div className="mt-2 flex">
                          <div className="w-1/3">
                            {payPrice > 0 && (
                              <div ref={printQRRef} className="flex">
                                <img
                                  src={imageUrl}
                                  className="mx-auto"
                                  alt="QR-CODE"
                                />
                              </div>
                            )}
                          </div>
                          <div className="w-1/2">
                            <Select
                              sx={{ width: 230, height: 40 }}
                              value={selectedAcc}
                              onChange={(e) => {
                                setSelectedAcc(e.target.value);
                              }}
                            >
                              {listQR.length > 0 &&
                                listQR.map((qr, index) => {
                                  const nameBank = banks.find(
                                    (bank) => bank.bin == qr.bankId
                                  );
                                  return (
                                    <MenuItem
                                      key={index}
                                      value={qr.bankAccountId}
                                    >
                                      {nameBank &&
                                        nameBank.code +
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
                              className="rounded border h-10 border-green-500 mt-2 w-56 text-green-500 hover:bg-green-100"
                              onClick={() => {
                                setOpenNewAccBankModal(true);
                              }}
                            >
                              Thêm tài khoản
                            </button>
                            {payPrice > 0 && (
                              <button
                                type="button"
                                onClick={handleQRPrint}
                                className="rounded border border-black p-1 mt-2"
                              >
                                In mã QR
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {invoiceReservation.length > 0 && (
                    <div className="mt-4 border-t-2 border-gray-500 border-dotted">
                      <div className="flex mt-4">
                        <div className="mr-auto">Lịch sử hoá đơn</div>
                      </div>
                      {invoiceReservation.map((invoice) => {
                        return (
                          <div className="mt-2 mx-1 rounded py-1 px-2 border border-gray-300 border-dotted flex">
                            <div className="mr-auto">
                              {invoice.Invoice.invoiceId}
                              <div className="text-xs">
                                {dayjs(invoice.Invoice.createdDate).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </div>
                            </div>
                            <div className="ml-auto font-bold">
                              {(
                                invoice.Invoice.total +
                                invoice.Invoice.priceOther -
                                invoice.Invoice.discount
                              ).toLocaleString()}
                              <div className="text-right">
                                <button
                                  type="button"
                                  className="ml-auto hover:text-green-500"
                                  onMouseOver={() =>
                                    setSelectedInvoiceReservationId(
                                      invoice.Invoice.invoiceId
                                    )
                                  }
                                  onMouseLeave={() =>
                                    setSelectedInvoiceReservationId(null)
                                  }
                                  onClick={handleInvoicePrint}
                                >
                                  <i className="fa-solid fa-print"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {listNotCheckOut.length > 0
              ? !isDone && (
                  <div className="flex pt-5 absolute bottom-0 right-0">
                    <div className="mr-10 mb-10 ml-auto">
                      <input
                        type="hidden"
                        name="addDeposit"
                        defaultValue={true}
                      />
                      <button
                        type={
                          payPrice > 0 &&
                          payPrice + depositPrice >=
                            Math.floor((priceAll * requireDeposit) / 100) &&
                          ((payType === "2" && account) || payType === "1")
                            ? ""
                            : "button"
                        }
                        className="bg-white border border-green-500 text-green-500 py-2 px-6 rounded hover:bg-green-200"
                        onClick={() => {
                          if (priceAll > depositPrice) {
                            if (payPrice <= 0) {
                              Swal.fire({
                                position: "bottom",
                                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Xin hãy nhập tiền cọc!</button>`,
                                showConfirmButton: false,
                                background: "transparent",
                                backdrop: "none",
                                timer: 2500,
                              });
                            } else if (payType === "2" && !account) {
                              Swal.fire({
                                position: "bottom",
                                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Không có tài khoản, xin hãy tạo tài khoản mới!</button>`,
                                showConfirmButton: false,
                                background: "transparent",
                                backdrop: "none",
                                timer: 2500,
                              });
                            } else if (
                              payPrice + depositPrice <
                              Math.floor((priceAll * requireDeposit) / 100)
                            ) {
                              setOpenConfirmModal(true);
                            }
                          } else {
                            props.onClose();
                          }
                        }}
                      >
                        Lưu
                      </button>
                      <button
                        type="button"
                        className="text-white ml-5 border border-red-500 bg-red-500 py-2 px-6 rounded hover:bg-red-600"
                        onClick={() => props.onClose()}
                      >
                        Huỷ bỏ
                      </button>
                      {openConfirmModal && (
                        <Modal
                          open={openConfirmModal}
                          onClose={() => setOpenConfirmModal(false)}
                          size="w-6/12 h-.5/6"
                        >
                          <h2>
                            Bạn chắc chắn muốn thêm tiền cọc khi khách chưa cả
                            đủ tiền cọc không?
                          </h2>
                        </Modal>
                      )}
                    </div>
                  </div>
                )
              : !isDone && (
                  <div className="flex pt-5 absolute bottom-0 right-0">
                    <div className="mr-10 mb-10 ml-auto">
                      <input
                        type="hidden"
                        name="addDoneReservation"
                        defaultValue={true}
                      />
                      <button
                        type={
                          payPrice >=
                          priceAll +
                            otherFeePrice -
                            depositPrice -
                            discountPrice
                            ? ""
                            : "button"
                        }
                        className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
                        onClick={() => {
                          if (
                            payPrice <
                            priceAll +
                              otherFeePrice -
                              depositPrice -
                              discountPrice
                          ) {
                            Swal.fire({
                              position: "bottom",
                              html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Xin hãy nhập đủ tiền thanh toán!</button>`,
                              showConfirmButton: false,
                              background: "transparent",
                              backdrop: "none",
                              timer: 2500,
                            });
                          }
                        }}
                      >
                        Hoàn thành
                      </button>
                      <button
                        type="button"
                        className="text-white ml-5 border border-red-500 bg-red-500 py-2 px-6 rounded hover:bg-red-600"
                        onClick={() => props.onClose()}
                      >
                        Huỷ bỏ
                      </button>
                    </div>
                  </div>
                )}
            {isDone && (
              <div className="flex pt-5 absolute bottom-0 right-0">
                <div className="mr-10 mb-10 ml-auto">
                  <button
                    type="button"
                    className="text-white ml-5 border border-gray-500 bg-gray-500 py-2 px-6 rounded hover:bg-gray-600"
                    onClick={() => props.onClose()}
                  >
                    Đóng
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
          onCloseAll={() => {
            setOpenCreateInvoice(false);
            props.onClose();
          }}
          onClose={() => setOpenCreateInvoice(false)}
          customer={reservation.reservation.customer}
          listCheckout={listCheckout}
          reservationId={reservation.reservation.reservationId}
          depositPrice={depositPrice}
          invoices={invoices}
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
      {invoiceReservation.length > 0 && (
        <div className="hidden">
          <div ref={printInvoiceRef}>
            {invoiceReservation.map((invoice) => {
              // console.log(invoice);
              return (
                <div
                  className={`${
                    invoice.Invoice.invoiceId === selectedInvoiceReservationId
                      ? ""
                      : "hidden"
                  } m-10`}
                >
                  <p>Tên khách sạn: Khách sạn Văn Lâm</p>
                  <p>Điện thoại: 0981987625</p>
                  <p>Địa chỉ: Huyện Nga Sơn, tỉnh Thanh Hoá</p>
                  <div className="mt-4 border-t border-black border-dotted">
                    Ngày xuất HĐ: {dayjs().format("DD/MM/YYYY HH:mm")}
                  </div>
                  <div className="mt-4">
                    <div className="font-bold text-center">
                      <h2>HOÁ ĐƠN BÁN HÀNG</h2>
                      <p className="text-sm">{invoice.Invoice.invoiceId}</p>
                    </div>
                    <div>
                      <p>
                        Khách hàng:{" "}
                        {reservation.reservation.customer.customerName}
                      </p>
                      <p>Lễ tân: {decodedToken.sub}</p>
                    </div>
                    <table className="text-left min-w-full divide-y divide-gray-300">
                      <thead className="">
                        <tr className="border border-black">
                          <td className="px-4 py-2 text-center border-r border-black">
                            Thông tin phòng
                          </td>
                          <td className="px-4 py-2">Thành tiền</td>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.ListReservationOfInvoice.map(
                          (detailsInvoice, index) => {
                            const details = detailsInvoice.reservationDetail;
                            let priceRoom = details.price;
                            let listGoods = [];
                            detailsInvoice.ListOrder.flatMap(
                              (group) => group.OrderDetail
                            ).map((cur) => {
                              const productIndex =
                                listGoods.length > 0
                                  ? listGoods.findIndex(
                                      (a) =>
                                        cur.OrderDetail.goodsUnit
                                          .goodsUnitId ===
                                        a.goodsUnit.goodsUnitId
                                    )
                                  : -1;
                              if (productIndex !== -1) {
                                listGoods[productIndex] = {
                                  ...listGoods[productIndex],
                                  quantity:
                                    listGoods[productIndex].quantity +
                                    cur.OrderDetail.quantity,
                                };
                              } else {
                                listGoods.push(cur.OrderDetail);
                              }
                            });
                            const surcharge = detailsInvoice.ListControlPolicy;
                            return (
                              <tr className="border border-black">
                                <td className="px-4 py-2 border-r border-black">
                                  <h2 className="flex">
                                    <div className="mr-4">{index + 1}.</div>
                                    <div className="font-bold">
                                      {
                                        details.room.roomCategory
                                          .roomCategoryName
                                      }
                                    </div>
                                    <div className="ml-2 px-2 rounded">
                                      {details.room.roomName}
                                    </div>
                                    <div className="ml-auto text-right">
                                      {details.price.toLocaleString() + " VND"}
                                    </div>
                                  </h2>
                                  {surcharge.length > 0 && (
                                    <div className="ml-2 mt-2 text-xs">
                                      {surcharge.map((sur) => {
                                        priceRoom += Math.floor(sur.value);
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
                                  {listGoods.length > 0 && (
                                    <div className="mt-2 text-xs text-center">
                                      <h3 className="ml-2 font-medium mb-1">
                                        Hàng hoá đã mua
                                      </h3>
                                      <div className="flex ">
                                        <div className="w-3/12">
                                          Tên sản phẩm/dịch vụ
                                        </div>
                                        <div className="w-3/12 text-right">
                                          Số lượng
                                        </div>
                                        <div className="w-3/12 text-right">
                                          Giá
                                        </div>
                                        <div className="w-3/12 text-right">
                                          Tổng tiền
                                        </div>
                                      </div>
                                      {listGoods.map((good) => {
                                        priceRoom +=
                                          good.goodsUnit.price * good.quantity;
                                        return (
                                          <div className="flex">
                                            <div className="w-3/12 text-left">
                                              {good.goods.goodsName +
                                                "(" +
                                                good.goodsUnit.goodsUnitName +
                                                ")"}
                                            </div>
                                            <div className="w-3/12 text-right">
                                              {good.quantity}
                                            </div>
                                            <div className="w-3/12 text-right">
                                              {good.goodsUnit.price.toLocaleString() +
                                                " VND"}
                                            </div>
                                            <div className="w-3/12 text-right">
                                              {(
                                                good.goodsUnit.price *
                                                good.quantity
                                              ).toLocaleString() + " VND"}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </td>
                                <td className="px-2 py-1 font-bold text-right">
                                  {priceRoom.toLocaleString() + " VND"}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                    <div className="flex mt-4">
                      <div className="ml-auto mr-10">Tổng tiền hoá đơn: </div>
                      <div className="w-32 text-right">
                        {invoice.Invoice.total.toLocaleString() + " VND"}
                      </div>
                    </div>
                    <div className="flex mt-2">
                      <div className="ml-auto mr-10">Giảm giá: </div>
                      <div className="w-32 text-right">
                        {invoice.Invoice.discount.toLocaleString() + " VND"}
                      </div>
                    </div>
                    <div className="flex mt-2">
                      <div className="ml-auto mr-10">Phí khác: </div>
                      <div className="w-32 text-right">
                        {invoice.Invoice.priceOther.toLocaleString() + " VND"}
                      </div>
                    </div>
                    <div className="flex mt-2">
                      <div className="ml-auto mr-10">Tổng cộng: </div>
                      <div className="w-32 text-right">
                        {(
                          invoice.Invoice.total -
                          invoice.Invoice.discount +
                          invoice.Invoice.priceOther
                        ).toLocaleString() + " VND"}
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-10 text-sm">
                    Cảm ơn và hẹn gặp lại
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {openOtherFeeModal && (
        <OtherFeeModal
          open={openOtherFeeModal}
          onClose={() => setOpenOtherFeeModal(false)}
          otherFees={otherFees}
          listFeeIds={listFeeIds}
          invoicePrice={priceAll}
          changePrice={handleOtherFeeChange}
        />
      )}
      {openFundBooksModal && (
        <FuncBooksModal
          open={openFundBooksModal}
          onClose={() => setOpenFundBooksModal(false)}
          name={
            "Đã thanh toán cho đặt phòng - " +
            reservation.reservation.reservationId
          }
          listFunds={listFunds.filter((fund) => fund.value > 0)}
        />
      )}
    </>
  );
}

export default PaymentModal;
