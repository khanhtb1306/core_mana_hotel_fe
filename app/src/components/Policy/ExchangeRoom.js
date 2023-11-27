import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import DepositModal from "./DepositModal";
import CancelRoomModal from "./CancelRoomModal";

function ExchangeRoom() {
  const { listDeposit, cancelRoom, categories } = useLoaderData();
  //   console.log(listDeposit);
  // console.log(cancelRoom);
  const [openDepositModal, setOpenDepositModal] = useState(false);
  const [openCancelRoomModal, setOpenCancelRoomModal] = useState(false);
  return (
    <div className="ml-4 my-4">
      <div className="bg-white py-4 px-8 flex">
        <div>
          <h2 className="font-medium text-lg">Thiết lập tiền cọc phòng</h2>
          <p className="text-sm text-gray-500">
            Quy định tiền cọc tối thiểu cho từng hạng phòng
          </p>
        </div>
        <div className="ml-auto my-auto rounded-lg border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500">
          <button
            type="button"
            className="py-1 px-6"
            onClick={() => setOpenDepositModal(true)}
          >
            Chi tiết
          </button>
        </div>
      </div>
      <div className="bg-white mt-4 py-4 px-8 flex">
        <div>
          <h2 className="font-medium text-lg">Thiết lập huỷ phòng</h2>
          <p className="text-sm text-gray-500">
            Quy định thời gian trả phòng tương ứng với tiền cọc được trả lại
          </p>
        </div>
        <div className="ml-auto my-auto rounded-lg border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500">
          <button
            type="button"
            className="py-1 px-6"
            onClick={() => setOpenCancelRoomModal(true)}
          >
            Chi tiết
          </button>
        </div>
      </div>
      {openDepositModal && (
        <DepositModal
          open={openDepositModal}
          onClose={() => setOpenDepositModal(false)}
          deposits={listDeposit}
          categories={categories}
        />
      )}
      {openCancelRoomModal && (
        <CancelRoomModal
          open={openCancelRoomModal}
          onClose={() => setOpenCancelRoomModal(false)}
          cancelRoom={cancelRoom}
        />
      )}
    </div>
  );
}

export default ExchangeRoom;
