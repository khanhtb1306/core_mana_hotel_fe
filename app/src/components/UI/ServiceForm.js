import { Form, redirect } from "react-router-dom";
import Image from "../UI/ImageInput";
import { Fragment, useState } from "react";
import Modal from "./Modal";

function ProductForm({ name, open, onClose, method, product }) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);

  let defautUnit = product.listGoodsUnit.find((unit) => unit.isDefault);

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenDetails(false);
  };

  const handleDetails = () => {
    setOpenInfo(false);
    setOpenDetails(true);
  };

  return (
    product && (
      <Form method={method} onSubmit={onClose} encType="multipart/form-data">
        <Modal open={open} onClose={onClose} size="w-8/12 h-.5/6">
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
                        <h2>Tên dịch vụ</h2>
                      </td>
                      <td className="w-9/12">
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="text"
                          name="goodsName"
                          defaultValue={
                            product.goods.goodsName
                              ? product.goods.goodsName
                              : ""
                          }
                          required
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="ml-auto w-4/12">
                  <tbody>
                    <tr>
                      <td>
                        <h2>Giá vốn</h2>
                      </td>
                      <td>
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="cost"
                          defaultValue={defautUnit ? defautUnit.cost : 0}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h2>Giá bán</h2>
                      </td>
                      <td>
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="price"
                          defaultValue={defautUnit ? defautUnit.price : 0}
                          required
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
                <Image
                  name="image2"
                  src={
                    product.goods.image
                      ? `data:image/png;base64,${product.goods.image}`
                      : null
                  }
                />
                <Image
                  name="image3"
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
                  <label className="my-auto pr-5 text-sm">Đơn vị cơ bản</label>
                  <input
                    className="border-0 border-b border-gray-500 w-40 focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="unit"
                    defaultValue={defautUnit ? defautUnit.goodsUnitName : ""}
                    required
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
                  defaultValue={product.goods.description ? product.goods.description : ""}
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
        </Modal>
      </Form>
    )
  );
}

export default ProductForm;
