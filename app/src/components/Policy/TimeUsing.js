import { useState } from "react";
import TimeUsingModal from "./TimeUsingModal";

function TimeUsing() {
  const [openTimeUsingModal, setOpenTimeUsingModal] = useState(false);
  return (
    <div className="ml-4 my-4">
      <div className="bg-white py-4 px-8 flex">
        <div>
          <h2 className="font-medium text-lg">Thiết lập thời gian sử dụng</h2>
          <p className="text-sm text-gray-500">
            Quy định thời gian nhận - trả phòng
          </p>
        </div>
        <div className="ml-auto my-auto rounded-lg border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500">
          <button
            type="button"
            className="py-1 px-6"
            onClick={() => setOpenTimeUsingModal(true)}
          >
            Chi tiết
          </button>
        </div>
      </div>
      {openTimeUsingModal && (
        <TimeUsingModal
          open={openTimeUsingModal}
          onClose={() => setOpenTimeUsingModal(false)}
        />
      )}
    </div>
  );
}

export default TimeUsing;
