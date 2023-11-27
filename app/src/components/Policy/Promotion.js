import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import PointModal from "./PointModal";
import PromotionModal from "./PromotionModal";

function Promotion() {
  const { points, promotion } = useLoaderData();
//   console.log(points);
//   console.log(promotion);
  const [openPointModal, setOpenPointModal] = useState(false);
  const [openPromotionModal, setOpenPromotionModal] = useState(false);
  return (
    <div className="ml-4 my-4">
      <div className="bg-white py-4 px-8 flex">
        <div>
          <h2 className="font-medium text-lg">Thiết lập tích điểm</h2>
          <p className="text-sm text-gray-500">
            Quy định nhận điểm khi có đơn đặt phòng
          </p>
        </div>
        <div className="ml-auto my-auto rounded-lg border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500">
          <button
            type="button"
            className="py-1 px-6"
            onClick={() => setOpenPointModal(true)}
          >
            Chi tiết
          </button>
        </div>
      </div>
      <div className="bg-white mt-4 py-4 px-8 flex">
        <div>
          <h2 className="font-medium text-lg">Thiết lập khuyến mãi</h2>
          <p className="text-sm text-gray-500">Quy định đổi điểm khuyến mãi</p>
        </div>
        <div className="ml-auto my-auto rounded-lg border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500">
          <button
            type="button"
            className="py-1 px-6"
            onClick={() => setOpenPromotionModal(true)}
          >
            Chi tiết
          </button>
        </div>
      </div>
      {openPointModal && (
        <PointModal
          open={openPointModal}
          onClose={() => setOpenPointModal(false)}
          points={points}
        />
      )}
      {openPromotionModal && (
        <PromotionModal
          open={openPromotionModal}
          onClose={() => setOpenPromotionModal(false)}
          promotion={promotion}
        />
      )}
    </div>
  );
}

export default Promotion;
