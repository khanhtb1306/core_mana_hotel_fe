import { Form, redirect } from "react-router-dom";
import Image from "../UI/ImageInput";
import { useState } from "react";
import Modal from "./Modal";
import { axiosConfig } from "../../utils/axiosConfig";
import NewCategoryRoom from "../CategoryRoom/NewCategoryRoom";
import NewArea from "../NewArea";

function RoomForm({ name, open, onClose, method, floors, categories, room }) {
  const [openNewCateRoomModal, setOpenNewCateRoomModal] = useState(false);
  const [openNewAreaModal, setOpenNewAreaModal] = useState(false);
  const defaultCate = categories[0].roomCategory;

  const [inputValues, setInputValues] = useState({
    priceByHour: defaultCate.priceByHour,
    priceByDay: defaultCate.priceByDay,
    priceByNight: defaultCate.priceByNight,
  });

  const optionFloors = floors.map((floor) => {
    return (
      <option key={floor.floorId} value={floor.floorId}>
        {floor.floorName}
      </option>
    );
  });

  const optionCategories = categories.map((cate) => {
    return (
      <option
        key={cate.roomCategory.roomCategoryId}
        value={cate.roomCategory.roomCategoryId}
      >
        {cate.roomCategory.roomCategoryName}
      </option>
    );
  });

  const handlePriceChange = (e) => {
    const category = categories.find(
      (cate) => cate.roomCategory.roomCategoryId === e.target.value
    );
    setInputValues({
      priceByHour: category.roomCategory.priceByHour,
      priceByDay: category.roomCategory.priceByDay,
      priceByNight: category.roomCategory.priceByNight,
    });
  };

  return (
    <>
      <Form method={method} onSubmit={onClose} encType="multipart/form-data">
        <Modal
          open={open}
          onClose={onClose}
          size="w-8/12 h-.5/6"
          isButton={false}
        >
          <div className="p-2 w-full">
            <h1 className="text-lg pb-10 font-bold">{name}</h1>
            <div className="flex w-full">
              <table className="ml-auto w-8/12 mr-5">
                <tbody>
                  {room.roomId && (
                    <tr>
                      <td className="w-3/12">
                        <h2>Mã phòng</h2>
                      </td>
                      <td className="w-9/12">
                        <input
                          readOnly
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="text"
                          name="roomId"
                          defaultValue={room.roomId}
                        />
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="w-3/12">
                      <h2>Tên phòng</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="roomName"
                        defaultValue={room.roomName}
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Khu vực</h2>
                    </td>
                    <td className="w-9/12">
                      <select
                        className="border-0 border-b border-gray-500 w-11/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                        name="floorId"
                        defaultValue={room.floor ? room.floor.floorId : ""}
                      >
                        {optionFloors}
                      </select>
                      <button
                        type="button"
                        className="w-1/12 text-2xl text-gray-500"
                        onClick={() => setOpenNewAreaModal(true)}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Hạng phòng</h2>
                    </td>
                    <td className="w-9/12">
                      <select
                        className="border-0 border-b border-gray-500 w-11/12 focus:border-b-2 focus:border-green-500 focus:ring-0"
                        name="roomCategoryId"
                        defaultValue={
                          room.roomCategory
                            ? room.roomCategory.roomCategoryId
                            : ""
                        }
                        onChange={handlePriceChange}
                      >
                        {optionCategories}
                      </select>
                      <button
                        type="button"
                        className="w-1/12 text-2xl text-gray-500"
                        onClick={() => setOpenNewCateRoomModal(true)}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Chú ý</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="note"
                        defaultValue={room.note}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="ml-auto w-4/12">
                <tbody>
                  <tr>
                    <td>
                      <h2>Giá theo giờ</h2>
                    </td>
                    <td>
                      <input
                        readOnly
                        className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="number"
                        name="priceHour"
                        value={inputValues.priceByHour}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h2>Giá theo ngày</h2>
                    </td>
                    <td>
                      <input
                        readOnly
                        className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="number"
                        name="priceByDay"
                        value={inputValues.priceByDay}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h2>Giá theo đêm</h2>
                    </td>
                    <td>
                      <input
                        readOnly
                        className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="number"
                        name="priceNight"
                        value={inputValues.priceByNight}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-8 w-full focus:border-b-2 focus:border-green-500 focus:ring-0">
              <Image
                name="image"
                src={room.image ? `data:image/png;base64,${room.image}` : null}
              />
            </div>
          </div>
        </Modal>
      </Form>
      {openNewAreaModal && (
        <NewArea
          open={openNewAreaModal}
          onClose={() => setOpenNewAreaModal(false)}
        />
      )}
      {openNewCateRoomModal && (
        <NewCategoryRoom
          open={openNewCateRoomModal}
          onClose={() => setOpenNewCateRoomModal(false)}
        />
      )}
    </>
  );
}

export default RoomForm;

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const formData = new FormData();
  if (data.get("roomCategoryName")) {
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
    return redirect("/manager/roomManagement");
  }
  if (data.get("floorName")) {
    const formData = {
      floorName: data.get("floorName"),
      status: 1,
    };
    const response = await axiosConfig.post("Floor", formData).catch((e) => {
      console.log(e);
    });
    console.log(response);
    return redirect("/manager/roomManagement");
  }
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
  if (method === "PUT") {
    console.log(data.get("roomId"));
    const response = await axiosConfig
      .put("room/" + data.get("roomId"), formData, {
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
    const dataArray = data.get("roomId").split(",");
    dataArray.map(async (id) => {
      const response = await axiosConfig.delete("room/" + id).catch((e) => {
        console.log(e);
      });
      console.log(response);
    });
  }

  return redirect("/manager/roomManagement");
}
