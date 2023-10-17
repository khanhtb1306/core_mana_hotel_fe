import { useState } from "react";
import Image from "../UI/ImageInput";
import Modal from "../UI/Modal";

function NewProduct(props) {
  const [inputValues, setInputValues] = useState({
    code: "",
    nameProduct: "",
    location: "",
    unit: "",
    status: "",
    capitalPrice: 0,
    sellingPrice: 0,
    quantityInStock: 0,
    weight: 0,
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
      code: "",
      nameProduct: "",
      location: "",
      unit: "",
      status: "",
      capitalPrice: 0,
      sellingPrice: 0,
      quantityInStock: 0,
      weight: 0,
      description: "",
    });
    setInputFiles({
      image1: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
    });
    setOpenInfo(true);
    setOpenDetails(false);
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
    <Modal
      open={props.open}
      onClose={props.onClose}
      reset={handleReset}
      size="w-8/12 h-.5/6"
    >
      <div className="p-2 w-full">
        <div>
          <h1 className="text-lg pb-5 font-bold">Thêm hạng phòng mới</h1>
          <div className="flex w-5/12">
            <div className="w-5/12">
              <button
                className={`border-0 border-b border-gray-500 w-full ${
                  openInfo ? "border-b-2 border-green-500 ring-0" : ""
                }`}
                onClick={handleInfo}
              >
                Thông tin
              </button>
            </div>
            <div className="w-7/12">
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
                      <h2>Mã hàng hoá</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="code"
                        value={inputValues.code}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Tên hàng hoá</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="nameProduct"
                        value={inputValues.nameProduct}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Vị trí</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="nameProduct"
                        value={inputValues.location}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Đơn vị</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="unit"
                        value={inputValues.unit}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Trạng thái</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="status"
                        value={inputValues.status}
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
                      <h2>Giá vốn</h2>
                    </td>
                    <td>
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="number"
                        name="capitalPrice"
                        value={inputValues.capitalPrice}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h2>Giá bán</h2>
                    </td>
                    <td>
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="number"
                        name="sellingPrice"
                        value={inputValues.sellingPrice}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h2>Tồn kho</h2>
                    </td>
                    <td>
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="number"
                        name="quantityInStock"
                        value={inputValues.quantityInStock}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h2>Trọng lượng</h2>
                    </td>
                    <td>
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="number"
                        name="weight"
                        value={inputValues.weight}
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
            ></textarea>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export default NewProduct;
