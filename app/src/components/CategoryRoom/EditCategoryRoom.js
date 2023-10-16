import { useEffect, useState } from "react";
import Image from "../UI/ImageInput";
import Modal from "../UI/Modal";
import { axiosConfig } from "../../utils/axiosConfig";

function EditCategoryRoom(props) {
  const [inputValues, setInputValues] = useState({
    idCateRoom: 0,
    nameCateRoom: "",
    priceHour: 0,
    priceDay: 0,
    priceNight: 0,
    description: "",
  });
  const [inputFiles, setInputFiles] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    image5: "",
  });

  const [openInfo, setOpenInfo] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);

  const [category, setCategory] = useState(null);
  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axiosConfig.get(
          "room-class/" + props.cateRoomId
        );
        setCategory(response.data);
        if (response.data && response.data.roomCategory) {
          const cate = response.data.roomCategory;
          setInputValues({
            idCateRoom: cate.roomCategoryId,
            nameCateRoom: cate.roomCategoryName,
            priceHour: cate.priceByHour,
            priceDay: cate.priceByDay,
            priceNight: cate.priceByNight,
            description: cate.description,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategory();
  }, []);

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

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenDetails(false);
  };

  const handleDetails = () => {
    setOpenInfo(false);
    setOpenDetails(true);
  };

  return (
    category && (
      <Modal
        open={props.open}
        onClose={props.onClose}
        reset={props.onClose}
        size="w-8/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <div>
            <h1 className="text-lg pb-5 font-bold">Chỉnh sửa hạng phòng</h1>
            <div className="flex w-5/12">
              <div className="w-6/12">
                <button
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
          {openInfo ? (
            <>
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
                          name="idCateRoom"
                          value={inputValues.idCateRoom}
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
                          name="nameCateRoom"
                          value={inputValues.nameCateRoom}
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
            </>
          ) : null}
          {openDetails ? (
            <div className="mt-10">
              <h2 className="px-4 py-2 bg-gray-200">Mô tả</h2>
              <textarea
                className="textarea border-0 textarea-lg w-full h-40 max-h-40"
                name="description"
                value={inputValues.description}
                onChange={handleInputChange}
              />
            </div>
          ) : null}
        </div>
      </Modal>
    )
  );
}

export default EditCategoryRoom;
