import Modal from "../UI/Modal";
import { useState } from "react";

function DetailsRoom(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openTransition, setOpenTransition] = useState(false);
  const [openCleaning, setOpenCleaning] = useState(false);

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenTransition(false);
    setOpenCleaning(false);
  };

  const handleTransition = () => {
    setOpenInfo(false);
    setOpenTransition(true);
    setOpenCleaning(false);
  };

  const handleCleaning = () => {
    setOpenInfo(false);
    setOpenTransition(false);
    setOpenCleaning(true);
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      reset={props.onClose}
      size="w-8/12 h-4/6"
    >
      <div className="p-2 w-full">
        <div>
          <h1 className="text-lg pb-5 font-bold">Thông tin phòng</h1>
          <div className="flex w-5/12">
            <div className="w-3/12">
              <button
                className={`border-0 border-b border-gray-500 w-full ${
                  openInfo ? "border-b-2 border-green-500 ring-0" : ""
                }`}
                onClick={handleInfo}
              >
                Thông tin
              </button>
            </div>
            <div className="w-4/12">
              <button
                className={`border-0 border-b border-gray-500 w-full ${
                  openTransition ? "border-b-2 border-green-500 ring-0" : ""
                }`}
                onClick={handleTransition}
              >
                Lịch sử giao dịch
              </button>
            </div>
            <div className="w-5/12">
              <button
                className={`border-0 border-b border-gray-500 w-full ${
                  openCleaning ? "border-b-2 border-green-500 ring-0" : ""
                }`}
                onClick={handleCleaning}
              >
                Lịch sử dọn dẹp
              </button>
            </div>
          </div>
        </div>
        {openInfo ? <>123</> : null}
        {openTransition ? <>456</> : null}
        {openCleaning ? <>789</> : null}
      </div>
    </Modal>
  );
}

export default DetailsRoom;
