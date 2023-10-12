import { useState } from "react";
import Image from "../UI/ImageInput";
import Modal from "../UI/Modal";

function NewStocktakeRoom(props) {
  const [inputValues, setInputValues] = useState({
    name: "",
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
        name: ""
    });
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
          <h1 className="text-lg pb-5 font-bold">Thêm phiếu kiểm kho mới</h1>
        </div>
        <div className="flex w-full">
          <table className="w-8/12 mr-5">
            <tbody>
              <tr>
                <td className="w-3/12">
                  <h2>Tìm hàng hoá</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="name"
                    value={inputValues.name}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

export default NewStocktakeRoom;
