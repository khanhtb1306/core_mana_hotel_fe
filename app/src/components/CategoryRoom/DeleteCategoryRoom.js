import { Form, redirect } from "react-router-dom";
import Modal from "../UI/Modal";
import { useState } from "react";
import { axiosConfig } from "../../utils/axiosConfig";

function DeleteCategoryRoom(props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      props.listCateRoomId.map(async (id) => {
        await axiosConfig
          .delete("room-class/" + id)
          .then((response) => console.log(response))
          .catch((e) => {
            console.log(e);
          });
      });
      window.location.href = '/manager/categoryRoomManagement';
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Form>
      <Modal
        open={props.open}
        onClose={props.onClose}
        reset={props.onClose}
        button={true}
        size="w-5/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Xoá hạng phòng</h1>
          <div className="ml-auto mr-5 w-full">
            <p>
              Hệ thống sẽ xóa hoàn toàn danh sách hạng phòng được chọn bao gồm
              hạng phòng đang gắn với phòng nhưng vẫn giữ thông tin hạng phòng
              trong các giao dịch lịch sử nếu có.
            </p>
            <p>Bạn có chắc chắn muốn xoá?</p>
          </div>
        </div>
        <div className="flex pt-5">
          <div className="ml-auto">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-400 py-2 px-6 text-white rounded mr-10"
            >
              {isDeleting ? "Đang xoá..." : "Xoá"}
            </button>
            <button
              type="button"
              className="bg-gray-400 py-2 px-6 text-white rounded"
              onClick={() => {
                props.onClose();
              }}
              disabled={isDeleting}
            >
              Bỏ qua
            </button>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default DeleteCategoryRoom;
