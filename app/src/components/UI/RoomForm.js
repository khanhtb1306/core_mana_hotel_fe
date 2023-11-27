import { Form, redirect } from "react-router-dom";
import Image from "../UI/ImageInput";
import { useState } from "react";
import Modal from "./Modal";
import { axiosConfig } from "../../utils/axiosConfig";
import NewCategoryRoom from "../CategoryRoom/NewCategoryRoom";
import NewArea from "../NewArea";

function RoomForm({
  name,
  open,
  onClose,
  method,
  floors,
  categories,
  room,
  rooms,
}) {
  const [openNewCateRoomModal, setOpenNewCateRoomModal] = useState(false);
  const [openNewAreaModal, setOpenNewAreaModal] = useState(false);
  const defaultCate = categories[0].roomCategory;

  const [inputValues, setInputValues] = useState({
    priceByHour: defaultCate.priceByHour,
    priceByDay: defaultCate.priceByDay,
    priceByNight: defaultCate.priceByNight,
  });

  const [roomName, setRoomName] = useState(room.roomName);

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
        <Modal open={open} onClose={onClose} size="w-8/12 h-.5/6" button={true}>
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
                        value={roomName}
                        onChange={(e) => {
                          setRoomName(e.target.value);
                        }}
                        onInvalid={(e) => {
                          e.target.setCustomValidity(
                            "Không được để trống tên phòng"
                          );
                        }}
                        required
                      />
                      {rooms.find((cate) => cate.roomName === roomName) &&
                        roomName !== room.roomName && (
                          <div className="text-red-500 text-sm">
                            Tên phòng không thể bị trùng
                          </div>
                        )}
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
          <div className="flex pt-5">
            <div className="ml-auto">
              <button
                className="bg-green-500 mr-10 py-2 px-6 text-white rounded hover:bg-green-600"
                disabled={
                  rooms.find((cate) => cate.roomName === roomName) &&
                  roomName !== room.roomName
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
          categories={categories}
        />
      )}
    </>
  );
}

export default RoomForm;
