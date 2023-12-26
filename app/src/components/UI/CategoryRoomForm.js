import { Form, redirect, useLoaderData } from "react-router-dom";
import Image from "../UI/ImageInput";
import { useState } from "react";
import Modal from "./Modal";
import Swal from "sweetalert2";
import { axiosConfig } from "../../utils/axiosConfig";

function CategoryRoomForm({
  name,
  open,
  onClose,
  method,
  cateRoom,
  categories,
}) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);
  const [formData, setFormData] = useState({
    roomCategoryName: cateRoom.roomCategoryName
      ? cateRoom.roomCategoryName
      : "",
    numOfAdults: cateRoom.numOfAdults ? cateRoom.numOfAdults : 1,
    numOfChildren: cateRoom.numOfChildren ? cateRoom.numOfChildren : 0,
    numMaxOfAdults: cateRoom.numMaxOfAdults ? cateRoom.numMaxOfAdults : 1,
    numMaxOfChildren: cateRoom.numMaxOfChildren ? cateRoom.numMaxOfChildren : 0,
    roomArea: cateRoom.roomArea ? cateRoom.roomArea : 20,
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

  let check = false;

  if (
    roomCategoryName.trim() === "" ||
    (categories.find(
      (cate) => cate.roomCategory.roomCategoryName === roomCategoryName
    ) &&
      roomCategoryName !== cateRoom.roomCategoryName) ||
    isNaN(formData.numOfAdults) ||
    isNaN(formData.numOfChildren) ||
    formData.numOfAdults < 1 ||
    formData.numOfChildren < 0 ||
    isNaN(formData.numMaxOfAdults) ||
    isNaN(formData.numMaxOfChildren) ||
    formData.numOfAdults > formData.numMaxOfAdults ||
    formData.numOfChildren > formData.numMaxOfChildren ||
    isNaN(formData.roomArea) ||
    formData.roomArea < 1 ||
    isNaN(formData.priceByHour) ||
    isNaN(formData.priceByDay) ||
    isNaN(formData.priceByNight) ||
    formData.priceByHour < 0 ||
    formData.priceByDay < 0 ||
    formData.priceByNight < 0 ||
    formData.priceByHour >= formData.priceByDay ||
    formData.priceByHour >= formData.priceByNight ||
    formData.priceByNight >= formData.priceByDay
  ) {
    check = false;
  } else {
    check = true;
  }

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
                        <h2><span className="text-red-500">*</span> Tên hạng phòng</h2>
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
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="w-3/12">
                        <h2><span className="text-red-500">*</span> Sức chứa</h2>
                      </td>
                      <td className="w-9/12">
                        Người lớn
                        <input
                          className="border-0 border-b border-gray-500 w-4/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="numOfAdults"
                          value={formData.numOfAdults}
                          onChange={handleChange}
                        />
                        Trẻ em
                        <input
                          className="border-0 border-b border-gray-500 w-4/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="numOfChildren"
                          value={formData.numOfChildren}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="w-3/12">
                        <h2><span className="text-red-500">*</span> Sức chứa tối đa</h2>
                      </td>
                      <td className="w-9/12">
                        Người lớn
                        <input
                          className="border-0 border-b border-gray-500 w-4/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="numMaxOfAdults"
                          value={formData.numMaxOfAdults}
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
                          min={formData.numOfChildren}
                          onChange={handleChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="w-3/12">
                        <h2>
                        <span className="text-red-500">*</span> Diện tích (m<sup>2</sup>)
                        </h2>
                      </td>
                      <td className="w-9/12">
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="roomArea"
                          value={formData.roomArea}
                          onChange={handleChange}
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
                        <h2><span className="text-red-500">*</span> Giá theo giờ</h2>
                      </td>
                      <td>
                        <input
                          className="text-right border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
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
                        <h2><span className="text-red-500">*</span> Giá theo ngày</h2>
                      </td>
                      <td>
                        <input
                          className="text-right border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="priceByDay"
                          value={formData.priceByDay}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h2><span className="text-red-500">*</span> Giá theo đêm</h2>
                      </td>
                      <td>
                        <input
                          className="text-right border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="priceByNight"
                          value={formData.priceByNight}
                          onChange={handleChange}
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
                type={check ? `` : `button`}
                className="bg-green-500 mr-10 py-2 px-6 text-white rounded hover:bg-green-600"
                onClick={() => {
                  if (!check) {
                    let message = "";
                    if (roomCategoryName.trim() === "") {
                      message = "Không được để trống tên hạng phòng";
                    } else if (
                      categories.find(
                        (cate) =>
                          cate.roomCategory.roomCategoryName ===
                          roomCategoryName
                      ) &&
                      roomCategoryName !== cateRoom.roomCategoryName
                    ) {
                      message = "Không được để trùng tên với hạng phòng khác";
                    } else if (
                      isNaN(formData.numOfAdults) ||
                      isNaN(formData.numOfChildren)
                    ) {
                      message = "Không được để trống sức chứa";
                    } else if (formData.numOfAdults < 1) {
                      message = "Sức chứa người lớn phải lớn hơn 1";
                    } else if (formData.numOfChildren < 0) {
                      message = "Sức chứa trẻ em phải lớn hơn 0";
                    } else if (
                      isNaN(formData.numMaxOfAdults) ||
                      isNaN(formData.numMaxOfChildren)
                    ) {
                      message = "Không được để trống sức chứa tối đa";
                    } else if (formData.numOfAdults > formData.numMaxOfAdults) {
                      message =
                        "Sức chứa người lớn tối đa phải lớn hơn hoặc bằng sức chứa người lớn";
                    } else if (
                      formData.numOfChildren > formData.numMaxOfChildren
                    ) {
                      message =
                        "Sức chứa trẻ em tối đa phải lớn hơn hoặc bằng sức chứa trẻ em";
                    } else if (isNaN(formData.roomArea)) {
                      message = "Không được để trống diện tích";
                    } else if (formData.roomArea < 1) {
                      message = "Điện tích hạng phòng phải lớn hơn 0";
                    } else if (
                      isNaN(formData.priceByHour) ||
                      isNaN(formData.priceByDay) ||
                      isNaN(formData.priceByNight)
                    ) {
                      message = "Không được để trống giá tiền";
                    } else if (
                      formData.priceByHour < 0 ||
                      formData.priceByDay < 0 ||
                      formData.priceByNight < 0
                    ) {
                      message = "Giá hạng phòng phòng phải lớn hơn 0";
                    } else if (formData.priceByHour >= formData.priceByDay) {
                      message = "Giá theo ngày phải lớn hơn giá theo giờ";
                    } else if (formData.priceByHour >= formData.priceByNight) {
                      message = "Giá theo đêm phải lớn hơn giá theo giờ";
                    } else if (formData.priceByNight >= formData.priceByDay) {
                      message = "Giá theo ngày phải lớn hơn giá theo đêm";
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

export default CategoryRoomForm;
