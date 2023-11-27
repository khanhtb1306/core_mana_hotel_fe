import { Form, redirect, useLoaderData } from "react-router-dom";
import Image from "../UI/ImageInput";
import { useState } from "react";
import Modal from "./Modal";
import { axiosConfig } from "../../utils/axiosConfig";

function CategoryRoomForm({
  name,
  open,
  onClose,
  method,
  cateRoom,
  categories,
}) {
  // console.log(categories);
  const [openInfo, setOpenInfo] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);
  const [formData, setFormData] = useState({
    roomCategoryName: cateRoom.roomCategoryName
      ? cateRoom.roomCategoryName
      : "",
    numOfAdults: cateRoom.numOfAdults ? cateRoom.numOfAdults : 0,
    numOfChildren: cateRoom.numOfChildren ? cateRoom.numOfChildren : 0,
    numMaxOfAdults: cateRoom.numMaxOfAdults ? cateRoom.numMaxOfAdults : 0,
    numMaxOfChildren: cateRoom.numMaxOfChildren ? cateRoom.numMaxOfChildren : 0,
    priceByHour: cateRoom.priceByHour ? cateRoom.priceByHour : 0,
    priceByDay: cateRoom.priceByDay ? cateRoom.priceByDay : 0,
    priceByNight: cateRoom.priceByNight ? cateRoom.priceByNight : 0,
  });
  const [roomCategoryName, setRoomCategoryName] = useState(
    cateRoom.roomCategoryName ? cateRoom.roomCategoryName : ""
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value),
    });
  }

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenDetails(false);
  };

  const handleDetails = () => {
    setOpenInfo(false);
    setOpenDetails(true);
  };

  return (
    cateRoom && (
      <Form
        method={method}
        onSubmit={() => {
          onClose();
        }}
        encType="multipart/form-data"
      >
        <Modal open={open} onClose={onClose} button={true} size="w-8/12 h-.5/6">
          <div className="p-2 w-full">
            <div>
              <h1 className="text-lg pb-5 font-bold">{name}</h1>
              <div className="flex w-5/12">
                <div className="w-6/12">
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
                <div className="w-6/12">
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
                <table className="ml-auto w-7/12 mr-5">
                  <tbody>
                    {method === "put" && (
                      <tr>
                        <td className="w-3/12">
                          <h2>Mã hạng phòng</h2>
                        </td>
                        <td className="w-9/12">
                          <input
                            readOnly
                            className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                            type="text"
                            name="roomCategoryId"
                            defaultValue={
                              cateRoom.roomCategoryId
                                ? cateRoom.roomCategoryId
                                : ""
                            }
                          />
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="w-3/12">
                        <h2>Tên hạng phòng</h2>
                      </td>
                      <td className="w-9/12">
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="text"
                          name="roomCategoryName"
                          value={roomCategoryName}
                          onChange={(e) => {
                            setRoomCategoryName(e.target.value);
                          }}
                          onInvalid={(e) => {
                            if (e.target.value === "") {
                              e.target.setCustomValidity(
                                "Không được để trống tên hạng phòng"
                              );
                            } else {
                              e.target.setCustomValidity("");
                            }
                          }}
                          required
                        />
                        {categories.find(
                          (cate) =>
                            cate.roomCategory.roomCategoryName ===
                            roomCategoryName
                        ) &&
                          roomCategoryName !== cateRoom.roomCategoryName && (
                            <div className="text-red-500 text-sm">
                              Tên hạng phòng không thể bị trùng
                            </div>
                          )}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-3/12">
                        <h2>Sức chứa</h2>
                      </td>
                      <td className="w-9/12">
                        Người lớn
                        <input
                          className="border-0 border-b border-gray-500 w-4/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="numOfAdults"
                          value={formData.numOfAdults}
                          min={1}
                          onInvalid={(e) => {
                            if (e.target.value < 1) {
                              e.target.setCustomValidity(
                                "Số lượng người lớn > 0"
                              );
                            } else {
                              e.target.setCustomValidity("");
                            }
                          }}
                          onChange={handleChange}
                          required
                        />
                        Trẻ em
                        <input
                          className="border-0 border-b border-gray-500 w-4/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="numOfChildren"
                          value={formData.numOfChildren}
                          min={1}
                          onInvalid={(e) => {
                            if (e.target.value < 1) {
                              e.target.setCustomValidity("Số lượng trẻ em > 0");
                            } else {
                              e.target.setCustomValidity("");
                            }
                          }}
                          onChange={handleChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="w-3/12">
                        <h2>Sức chứa tối đa</h2>
                      </td>
                      <td className="w-9/12">
                        Người lớn
                        <input
                          className="border-0 border-b border-gray-500 w-4/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="numMaxOfAdults"
                          value={formData.numMaxOfAdults}
                          onInvalid={(e) => {
                            if (e.target.value < formData.numOfAdults) {
                              e.target.setCustomValidity(
                                "Số lượng người lớn tối đa >= " +
                                  formData.numOfAdults
                              );
                            } else {
                              e.target.setCustomValidity("");
                            }
                          }}
                          min={formData.numOfAdults}
                          onChange={handleChange}
                          required
                        />
                        Trẻ em
                        <input
                          className="border-0 border-b border-gray-500 w-4/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="numMaxOfChildren"
                          value={formData.numMaxOfChildren}
                          onInvalid={(e) => {
                            if (e.target.value < formData.numOfChildren) {
                              e.target.setCustomValidity(
                                "Số lượng trẻ em tối đa >= " +
                                  formData.numOfAdults
                              );
                            } else {
                              e.target.setCustomValidity("");
                            }
                          }}
                          min={formData.numOfChildren}
                          onChange={handleChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="w-3/12">
                        <h2>
                          Diện tích (m<sup>2</sup>)
                        </h2>
                      </td>
                      <td className="w-9/12">
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="roomArea"
                          defaultValue={
                            cateRoom.roomArea ? cateRoom.roomArea : 1
                          }
                          min={1}
                          required
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="ml-auto w-5/12">
                  <tbody>
                    <tr>
                      <td>
                        <h2>Giá theo giờ</h2>
                      </td>
                      <td>
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="priceByHour"
                          value={formData.priceByHour}
                          onChange={handleChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h2>Giá theo ngày</h2>
                      </td>
                      <td>
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="priceByDay"
                          value={formData.priceByDay}
                          min={formData.priceByNight}
                          onChange={handleChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h2>Giá theo đêm</h2>
                      </td>
                      <td>
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="priceByNight"
                          value={formData.priceByNight}
                          min={formData.priceByHour}
                          onChange={handleChange}
                          required
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-8 w-full focus:border-b-2 focus:border-green-500 focus:ring-0">
                <Image
                  name="image"
                  src={
                    cateRoom.image
                      ? `data:image/png;base64,${cateRoom.image}`
                      : null
                  }
                />
              </div>
            </div>
            <div className={`mt-10 ${openDetails ? "" : "hidden"}`}>
              <h2 className="px-4 py-2 bg-gray-200">Mô tả</h2>
              <textarea
                className="textarea border-0 textarea-lg w-full h-40 max-h-40"
                name="description"
                defaultValue={cateRoom ? cateRoom.description : ""}
              ></textarea>
            </div>
          </div>
          <div className="flex pt-5">
            <div className="ml-auto">
              <button
                className="bg-green-500 mr-10 py-2 px-6 text-white rounded hover:bg-green-600"
                disabled={
                  categories.find(
                    (cate) =>
                      cate.roomCategory.roomCategoryName === roomCategoryName
                  ) && roomCategoryName !== cateRoom.roomCategoryName
                }
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

export default CategoryRoomForm;
