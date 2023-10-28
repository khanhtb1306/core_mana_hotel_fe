import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function SetStatusCategoryRoom(props) {
  const cateRoom = props.categoryRoom;
  const status =
    cateRoom.roomCategory.status === 1
      ? 2
      : cateRoom.roomCategory.status === 2
      ? 1
      : null;
  return (
    <Form method="put" onSubmit={() => props.onClose()}>
      <Modal open={props.open} onClose={props.onClose} size="w-5/12 h-.5/6">
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Xác nhận</h1>
          <input
            hidden
            type="text"
            name="roomCategoryId"
            defaultValue={cateRoom.roomCategory.roomCategoryId}
          />
          <input hidden type="number" name="status" defaultValue={status} />
          <div className="ml-auto mr-5 w-full">
            <p></p>
            <p>
              Bạn có chắc chắn muốn{" "}
              {status === 1 ? "Hoạt động" : "Ngừng hoạt động"} hạng phòng này
              không?
            </p>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default SetStatusCategoryRoom;
