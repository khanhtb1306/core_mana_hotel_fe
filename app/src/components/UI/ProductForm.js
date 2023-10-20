import { Form, redirect } from "react-router-dom";
import Image from "../UI/ImageInput";
import { Fragment, useState } from "react";
import Modal from "./Modal";

function ProductForm({ name, open, onClose, method, product }) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);

  let defautUnit = product.listGoodsUnit.find((unit) => unit.isDefault);
  let newUnits = [];
  if (product.listGoodsUnit.length > 1) {
    const listUnit = product.listGoodsUnit.filter((unit) => !unit.isDefault);
    newUnits = listUnit.map((unit, index) => {
      const exchange = (product.goods.inventory * defautUnit.cost) / unit.cost;
      return {
        id: index,
        jsx: (
          <tr key={index}>
            <td className="w-3/12">
              <input
                className="border-0 border-b border-gray-500 w-8/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                type="text"
                name={`unit${index}`}
                defaultValue={unit.goodsUnitName ? unit.goodsUnitName : ""}
              />
            </td>
            <td className="w-3/12">
              <input
                className="border-0 border-b border-gray-500 w-8/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                type="number"
                name={`amount${index}`}
                defaultValue={exchange ? exchange : 0}
              />
            </td>
            <td className="w-3/12">
              <input
                className="border-0 border-b border-gray-500 w-8/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                type="number"
                name={`price${index}`}
                defaultValue={unit.price ? unit.price : 0}
              />
            </td>
            <td className="w-3/12">
              <button
                type="button"
                className="p-2"
                onClick={() => handleUnitDelete(index)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        ),
      };
    });
    // setUnits([...units, ...newUnits]);
  }
  const [units, setUnits] = useState(newUnits);

  const handleUnitDelete = (id) => {
    const updatedUnits = units.filter((unit) => unit.id !== id);
    setUnits(updatedUnits);
  };

  const handleUnitAdd = () => {
    setUnits([
      ...units,
      {
        id: units.length,
        jsx: (
          <tr key={units.length}>
            <td className="w-3/12">
              <input
                className="border-0 border-b border-gray-500 w-8/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                type="text"
                name={`unit${units.length}`}
              />
            </td>
            <td className="w-3/12">
              <input
                className="border-0 border-b border-gray-500 w-8/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                type="number"
                name={`amount${units.length}`}
              />
            </td>
            <td className="w-3/12">
              <input
                className="border-0 border-b border-gray-500 w-8/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                type="number"
                name={`price${units.length}`}
              />
            </td>
            <td className="w-3/12">
              <button
                type="button"
                className="p-2"
                onClick={() => handleUnitDelete(units.length)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        ),
      },
    ]);
  };

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
                          <h2>Mã hàng hoá</h2>
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
                        <h2>Tên hàng hoá</h2>
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
                    <tr>
                      <td>
                        <h2>Định mức tồn</h2>
                      </td>
                      <td>
                        Ít nhất
                        <input
                          className="border-0 border-b border-gray-500 w-4/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="minInventory"
                          defaultValue={
                            product.goods.minInventory
                              ? product.goods.minInventory
                              : 0
                          }
                          min={0}
                          required
                        />
                        Nhiều nhất
                        <input
                          className="border-0 border-b border-gray-500 w-4/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="maxInventory"
                          defaultValue={
                            product.goods.maxInventory
                              ? product.goods.maxInventory
                              : 10000
                          }
                          min={0}
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
                    <tr>
                      <td>
                        <h2>Tồn kho</h2>
                      </td>
                      <td>
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="inventory"
                          defaultValue={
                            product.goods.inventory
                              ? product.goods.inventory
                              : 0
                          }
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
                {units.length > 0 && (
                  <table className="text-sm text-left p-2">
                    <tbody>
                      <tr>
                        <th className="w-3/12">Tên đơn vị</th>
                        <th className="w-3/12">Giá trị quy đổi</th>
                        <th className="w-3/12">Giá bán</th>
                        <th className="w-3/12"></th>
                      </tr>
                      {units.map((unit) => (
                        <Fragment key={unit.id}>{unit.jsx}</Fragment>
                      ))}
                    </tbody>
                  </table>
                )}

                <div
                  className="rounded border py-2 px-4 w-40 m-2"
                  onClick={handleUnitAdd}
                >
                  <i className="fa-solid fa-plus pr-2"></i> Thêm đơn vị
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
        </Modal>
      </Form>
    )
  );
}

export default ProductForm;
