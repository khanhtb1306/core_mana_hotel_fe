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
                          defaultValue={
                            cateRoom.roomCapacity ? cateRoom.roomCapacity : ""
                          }
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
                            cateRoom.roomArea ? cateRoom.roomArea : ""
                          }
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
                            cateRoom.priceByHour ? cateRoom.priceByHour : ""
                          }
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
                            cateRoom.priceByDay ? cateRoom.priceByDay : ""
                          }
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
                            cateRoom.priceByNight ? cateRoom.priceByNight : ""
                          }
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

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  if (data.get("floorName")) {
    const formData = {
      floorName: data.get("floorName"),
      status: 1,
    };
    const response = await axiosConfig.post("Floor", formData).catch((e) => {
      console.log(e);
    });
    console.log(response);
    return redirect("/manager/categoryRoomManagement");
  }
  const formData = new FormData();
  if (data.get("roomName")) {
    formData.append("roomName", data.get("roomName"));
    formData.append("roomCategoryId", data.get("roomCategoryId"));
    formData.append("floorId", data.get("floorId"));
    formData.append("status", 1);
    formData.append("bookingStatus", 0);
    formData.append("conditionStatus", 0);
    formData.append("note", data.get("note"));
    formData.append("image", data.get("image"));
    if (method === "POST") {
      const response = await axiosConfig
        .post("room", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(response);
    }
    return redirect("/manager/categoryRoomManagement");
  }
  formData.append("roomCategoryName", data.get("roomCategoryName"));
  formData.append("roomCapacity", data.get("roomCapacity"));
  formData.append("roomArea", data.get("roomArea"));
  formData.append("priceByHour", data.get("priceByHour"));
  formData.append("priceByDay", data.get("priceByDay"));
  formData.append("priceByNight", data.get("priceByNight"));
  formData.append("status", 1);
  formData.append("description", data.get("description"));
  formData.append("image", data.get("image"));

  if (method === "POST") {
    const response = await axiosConfig
      .post("room-class", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(response);
  }
  if (method === "PUT") {
    console.log(data.get("roomCategoryId"));
    const response = await axiosConfig
      .put("room-class/" + data.get("roomCategoryId"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(response);
  }
  if (method === "DELETE") {
    const dataArray = data.get("roomCategoryId").split(",");
    dataArray.map(async (id) => {
      const response = await axiosConfig
        .delete("room-class/" + id)
        .catch((e) => {
          console.log(e);
        });
      console.log(response);
    });
  }

  return redirect("/manager/categoryRoomManagement");
}