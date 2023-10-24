import { Form, redirect } from "react-router-dom";
import Image from "../UI/ImageInput";
import { useState } from "react";
import Modal from "./Modal";
import { axiosConfig } from "../../utils/axiosConfig";

function CategoryRoomForm({ name, open, onClose, method, cateRoom }) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);

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
      <Form method={method} onSubmit={onClose} encType="multipart/form-data">
        <Modal open={open} onClose={onClose} size="w-8/12 h-.5/6">
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
                          defaultValue={
                            cateRoom.roomCategoryName
                              ? cateRoom.roomCategoryName
                              : ""
                          }
                          required
                        />
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
                          defaultValue={
                            cateRoom.numOfAdults ? cateRoom.numOfAdults : 0
                          }
                          min={0}
                          required
                        />
                        Trẻ em
                        <input
                          className="border-0 border-b border-gray-500 w-4/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="numOfChildren"
                          defaultValue={
                            cateRoom.numOfChildren ? cateRoom.numOfChildren : 0
                          }
                          min={0}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="w-3/12">
                        <h2>Diện tích</h2>
                      </td>
                      <td className="w-9/12">
                        <input
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="number"
                          name="roomArea"
                          defaultValue={
                            cateRoom.roomArea ? cateRoom.roomArea : 0
                          }
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
                          defaultValue={
                            cateRoom.priceByHour ? cateRoom.priceByHour : 0
                          } 
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
                          defaultValue={
                            cateRoom.priceByDay ? cateRoom.priceByDay : 0
                          }
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
                          defaultValue={
                            cateRoom.priceByNight ? cateRoom.priceByNight : 0
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
                  name="image"
                  src={
                    cateRoom.image
                      ? `data:image/png;base64,${cateRoom.image}`
                      : null
                  }
                />
                {/* <Image name="image2" />
              <Image name="image3" />
              <Image name="image4" />
              <Image name="image5" /> */}
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
        </Modal>
      </Form>
    )
  );
}

export default CategoryRoomForm;