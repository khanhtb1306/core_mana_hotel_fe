import { useEffect, useRef, useState } from "react";
import SearchProduct from "../Search/SearchProduct";
import { Form, useActionData, useLoaderData } from "react-router-dom";
import SearchCustomer from "../Search/SearchCustomer";
import {
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import NewAccBankModal from "./NewAccBankModal";
import Swal from "sweetalert2";
import OtherFeeModal from "./OtherFeeModal";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";

function AddRetailInvoice() {
  const { listQR, otherFees, customers, goodsUnit } = useLoaderData();
  const goodsActiveUnit = goodsUnit.filter((unit) => unit.goods.status === 1);
  const actionData = useActionData();
  const printQRRef = useRef();
  const [products, setProducts] = useState([]);
  let priceAll = 0;
  const [customer, setCustomer] = useState(null);
  if (products.length > 0) {
    products.map((pro) => {
      priceAll += pro.price * pro.number;
    });
  }
  const [listFeeIds, setListFeeIds] = useState(
    otherFees
      ? otherFees.LIST_OTHER_REVENUE_DETAIL.filter(
          (fee) => fee.autoAddToInvoice
        ).map((e) => e.policyDetailId)
      : []
  );
  const [isGoods, setIsGoods] = useState(true);
  const productUnit = goodsActiveUnit.filter(
    (unit) => unit.goods.goodsCategory && unit.goods.inventory > 0
  );
  const service = goodsActiveUnit.filter((unit) => !unit.goods.goodsCategory);
  const [banks, setBanks] = useState([]);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openOtherFeeModal, setOpenOtherFeeModal] = useState(false);
  const [otherFeePrice, setOtherFeePrice] = useState(
    otherFees
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
  const [payPrice, setPayPrice] = useState(0);
  const [payType, setPayType] = useState("2");
  const [openNewAccBankModal, setOpenNewAccBankModal] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState(
    listQR.length > 0 ? listQR[0].bankAccountId : 0
  );
  // console.log(discountPrice);

  useEffect(() => {
    async function fetchRoomActive() {
      try {
        if (actionData) {
          //Notify add customer
          if (actionData.addCustomer) {
            if (actionData.addCustomer) {
              setCustomer(
                customers.find(
                  (cus) => cus.customerId === actionData.addCustomer.customerId
                )
              );
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">Thêm thông tin khách hàng thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Thêm thông tin khách hàng thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
          }

          //Notify edit customer
          if (actionData.editCustomer) {
            if (actionData.editCustomer) {
              setCustomer(
                customers.find(
                  (cus) => cus.customerId === actionData.editCustomer.customerId
                )
              );
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">Thêm thông tin khách hàng thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Thêm thông tin khách hàng thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchRoomActive();
  }, [listQR]);

  useEffect(() => {
    fetch("https://api.vietqr.io/v2/banks")
      .then((response) => response.json())
      .then((data) => {
        setBanks(data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleCustomerClick = (customerId) => {
    setCustomer(customers.find((cus) => cus.customerId === customerId));
  };

  const handleCustomerRemove = () => {
    setCustomer(null);
  };

  const handleProductClick = (goodsUnitId) => {
    const index = products.findIndex(
      (unit) => unit.goodsUnitId === goodsUnitId
    );
    if (index !== -1) {
      products[index].number++;
      setProducts([...products]);
    } else {
      const updateProducts = [
        ...products,
        {
          ...goodsActiveUnit.find((unit) => unit.goodsUnitId === goodsUnitId),
          number: 1,
        },
      ];
      setProducts(updateProducts);
    }
  };

  const handleProductDelete = (goodsUnitId) => {
    const updateProducts = products.filter(
      (unit) => unit.goodsUnitId !== goodsUnitId
    );
    setProducts(updateProducts);
  };

  const handleClosePaymentClick = () => {
    setOpenPaymentModal(false);
    setOtherFeePrice(0);
    setPayPrice(0);
    setPayType("2");
  };

  // console.log(products);
  const handleOtherFeeChange = (liseFeeIds, price) => {
    setListFeeIds(liseFeeIds);
    setOtherFeePrice(price);
  };
  const [imageUrl, setImageUrl] = useState("");
  const account = listQR.find((acc) => acc.bankAccountId === selectedAcc);
  const transactionCode = `MGDBL${dayjs().format("YYYYMMDDHHmmss")}`;

  useEffect(() => {
    if (account && payPrice > 0) {
      setImageUrl(
        `https://img.vietqr.io/image/${account.bankId}-${account.bankAccountNumber}-print.jpg?amount=${payPrice}&addInfo=${transactionCode}`
      );
    }
  }, [account, payPrice]);
  const handleQRPrint = useReactToPrint({
    content: () => printQRRef.current,
  });

  const groupDefautProduct = products.reduce((product, cur) => {
    const defaultGood = goodsActiveUnit.find(
      (unit) => unit.isDefault && unit.goods.goodsId === cur.goods.goodsId
    );
    const exchange = cur.cost / defaultGood.cost;
    const exist = product.find(
      (pro) => pro.goods.goodsId === cur.goods.goodsId
    );
    if (exist) {
      return [
        {
          ...exist,
          number: exist.number + exchange * cur.number,
        },
      ];
    } else {
      return [
        ...product,
        {
          ...defaultGood,
          number: exchange * cur.number,
        },
      ];
    }
  }, []);

  let check = false;

  if (
    products.length <= 0 ||
    products.some((product) => product.number <= 0) ||
    groupDefautProduct.some(
      (product) => product.goods.inventory < product.number
    )
  ) {
    check = false;
  } else {
    check = true;
  }

  return (
    <>
      <div className="mx-2 my-2">
        <SearchCustomer
          customers={customers}
          customer={customer}
          handleCustomerClick={handleCustomerClick}
          handleCustomerRemove={handleCustomerRemove}
        />
      </div>
      <Form method="POST">
        <input type="hidden" name="addRetailInvoice" defaultValue={true} />
        <input
          type="hidden"
          name="totalPay"
          value={priceAll}
          onChange={() => 1}
        />
        <input
          type="hidden"
          name="paidMethod"
          value={payType === "1" ? "CASH" : "TRANSFER"}
          onChange={() => 1}
        />
        <input
          type="hidden"
          name="customerId"
          value={customer ? customer.customerId : "C000000"}
          onChange={() => 1}
        />
        <input
          type="hidden"
          name="priceOther"
          value={otherFeePrice}
          onChange={() => 1}
        />
        <input
          type="hidden"
          name="transactionCode"
          value={transactionCode}
          onChange={() => 1}
        />
        <input
          type="hidden"
          name="length"
          value={products.length}
          onChange={() => 1}
        />
        <div className="p-2 h-[40rem] w-full">
          <div className="flex">
            <div className="w-4/12 bg-white rounded-lg p-4">
              <SearchProduct
                goodsUnit={goodsActiveUnit.filter(
                  (unit) =>
                    unit.goods.inventory > 0 || unit.goods.inventory === null
                )}
                handleProductClick={handleProductClick}
              />
              <div className="flex my-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg ${
                    isGoods
                      ? "text-white bg-green-500"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsGoods(true)}
                >
                  Sản phẩm
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg ${
                    isGoods
                      ? "text-gray-600 bg-white hover:bg-gray-100"
                      : "text-white bg-green-500"
                  }`}
                  onClick={() => setIsGoods(false)}
                >
                  Dịch vụ
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                {isGoods ? (
                  <>
                    {productUnit.map((unit) => {
                      return (
                        <button
                          type="button"
                          key={unit.goodsUnitId}
                          className="text-left my-2"
                          onClick={() => handleProductClick(unit.goodsUnitId)}
                        >
                          <div className="flex">
                            <img
                              src={`data:image/png;base64,${unit.goods.image}`}
                              alt={unit.goods.goodsName}
                              className="w-10 h-10"
                            />
                            <div>
                              <p>
                                {unit.goods.goodsName +
                                  " (" +
                                  unit.goodsUnitName +
                                  ")"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {unit.goods.goodsId}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {service.map((unit) => {
                      return (
                        <button
                          type="button"
                          key={unit.goodsUnitId}
                          className="text-left my-2"
                          onClick={() => handleProductClick(unit.goodsUnitId)}
                        >
                          <div className="flex">
                            <img
                              src={`data:image/png;base64,${unit.goods.image}`}
                              alt={unit.goods.goodsName}
                              className="w-10 h-10"
                            />
                            <div>
                              <p>
                                {unit.goods.goodsName +
                                  " (" +
                                  unit.goodsUnitName +
                                  ")"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {unit.goods.goodsId}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
            <div className="w-8/12 mx-5 bg-white overflow-y-auto">
              {products.map((unit, index) => {
                return (
                  <div
                    key={index}
                    className="flex bg-white border border-gray-500 hover:border-green-500 mb-2 rounded p-2 m-2"
                  >
                    <input
                      type="hidden"
                      name={`goodsId${index}`}
                      defaultValue={unit.goods.goodsId}
                    />
                    <input
                      type="hidden"
                      name={`goodsUnitId${index}`}
                      defaultValue={unit.goodsUnitId}
                    />
                    <input
                      type="hidden"
                      name={`price${index}`}
                      defaultValue={unit.price}
                    />
                    <div className="w-4/12">
                      {unit.goods.goodsName + " (" + unit.goodsUnitName + ")"}
                    </div>
                    <div className="w-2/12">
                      <input
                        type="number"
                        className="w-16 border-0 border-b border-gray-500 focus:border-b-2 focus:border-green-500 focus:ring-0"
                        name={`number${index}`}
                        value={unit.number}
                        onChange={(e) => {
                          const index = products.findIndex(
                            (u) => u.goodsUnitId === unit.goodsUnitId
                          );
                          if (index !== -1) {
                            products[index].number = e.target.value;
                            setProducts([...products]);
                          }
                        }}
                        min={1}
                        max={products[index].goods.inventory}
                      />
                    </div>
                    <div className="w-2/12">{unit.price.toLocaleString()}</div>
                    <div className="w-3/12">
                      {(unit.price * unit.number).toLocaleString()}
                    </div>
                    <div className="w-1/12">
                      <button
                        type="button"
                        onClick={() => handleProductDelete(unit.goodsUnitId)}
                      >
                        <i className="fa-solid fa-trash fa-lg"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {openPaymentModal && (
            <div
              onClick={handleClosePaymentClick}
              className={`fixed inset-0 flex justify-center items-center transition-colors overflow-auto z-10 ${
                openPaymentModal ? "visible bg-black/20" : "invisible"
              }`}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white absolute top-0 right-0 rounded-xl shadow p-6 transition-all w-9/12 h-full ${
                  openPaymentModal
                    ? "scale-100 opacity-100"
                    : "scale-125 opacity-0"
                }`}
              >
                <button
                  type="button"
                  onClick={handleClosePaymentClick}
                  className={`absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600`}
                >
                  <i className="fa-solid fa-x"></i>
                </button>
                <div className="p-2 w-full">
                  <h1 className="text-lg pb-10 font-bold">
                    Thanh toán hoá đơn bán lẻ{" "}
                    {customer && " - " + customer.customerName}
                  </h1>

                  <div className="w-full flex text-sm">
                    <div className="w-8/12 pr-4 border-r-2 border-gray-500 border-dotted overflow-y-auto h-[41.5rem]">
                      <table className="text-right min-w-full divide-y divide-gray-300">
                        <thead className="bg-green-200">
                          <tr className="border border-black">
                            <th className="px-4 py-2 w-6/12 text-left">
                              Sản phẩm/Dịch vụ
                            </th>
                            <th className="px-4 py-2 w-2/12 text-center">
                              Số lượng
                            </th>
                            <th className="px-4 py-2 w-2/12">Đơn giá</th>
                            <th className="px-4 py-2 w-2/12">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((pro, index) => {
                            return (
                              <tr className="border border-black">
                                <td className="px-4 py-2 w-6/12 text-left">
                                  {index + 1}.{" "}
                                  <span className="font-bold">
                                    {pro.goods.goodsName} ({pro.goodsUnitName})
                                  </span>
                                </td>
                                <td className="px-4 py-2 w-2/12 text-center">
                                  {pro.number}
                                </td>
                                <td className="px-4 py-2 w-2/12">
                                  {pro.price.toLocaleString()}
                                </td>
                                <td className="px-4 py-2 w-2/12">
                                  {(pro.price * pro.number).toLocaleString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="w-4/12 ml-4">
                      <div className="flex mt-2">
                        <div className="mr-auto">Tổng tiền</div>
                        <div className="ml-auto">
                          {priceAll.toLocaleString()}
                        </div>
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
                      <div className="flex mt-4 font-bold">
                        <div className="mr-auto">Khách cần trả</div>
                        <div className="ml-auto text-green-500">
                          {(priceAll + otherFeePrice).toLocaleString()}
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
                      {payPrice - (priceAll + otherFeePrice) > 0 && (
                        <div className="flex mt-2">
                          <div className="mr-auto my-auto">
                            Tiền thừa trả khách
                          </div>
                          <div className="ml-auto">
                            {(
                              payPrice -
                              (priceAll + otherFeePrice)
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
                    </div>
                  </div>
                </div>
                <div className="flex pt-5 absolute bottom-0 right-0">
                  <div className="mr-10 mb-10 ml-auto">
                    <button
                      type={
                        priceAll + otherFeePrice > payPrice ||
                        (payType === "2" && !account)
                          ? "button"
                          : ""
                      }
                      className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
                      onClick={() => {
                        if (priceAll + otherFeePrice > payPrice) {
                          Swal.fire({
                            position: "bottom",
                            html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Khách phải thanh toán đủ tiền!</button>`,
                            showConfirmButton: false,
                            background: "transparent",
                            backdrop: "none",
                            timer: 2500,
                          });
                        } else if (payType === "2" && !account) {
                          Swal.fire({
                            position: "bottom",
                            html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Không có tải khoản để chuyển khoản!</button>`,
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
                  </div>
                </div>
                {openOtherFeeModal && (
                  <OtherFeeModal
                    open={openOtherFeeModal}
                    onClose={() => setOpenOtherFeeModal(false)}
                    listFeeIds={listFeeIds}
                    otherFees={otherFees}
                    invoicePrice={priceAll}
                    changePrice={handleOtherFeeChange}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        {products.length > 0 && (
          <div className="w-full py-2 flex">
            <div className="ml-auto mr-2">
              <button
                type="button"
                className="px-4 py-2 bg-green-500 rounded-lg text-white mr-2 hover:bg-green-600"
                onClick={() => {
                  if (!check) {
                    let message = "";
                    if (products.length <= 0) {
                      message = "Cần thêm hàng hoá hoặc dịnh vụ để tạo đơn";
                    } else if (
                      products.some((product) => product.number <= 0)
                    ) {
                      message = "Số lượng hàng hoá hoặc dịch vụ phải lớn hơn 0";
                    } else if (
                      groupDefautProduct.some(
                        (product) => product.goods.inventory < product.number
                      )
                    ) {
                      message = "Đã quá số lượng trong kho đối với";
                      groupDefautProduct.map((product) => {
                        if (product.goods.inventory < product.number) {
                          message += " " + product.goods.goodsName;
                        }
                      });
                    }
                    Swal.fire({
                      position: "bottom",
                      html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">${message}</button>`,
                      showConfirmButton: false,
                      background: "transparent",
                      backdrop: "none",
                      timer: 2000,
                    });
                  } else {
                    setOpenPaymentModal(true);
                  }
                }}
              >
                Thanh toán {priceAll.toLocaleString()}
              </button>
            </div>
          </div>
        )}
      </Form>
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

export default AddRetailInvoice;
