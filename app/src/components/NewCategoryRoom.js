import { useState } from "react";
import Image from "./UI/Image";
import Modal from "./UI/Modal";

function NewCategoryRoom(props) {
  const [inputValues, setInputValues] = useState({
    idCateRoom: 0,
    nameCateRoom: "",
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
      idCateRoom: 0,
      nameCateRoom: "",
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
                  <h2>Mã hạng phòng</h2>
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
                  <h2>Tên hạng phòng</h2>
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
  );
}

export default NewCategoryRoom;
