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
  let newUnits = [];
  if (product.listGoodsUnit.length > 1) {
    const listUnit = product.listGoodsUnit.filter((unit) => !unit.isDefault);
    newUnits = listUnit.map((unit, index) => {
      const exchange = unit.cost / defautUnit.cost;
      return {
        goodsUnitId: unit.goodsUnitId,
        goodsUnitName: unit.goodsUnitName,
        exchange: exchange,
        price: unit.price,
      };
    });
  }
  const [formData, setFormData] = useState({
    minInventory: product.goods.minInventory ? product.goods.minInventory : 100,
    maxInventory: product.goods.maxInventory
      ? product.goods.maxInventory
      : 1000,
    cost: defautUnit ? defautUnit.cost : 0,
    price: defautUnit ? defautUnit.price : 0,
  });
  const [productName, setProductName] = useState(
    product.goods.goodsName ? product.goods.goodsName : ""
  );
  const [unit, setUnit] = useState(defautUnit ? defautUnit.goodsUnitName : "");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value),
    });
  }
  const [units, setUnits] = useState(newUnits);

  const handleAddUnit = () => {
    const newUnit = {
      goodsUnitName: "",
      exchange: 2,
      price: 0,
    };
    setUnits([...units, newUnit]);
  };

  const handleUnitDelete = (index) => {
    const updatedUnits = units.filter((_, i) => i !== index);
    setUnits(updatedUnits);
  };

  const handleInputValue = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const index = parseInt(name.match(/\d+/)[0], 10);
    if (name.includes("unit")) {
      const updatedUnits = [...units];
      updatedUnits[index].goodsUnitName = value;
      setUnits(updatedUnits);
    }
    if (name.includes("amount")) {
      const updatedUnits = [...units];
      updatedUnits[index].exchange = value;
      setUnits(updatedUnits);
    }
    if (name.includes("price")) {
      const updatedUnits = [...units];
      updatedUnits[index].price = value;
      setUnits(updatedUnits);
    }
  };

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
    productName.trim() === "" ||
    (products.find((product) => product.goods.goodsName === productName) &&
      productName !== product.goods.goodsName) ||
    isNaN(formData.minInventory) ||
    isNaN(formData.maxInventory) ||
    formData.minInventory < 0 ||
    formData.maxInventory < formData.minInventory ||
    isNaN(formData.cost) ||
    isNaN(formData.price) ||
    formData.cost < 0 ||
    formData.price < formData.cost ||
    unit.trim() === "" ||
    units.some((unit) => unit.goodsUnitName.trim() === "") ||
    units.find((uni) => uni.goodsUnitName.trim() === unit.trim()) ||
    units.some((unit) => unit.exchange < 2) ||
    units.some((unit) => unit.price < formData.cost * unit.exchange)
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
                <input
                  readOnly
                  hidden
                  type="number"
                  name="numberUnit"
                  value={units.length}
                  onChange={handleInputValue}
                />
                <input
                  readOnly
                  hidden
                  type="number"
                  name="categoryGoods"
                  value={1}
                />
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
                            defaultValue={product.goods.goodsId}
                          />
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="w-3/12">
                        <h2>
                          <span className="text-red-500">*</span> Tên hàng hoá
                        </h2>
                      </td>
                      <td className="w-9/12">
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="text"
                          name="goodsName"
                          value={productName}
                          onChange={(event) =>
                            setProductName(event.target.value)
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h2>
                          <span className="text-red-500">*</span> Định mức tồn
                        </h2>
                      </td>
                      <td>
                        Ít nhất
                        <input
                          className="border-0 border-b border-gray-500 w-4/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="minInventory"
                          value={formData.minInventory}
                          onChange={handleChange}
                        />
                        Nhiều nhất
                        <input
                          className="border-0 border-b border-gray-500 w-4/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="maxInventory"
                          value={formData.maxInventory}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="ml-auto w-4/12">
                  <tbody>
                    <tr>
                      <td>
                        <h2>
                          <span className="text-red-500">*</span> Giá vốn
                        </h2>
                      </td>
                      <td>
                        <input
                          className="text-right border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="cost"
                          value={formData.cost}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h2>
                          <span className="text-red-500">*</span> Giá bán
                        </h2>
                      </td>
                      <td>
                        <input
                          className="text-right border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
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
                  <label className="my-auto pr-5 text-sm">
                    <span className="text-red-500">*</span> Đơn vị cơ bản
                  </label>
                  <input
                    className="border-0 border-b border-gray-500 w-40 focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="unit"
                    value={unit}
                    onChange={(event) => setUnit(event.target.value)}
                  />
                </div>
                {units.length > 0 && (
                  <table className="text-sm text-left p-2">
                    <tbody>
                      <tr>
                        <th className="w-3/12">
                          <span className="text-red-500">*</span> Tên đơn vị
                        </th>
                        <th className="w-2/12">
                          <span className="text-red-500">*</span> Giá trị quy
                          đổi
                        </th>
                        <th className="w-3/12">Giá vốn</th>
                        <th className="w-3/12">
                          <span className="text-red-500">*</span> Giá bán
                        </th>
                        <th className="w-1/12"></th>
                      </tr>
                      {units.map((unit, index) => (
                        <tr key={index}>
                          <td className="w-3/12">
                            {units[index].goodsUnitId && (
                              <input
                                className="border-0 border-b border-gray-500 w-8/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                                type="hidden"
                                name={`goodsUnitId${index}`}
                                value={units[index].goodsUnitId}
                                index={index}
                                onChange={handleInputValue}
                              />
                            )}
                            <input
                              className="border-0 border-b border-gray-500 w-8/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                              type="text"
                              name={`unit${index}`}
                              value={
                                units[index] ? units[index].goodsUnitName : ""
                              }
                              index={index}
                              onChange={handleInputValue}
                            />
                          </td>
                          <td className="w-2/12">
                            <input
                              className="border-0 border-b border-gray-500 w-8/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                              type="number"
                              name={`amount${index}`}
                              value={units[index] ? units[index].exchange : 2}
                              onChange={handleInputValue}
                            />
                          </td>
                          <td className="w-3/12">
                            <div>
                              {units[index].exchange * formData.cost > 0
                                ? (
                                    units[index].exchange * formData.cost
                                  ).toLocaleString()
                                : 0}
                            </div>
                          </td>
                          <td className="w-3/12">
                            <input
                              className="border-0 border-b border-gray-500 w-8/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                              type="number"
                              name={`price${index}`}
                              value={units[index] ? units[index].price : 2}
                              onChange={handleInputValue}
                            />
                          </td>
                          <td className="w-1/12">
                            <button
                              type="button"
                              className="p-2"
                              onClick={() => handleUnitDelete(index)}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <button
                  type="button"
                  className="rounded border py-2 px-4 w-40 m-2"
                  onClick={handleAddUnit}
                >
                  <i className="fa-solid fa-plus pr-2"></i> Thêm đơn vị
                </button>
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
                    if (productName.trim() === "") {
                      message = "Không được để trống tên hàng hoá";
                    } else if (
                      products.find(
                        (product) => product.goods.goodsName === productName
                      ) &&
                      productName !== product.goods.goodsName
                    ) {
                      message = "Không được để trùng tên với hàng hoá khác";
                    } else if (
                      isNaN(formData.minInventory) ||
                      isNaN(formData.maxInventory)
                    ) {
                      message = "Không được để trống định mức tồn";
                    } else if (formData.minInventory < 0) {
                      message = "Định mức tồn ít nhất phải lớn hơn 0";
                    } else if (formData.maxInventory < formData.minInventory) {
                      message =
                        "Định mức tồn nhiều nhất phải lớn hơn định mức tồn ít nhất";
                    } else if (isNaN(formData.cost) || isNaN(formData.price)) {
                      message = "Không được để trống giá tiền";
                    } else if (formData.cost < 0) {
                      message = "Gíá vốn phải lớn hơn 0";
                    } else if (formData.price < formData.cost) {
                      message = "Gíá bán phải lớn hơn giá vốn";
                    } else if (unit.trim() === "") {
                      message = "Không được để trống đơn vị cơ bản";
                    } else if (
                      units.some((unit) => unit.goodsUnitName.trim() === "")
                    ) {
                      message = "Không được để trống tên đơn vị";
                    } else if (
                      units.find(
                        (uni) => uni.goodsUnitName.trim() === unit.trim()
                      )
                    ) {
                      message =
                        "Đơn vị khác không được trùng với đơn vị cơ bản";
                    } else if (units.some((unit) => unit.exchange < 2)) {
                      message = "Giá trị quy đổi phải lớn hơn 1";
                    } else if (
                      units.some(
                        (unit) => unit.price < formData.cost * unit.exchange
                      )
                    ) {
                      message = "Giá bán phải lớn hơn giá vốn";
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
