import { Form } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import ViewInvoice from "./ViewInvoice";
import OtherFeeModal from "./OtherFeeModal";
import {
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import NewAccBankModal from "./NewAccBankModal";

function CreateInvoiceRoomModal(props) {
  const otherFees = props.otherFees;
  const listQR = props.listQR;
  const banks = props.banks;
  const listSurchage = props.listSurchage;
  // console.log(listSurchage);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openDetailsInvoiceModal, setOpenDetailsInvoiceModal] = useState(false);
  const [priceAll, setPriceAll] = useState(0);
  const [openOtherFeeModal, setOpenOtherFeeModal] = useState(false);
  const [otherFeePrice, setOtherFeePrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [payPrice, setPayPrice] = useState(0);
  const [payType, setPayType] = useState(1);
  const [selectedAcc, setSelectedAcc] = useState(
    listQR.length > 0 ? listQR[0].bankAccountId : 0
  );
  const [openNewAccBankModal, setOpenNewAccBankModal] = useState(false);
  const listCheckout = props.listCheckout;
  const invoices = props.invoices;
  const columns = [
    {
      field: "infoRoom",
      headerName: "Thông tin phòng",
      width: 500,
      renderCell: (params) => {
        const checkout = params.row.checkout;
        const invoiceByDetails = params.row.listInvoices;
        let surcharge = [];
        listSurchage.map((sur) => {
          if (
            sur.length > 0 &&
            sur[0].reservationDetail.reservationDetailId === params.row.id
          ) {
            surcharge = sur;
          }
        });
        return (
          <div className="w-96">
            <h2 className="flex">
              <div className="mr-4">{params.row.index + 1}.</div>
              <div className="font-bold">
                {checkout.room.roomCategory.roomCategoryName}
              </div>
              <div className="ml-2 px-2 rounded bg-gray-200">
                {checkout.room.roomName}
              </div>
              <div className="ml-2 px-2 rounded bg-gray-200">Đã trả</div>
              <div className="ml-4">
                {checkout.price.toLocaleString() + " VND"}
              </div>
            </h2>
            {surcharge.length > 0 && (
              <div className="ml-2 mt-2">
                {surcharge.map((sur) => {
                  return (
                    <div className="font-medium">
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
              <div className="mt-2 px-4">
                <h3 className="ml-2 font-medium mb-1">Hoá đơn mua hàng</h3>
                <div className="flex b">
                  <div className="w-1/4">Mã hoá đơn</div>
                  <div className="w-1/4">Trạng thái</div>
                  <div className="w-1/4">Tiền</div>
                  <div className="w-1/4"></div>
                </div>
                {invoiceByDetails.listOrderByReservationDetailId.map(
                  (invoice) => {
                    if (
                      invoice.order.status === "PAID" ||
                      invoice.order.status === "CONFIRMED"
                    ) {
                      return (
                        <div className="flex mt-1">
                          <div className="w-1/4">{invoice.order.orderId}</div>
                          <div
                            className={`w-1/4 ${
                              invoice.order.status === "PAID" &&
                              "text-green-500"
                            } ${
                              invoice.order.status === "CONFIRMED" &&
                              "text-blue-500"
                            }`}
                          >
                            {invoice.order.status === "PAID" && "Đã trả"}
                            {invoice.order.status === "CONFIRMED" && "Xác nhận"}
                          </div>
                          <div className="w-1/4">
                            {invoice.order.totalPay.toLocaleString() + " VND"}
                          </div>
                          <div className="w-1/4">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setOpenDetailsInvoiceModal(true);
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
          </div>
        );
      },
    },
    { field: "price", headerName: "Thành tiền", width: 150 },
  ];

  const rows = listCheckout.map((checkout, index) => {
    const listInvoices = invoices.find(
      (invoice) => invoice.ReservationDetailId === checkout.reservationDetailId
    );
    let price = checkout.price;
    if (listInvoices) {
      listInvoices.listOrderByReservationDetailId.map((invoice) => {
        if (invoice.order.status === "CONFIRMED") {
          price += invoice.order.totalPay;
        }
      });
    }
    let surcharge = [];
    listSurchage.map((sur) => {
      if (
        sur.length > 0 &&
        sur[0].reservationDetail.reservationDetailId ===
          checkout.reservationDetailId
      ) {
        surcharge = sur;
      }
    });
    surcharge.map((sur) => {
      price += sur.value;
    });
    return {
      id: checkout.reservationDetailId,
      index: index,
      checkout: checkout,
      listInvoices: listInvoices,
      price: price.toLocaleString(),
    };
  });
  useEffect(() => {
    const listSelectedCheckout = listCheckout.filter((checkout) =>
      rowSelectionModel.includes(checkout.reservationDetailId)
    );
    let price = 0;
    listSelectedCheckout.map((checkout) => {
      price += checkout.price;
      const listInvoices = invoices.find(
        (invoice) =>
          invoice.ReservationDetailId === checkout.reservationDetailId
      );
      if (listInvoices) {
        listInvoices.listOrderByReservationDetailId.map((invoice) => {
          if (invoice.order.status === "CONFIRMED") {
            price += invoice.order.totalPay;
          }
        });
      }
      listSurchage.map((sur) => {
        if (
          sur.length > 0 &&
          sur[0].reservationDetail.reservationDetailId ===
            checkout.reservationDetailId
        ) {
          sur.map((s) => {
            price += s.value;
          });
        }
      });
    });

    setPriceAll(price);
    if (rowSelectionModel.length <= 0) {
      setDiscountPrice(0);
      setPayPrice(0);
      setOtherFeePrice(0);
    }
  }, [rowSelectionModel]);
  const handleOtherFeeChange = (price) => {
    setOtherFeePrice(price);
  };
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
              <h1 className="text-lg pb-10 font-bold">
                <button
                  type="button"
                  className="mr-2 px-2 rounded hover:bg-gray-200"
                  onClick={props.onClose}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                Toạ hoá đơn mới
                <input
                  type="hidden"
                  name="isCreateInvoiceRoom"
                  defaultValue={true}
                />
                <input
                  type="hidden"
                  name="listReservationDetails"
                  value={rowSelectionModel}
                  onChange={() => console.log()}
                />
                <input
                  type="hidden"
                  name="reservationId"
                  value={listCheckout[0].reservation.reservationId}
                  onChange={() => console.log()}
                />
                <input
                  type="hidden"
                  name="total"
                  value={priceAll}
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
                  name="paidMethod"
                  value={payType}
                  onChange={() => console.log()}
                />
              </h1>
              <div className="w-full flex text-sm">
                <div className="w-9/12 pr-4 border-r-2 border-gray-500 border-dotted">
                  <DataGrid
                    className="bg-white"
                    columns={columns}
                    rows={rows}
                    getRowHeight={(params) => {
                      const listInvoices = params.model.listInvoices;
                      const surcharge = listSurchage[params.model.index];
                      let height = 50;
                      if (surcharge.length > 0) {
                        height += surcharge.length * 25;
                      }
                      if (listInvoices) {
                        height += 30;
                        listInvoices.listOrderByReservationDetailId.map(
                          (invoice) => {
                            if (
                              invoice.order.status === "CONFIRMED" ||
                              invoice.order.status === "PAID"
                            ) {
                              height += 25;
                            }
                          }
                        );
                      }
                      return height;
                    }}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                      setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                  />
                </div>
                <div className="w-3/12 ml-4">
                  <div className="flex mt-2">
                    <div className="mr-auto">Tổng tiền</div>
                    <div className="ml-auto">{priceAll.toLocaleString()}</div>
                  </div>
                  <div className="flex mt-2">
                    <div className="my-auto w-6/12">Giảm giá</div>
                    <input
                      className="p-0 text-sm border-0 border-b border-gray-500 text-right w-6/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                      type="text"
                      name="discountPrice"
                      readOnly={rowSelectionModel.length > 0 ? false : true}
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
                        if (rowSelectionModel.length > 0) {
                          setOpenOtherFeeModal(true);
                        }
                      }}
                    >
                      {otherFeePrice.toLocaleString()}
                    </button>
                  </div>
                  <div className="flex mt-4">
                    <div className="mr-auto">Khách cần trả</div>
                    <div className="ml-auto">
                      {(
                        priceAll -
                        discountPrice +
                        otherFeePrice
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex mt-2">
                    <div className="mr-auto my-auto">Khách thanh toán</div>
                    <input
                      className="p-0 text-sm border-0 border-b border-gray-500 text-right w-6/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                      type="text"
                      name="bankAccountNumber"
                      readOnly={rowSelectionModel.length > 0 ? false : true}
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
                    />
                  </div>
                  {payPrice - (priceAll + otherFeePrice - discountPrice) >
                    0 && (
                    <div className="flex mt-2">
                      <div className="mr-auto my-auto">Tiền thừa trả khách</div>
                      <div className="ml-auto">
                        {(
                          payPrice -
                          (priceAll + otherFeePrice - discountPrice)
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
                </div>
              </div>
            </div>
            {rowSelectionModel.length > 0 && (
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
      {selectedInvoice && openDetailsInvoiceModal && (
        <ViewInvoice
          open={openDetailsInvoiceModal}
          onClose={() => setOpenDetailsInvoiceModal(false)}
          invoice={selectedInvoice}
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
      {openNewAccBankModal && (
        <NewAccBankModal
          open={openNewAccBankModal}
          onClose={() => setOpenNewAccBankModal(false)}
          banks={banks}
        />
      )}
    </>
  );
}

export default CreateInvoiceRoomModal;
