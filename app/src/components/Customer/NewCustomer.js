import { useState } from "react";
import Image from "../UI/ImageInput";
import Modal from "../UI/Modal";
import ImageInput from "../UI/ImageInput";

function NewCustomer(props) {
  const [inputValues, setInputValues] = useState({
    code: "",
    nameCus: "",
    IC: "",
    phoneNumber: "",
    DOB: "",
    address: "",
    email: 0,
    isMale: true,
    isActive: true,
  });

  console.log(inputValues.isMale + ' ' + inputValues.isActive);

  const [inputFiles, setInputFiles] = useState({
    image: "",
  });
  const [openDetails, setOpenDetails] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const handleCheckChange = (e) => {
    const { name, checked } = e.target;
    setInputValues({
        ...inputValues,
        [name]: checked,
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
      nameCus: "",
      IC: "",
      phoneNumber: "",
      DOB: "",
      address: "",
      email: 0,
      isMale: true,
      isActive: true,
    });
    setInputFiles({
      image: "",
    });
    setOpenDetails(false);
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
          <h1 className="text-lg pb-5 font-bold">Thêm khách hàng mới</h1>
        </div>
        <div className="flex w-full">
          <div className="ml-auto w-3/12 mr-5">
            <ImageInput
              name="image"
              value={inputFiles.image}
              onChange={handleFileChange}
            />
          </div>
          <table className="ml-auto w-9/12 mr-5">
            <tbody>
              <tr>
                <td className="w-3/12">
                  <h2>Mã khách hàng</h2>
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
                  <h2>Tên khách hàng</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="nameCus"
                    value={inputValues.nameCus}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="w-3/12">
                  <h2>Chứng minh nhân dân</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="IC"
                    value={inputValues.IC}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="w-3/12">
                  <h2>Địa chỉ</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="address"
                    value={inputValues.address}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="w-3/12">
                  <h2>Số điện thoại</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="phoneNumber"
                    value={inputValues.phoneNumber}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="w-3/12">
                  <h2>Năm sinh</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="DOB"
                    value={inputValues.DOB}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="w-3/12">
                  <h2>Email</h2>
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
              <tr>
                <td className="w-3/12">
                  <h2>Giới tính</h2>
                </td>
                <td className="w-9/12 flex">
                  <div>
                    <input
                      type="radio"
                      id="male"
                      name="isMale"
                      value={true}
                      onChange={handleInputChange}
                      className="p-2 mr-2 focus:ring-green-200 text-green-500"
                    />
                    <label htmlFor="male">Nam</label>
                    <input
                      type="radio"
                      id="female"
                      name="isMale"
                      value={false}
                      onChange={handleInputChange}
                      className="p-2 mr-2 focus:ring-green-200 text-green-500 ml-5"
                    />
                    <label htmlFor="female">Nữ</label>
                  </div>
                  <div className="ml-auto">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      value={true}
                      checked={inputValues.isActive}
                      onChange={handleCheckChange}
                      className="p-2 mr-2 focus:ring-green-200 text-green-500 ml-5"
                    />
                    <label htmlFor="isActive">Hoạt động</label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

export default NewCustomer;
