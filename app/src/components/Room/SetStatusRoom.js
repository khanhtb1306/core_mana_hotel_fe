import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function SetStatusRoom(props) {
  const room = props.room;
  const status = room.status === 1 ? 2 : room.status === 2 ? 1 : null;
  return (
    <Form method="put" onSubmit={() => props.onClose()}>
      <Modal open={props.open} onClose={props.onClose} size="w-5/12 h-.5/6">
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Xác nhận</h1>
          <input hidden type="text" name="roomId" defaultValue={room.roomId} />
          <input hidden type="number" name="status" defaultValue={status} />
          <input hidden type="number" name="floorId" defaultValue={room.floor.floorId} />
          <input hidden type="number" name="roomCategoryId" defaultValue={room.roomCategory.roomCategoryId} />
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

export default SetStatusRoom;
