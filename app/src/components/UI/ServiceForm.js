import { Form, redirect, useLoaderData } from "react-router-dom";
import Image from "../UI/ImageInput";
import { Fragment, useState } from "react";
import Modal from "./Modal";
import Swal from "sweetalert2";

function ProductForm({ name, open, onClose, method, product }) {
  const { products } = useLoaderData();
  const [openInfo, setOpenInfo] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);

  let defautUnit = product.listGoodsUnit.find((unit) => unit.isDefault);
  const [serviceName, setServiceName] = useState(
    product.goods.goodsName ? product.goods.goodsName : ""
  );
  const [price, setPrice] = useState(defautUnit ? defautUnit.price : 0);
  const [unit, setUnit] = useState(defautUnit ? defautUnit.goodsUnitName : "");

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenDetails(false);
  };

  const handleDetails = () => {
    setOpenInfo(false);
    setOpenDetails(true);
  };

  let check = false;

  if (
    serviceName.trim() === "" ||
    (products.find((pro) => pro.goods.goodsName === serviceName) &&
      serviceName !== product.goods.goodsName) ||
    isNaN(price) ||
    price < 0 ||
    unit.trim() === ""
  ) {
    check = false;
  } else {
    check = true;
  }

  return (
    product && (
      <Form method={method} onSubmit={onClose} encType="multipart/form-data">
        <Modal open={open} onClose={onClose} size="w-8/12 h-.5/6" button={true}>
          <div className="p-2 w-full">
            <div>
              <h1 className="text-lg pb-5 font-bold">{name}</h1>
              <div className="flex w-5/12">
                <div className="w-5/12">
                  <button
                    type="button"
                    className={`border-0 border-b border-gray-500 w-full ${
                      openInfo ? "border-b-2 border-green-500 ring-0" : ""
                    }`}
                    onClick={handleInfo}
                  >
                    Thông tin
                  </button>
                </div>
                <div className="w-7/12">
                  <button
                    type="button"
                    className={`border-0 border-b border-gray-500 w-full ${
                      openDetails ? "border-b-2 border-green-500 ring-0" : ""
                    }`}
                    onClick={handleDetails}
                  >
                    Mô tả chi tiết
                  </button>
                </div>
              </div>
            </div>
            <div className={`${openInfo ? "" : "hidden"}`}>
              <div className="flex w-full">
                <table className="ml-auto w-8/12 mr-5">
                  <tbody>
                    {product.goods.goodsId && (
                      <tr>
                        <td className="w-3/12">
                          <h2>Mã dịch vụ</h2>
                        </td>
                        <td className="w-9/12">
                          <input
                            readOnly
                            className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                            type="text"
                            name="goodsId"
                            defaultValue={
                              product.goods.goodsId ? product.goods.goodsId : ""
                            }
                          />
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="w-3/12">
                        <h2><span className="text-red-500">*</span> Tên dịch vụ</h2>
                      </td>
                      <td className="w-9/12">
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="text"
                          name="goodsName"
                          value={serviceName}
                          onChange={(event) =>
                            setServiceName(event.target.value)
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="ml-auto w-4/12">
                  <tbody>
                    <tr>
                      <td>
                        <h2><span className="text-red-500">*</span> Giá bán</h2>
                      </td>
                      <td>
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="price"
                          value={price}
                          onChange={(event) => setPrice(event.target.value)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-8 w-full focus:border-b-2 focus:border-green-500 focus:ring-0">
                <Image
                  name="image1"
                  src={
                    product.goods.image
                      ? `data:image/png;base64,${product.goods.image}`
                      : null
                  }
                />
              </div>
              <div>
                <h2 className="px-4 py-2 bg-gray-200">Đơn vị tính</h2>
                <div className="flex m-2">
                  <label className="my-auto pr-5 text-sm"><span className="text-red-500">*</span> Đơn vị cơ bản</label>
                  <input
                    className="border-0 border-b border-gray-500 w-40 focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="unit"
                    value={unit}
                    onChange={(event) => setUnit(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={`${openDetails ? "" : "hidden"} mt-10`}>
              <div>
                <h2 className="px-4 py-2 bg-gray-200">Mô tả</h2>
                <textarea
                  className="textarea border-0 textarea-lg w-full h-40 max-h-40"
                  name="description"
                  defaultValue={
                    product.goods.description ? product.goods.description : ""
                  }
                ></textarea>
              </div>
              <div>
                <h2 className="px-4 py-2 bg-gray-200">Ghi chú</h2>
                <textarea
                  className="textarea border-0 textarea-lg w-full h-40 max-h-40"
                  name="note"
                  defaultValue={product.goods.note ? product.goods.note : ""}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex pt-5">
            <div className="ml-auto">
              <button
                type={check ? `` : `button`}
                className="bg-green-500 mr-10 py-2 px-6 text-white rounded hover:bg-green-600"
                onClick={() => {
                  if (!check) {
                    let message = "";
                    if (serviceName.trim() === "") {
                      message = "Không được để trống tên dịch vụ";
                    } else if (
                      products.find(
                        (pro) => pro.goods.goodsName === serviceName
                      ) &&
                      serviceName !== product.goods.goodsName
                    ) {
                      message = "Không được để trùng tên với dịch vụ khác";
                    } else if (isNaN(price)) {
                      message = "Không được để trống giá";
                    } else if (price < 0) {
                      message = "Giá dịch vụ không được âm";
                    } else if (unit.trim() === "") {
                      message = "Không được để trống tên đơn vị";
                    }
                    Swal.fire({
                      position: "bottom",
                      html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">${message}</button>`,
                      showConfirmButton: false,
                      background: "transparent",
                      backdrop: "none",
                      timer: 2000,
                    });
                  }
                }}
              >
                Lưu
              </button>
              <button
                type="button"
                className="bg-gray-400 py-2 px-6 text-white rounded hover:bg-gray-500"
                onClick={() => {
                  onClose();
                }}
              >
                Bỏ qua
              </button>
            </div>
          </div>
        </Modal>
      </Form>
    )
  );
}

export default ProductForm;
