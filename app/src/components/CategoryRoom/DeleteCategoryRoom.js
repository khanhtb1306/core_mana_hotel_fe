import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function DeleteCategoryRoom(props) {
  return (
    <Form method="delete" onSubmit={() => props.onClose()}>
      <Modal
        open={props.open}
        onClose={props.onClose}
        size="w-5/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Xoá hạng phòng</h1>
          <input
            hidden
            type="text"
            name="roomCategoryId"
            defaultValue={props.listCateRoomId}
          />
          <div className="ml-auto mr-5 w-full">
            <p>
              Hệ thống sẽ xóa hoàn toàn danh sách hạng phòng được chọn bao gồm
              hạng phòng đang gắn với phòng nhưng vẫn giữ thông tin hạng phòng
              trong các giao dịch lịch sử nếu có.
            </p>
            <p>Bạn có chắc chắn muốn xoá?</p>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default DeleteCategoryRoom;
