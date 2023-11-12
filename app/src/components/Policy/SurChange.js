import { useState } from "react";
import HourFeeModal from "./HourFeeModal";
import { useLoaderData } from "react-router-dom";

function SurCharge() {
  const { categories, listCheckout, listCheckin } = useLoaderData();
  const [openHourFeeModal, setOpenHourFeeModal] = useState(false);
  const [openPersonFeeModal, setOpenPersonFeeModal] = useState(false);

  return (
    <div className="ml-4 my-4">
      <div className="bg-white py-4 px-8 flex mb-4">
        <div>
          <h2 className="font-medium text-lg">Thiết lập phụ thu thêm giờ</h2>
          <p className="text-sm text-gray-500">
            Quy định giá nhận sớm, trả muộn cho từng hạng phòng
          </p>
        </div>
        <div className="ml-auto my-auto rounded-lg border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500">
          <button
            type="button"
            className="py-1 px-6"
            onClick={() => setOpenHourFeeModal(true)}
          >
            Chi tiết
          </button>
        </div>
      </div>
      <div className="bg-white py-4 px-8 flex">
        <div>
          <h2 className="font-medium text-lg">Thiết lập phụ thu thêm người</h2>
          <p className="text-sm text-gray-500">
            Quy định chính sách thêm người lớn, trẻ em
          </p>
        </div>
        <div className="ml-auto my-auto rounded-lg border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500">
          <button type="button" className="py-1 px-6 ">
            Chi tiết
          </button>
        </div>
      </div>
      {openHourFeeModal && (
        <HourFeeModal
          open={openHourFeeModal}
          onClose={() => setOpenHourFeeModal(false)}
          categories={categories}
          listLateCheckout={listCheckout}
          listSoonCheckin={listCheckin}
        />
      )}
    </div>
  );
}

export default SurCharge;
