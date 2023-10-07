import { useState } from "react";
import Image from "./UI/ImageInput";
import Modal from "./UI/Modal";

function NewArea(props) {
  const [inputValues, setInputValues] = useState({
    idArea: 0,
    nameArea: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const handleReset = () => {
    setInputValues({
      idArea: 0,
      nameArea: "",
    });
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      reset={handleReset}
      size="w-5/12 h-2/6"
    >
      <div className="p-2 w-full">
        <h1 className="text-lg pb-10 font-bold">Thêm khu vực mới</h1>
          <table className="ml-auto mr-5 w-full">
            <tbody>
              <tr>
                <td className="w-3/12">
                  <h2>Khu vực</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="nameArea"
                    value={inputValues.nameArea}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
      </div>
    </Modal>
  );
}

export default NewArea;
