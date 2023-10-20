import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function DeleteRoom(props) {
  return (
    <Form method="delete" onSubmit={() => props.onClose()}>
      <Modal
        open={props.open}
        onClose={props.onClose}
        size="w-5/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Xoá phòng</h1>
          <input
            hidden
            type="text"
            name="roomId"
            defaultValue={props.listRoomId}
          />
          <div className="ml-auto mr-5 w-full">
            <p>
              Hệ thống sẽ xoá hoàn toàn danh sách phòng được chọn nhưng vẫn giữ
              nguyên thông tin phòng trong các giao dịch lịch sử nếu có
            </p>
            <p>Bạn có chắc chắn muốn xoá?</p>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default DeleteRoom;
