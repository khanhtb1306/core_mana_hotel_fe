import Modal from "../UI/Modal";
import { useState } from "react";
import dayjs from "dayjs";

function DetailsReservation(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openListPrice, setOpenListPrice] = useState(false);

  const reservation = props.reservation;
  console.log(props.reservation);

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenListPrice(false);
  };

  const handleListPrice = () => {
    setOpenInfo(false);
    setOpenListPrice(true);
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      reset={props.onClose}
      button={true}
      size="w-8/12 h-.5/6"
    >
      <div className="p-2 w-full">
        <div className="mb-5">
          <h1 className="text-lg pb-5 font-bold">Thông tin hạng phòng</h1>
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
                  openListPrice ? "border-b-2 border-green-500 ring-0" : ""
                }`}
                onClick={handleListPrice}
              >
                Giá phòng
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default DetailsReservation;
