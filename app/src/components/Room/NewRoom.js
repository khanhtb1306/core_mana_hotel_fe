import { useState } from "react";
import Image from "../UI/Image";
import Modal from "../UI/Modal";
import NewCategoryRoom from "../CategoryRoom/NewCategoryRoom";
import NewArea from "../NewArea";

function NewRoom(props) {
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const month = String(dateNow.getMonth() + 1).padStart(2, "0");
  const day = String(dateNow.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  const [inputValues, setInputValues] = useState({
    nameRoom: "",
    area: 0,
    cateRoom: 0,
    dateBegin: formattedDate,
    priceHour: 0,
    priceDay: 0,
    priceNight: 0,
  });

  const [inputFiles, setInputFiles] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    image5: "",
  });
  const [openNewCateRoomModal, setOpenNewCateRoomModal] = useState(false);
  const [openNewAreaModal, setOpenNewAreaModal] = useState(false);

  console.log(inputFiles);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, value } = e.target;
    setInputFiles({
      ...inputFiles,
      [name]: value,
    });
  };

  const handleReset = () => {
    setInputValues({
      nameRoom: "",
      area: 0,
      cateRoom: 0,
      dateBegin: formattedDate,
      priceHour: 0,
      priceDay: 0,
      priceNight: 0,
    });
    setInputFiles({
      image1: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
    });
  };

  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        reset={handleReset}
        size="w-8/12 h-4/6"
      >
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Thêm phòng mới</h1>
          <div className="flex w-full">
            <table className="ml-auto w-8/12 mr-5">
              <tbody>
                <tr>
                  <td className="w-3/12">
                    <h2>Tên phòng</h2>
                  </td>
                  <td className="w-9/12">
                    <input
                      className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                      type="text"
                      name="nameRoom"
                      value={inputValues.nameRoom}
                      onChange={handleInputChange}
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
                      name="area"
                      value={inputValues.area}
                      onChange={handleInputChange}
                    >
                      <option value={1}>Tầng 1</option>
                      <option value={2}>Tầng 2</option>
                      <option value={3}>Tầng 3</option>
                    </select>
                    <button
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
                      name="cateRoom"
                      value={inputValues.cateRoom}
                      onChange={handleInputChange}
                    >
                      <option value={1}>VIP</option>
                      <option value={2}>Classic</option>
                      <option value={3}>Old</option>
                    </select>
                    <button
                      className="w-1/12 text-2xl text-gray-500"
                      onClick={() => setOpenNewCateRoomModal(true)}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="w-3/12">
                    <h2>Bắt đầu sử dụng</h2>
                  </td>
                  <td className="w-9/12">
                    <input
                      className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                      type="date"
                      name="dateBegin"
                      value={inputValues.dateBegin}
                      onChange={handleInputChange}
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
                      className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                      type="number"
                      name="priceHour"
                      value={inputValues.priceHour}
                      onChange={handleInputChange}
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
                      name="priceDay"
                      value={inputValues.priceDay}
                      onChange={handleInputChange}
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
                      name="priceNight"
                      value={inputValues.priceNight}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-8 w-full focus:border-b-2 focus:border-green-500 focus:ring-0">
            <Image
              name="image1"
              value={inputFiles.image1}
              onChange={handleFileChange}
            />
            <Image
              name="image2"
              value={inputFiles.image2}
              onChange={handleFileChange}
            />
            <Image
              name="image3"
              value={inputFiles.image3}
              onChange={handleFileChange}
            />
            <Image
              name="image4"
              value={inputFiles.image4}
              onChange={handleFileChange}
            />
            <Image
              name="image5"
              value={inputFiles.image5}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </Modal>
      <NewCategoryRoom
        open={openNewCateRoomModal}
        onClose={() => setOpenNewCateRoomModal(false)}
      />
      <NewArea
        open={openNewAreaModal}
        onClose={() => setOpenNewAreaModal(false)}
      />
    </>
  );
}

export default NewRoom;
