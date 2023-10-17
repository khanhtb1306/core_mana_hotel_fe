import { Form, redirect } from "react-router-dom";
import Image from "../UI/ImageInput";
import { useState } from "react";
import Modal from "./Modal";
import { axiosConfig } from "../../utils/axiosConfig";

function CategoryRoomForm({ open, onClose, method, cateRoom }) {
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
    <Form method={method} encType="multipart/form-data">
      <Modal open={open} onClose={onClose} size="w-8/12 h-.5/6">
        <div className="p-2 w-full">
          <div>
            <h1 className="text-lg pb-5 font-bold">Thêm hạng phòng mới</h1>
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
                  <tr>
                    <td className="w-3/12">
                      <h2>Tên hạng phòng</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="roomCategoryName"
                        defaultValue={cateRoom ? cateRoom.roomCategoryName : ""}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Sức chứa</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="number"
                        name="roomCapacity"
                        defaultValue={cateRoom ? cateRoom.roomCapacity : ""}
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
                        defaultValue={cateRoom ? cateRoom.roomArea : ""}
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
                        defaultValue={cateRoom ? cateRoom.priceByHour : ""}
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
                        defaultValue={cateRoom ? cateRoom.priceByDay : ""}
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
                        defaultValue={cateRoom ? cateRoom.priceByNight : ""}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="flex">
                      <div className="ml-auto mt-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          name="status"
                          checked={
                            cateRoom
                              ? cateRoom.status === 1
                                ? true
                                : false
                              : true
                          }
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            e.target.value = isChecked ? 1 : 0;
                          }}
                          value={cateRoom ? cateRoom.status : 1}
                          className="p-2 mr-2 focus:ring-green-200 text-green-500 ml-5"
                        />
                        <label htmlFor="isActive">Hoạt động</label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-8 w-full focus:border-b-2 focus:border-green-500 focus:ring-0">
              <Image name="image" />
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
  );
}

export default CategoryRoomForm;

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const formData = new FormData();
  formData.append("roomCategoryName", data.get("roomCategoryName"));
  formData.append("roomCapacity", data.get("roomCapacity"));
  formData.append("roomArea", data.get("roomArea"));
  formData.append("priceByHour", data.get("priceByHour"));
  formData.append("priceByDay", data.get("priceByDay"));
  formData.append("priceByNight", data.get("priceByNight"));
  formData.append("status", data.get("status"));
  formData.append("description", data.get("description"));
  formData.append("image", data.get("image"));

  let url = "room-class";

  if (method === "PATCH") {
    url = "room-class/" + data.get("roomCategoryId");
  }

  const response = await axiosConfig
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .catch((e) => {
      console.log(e);
    });

  console.log(response);

  return redirect("/manager/categoryRoomManagement");
}
