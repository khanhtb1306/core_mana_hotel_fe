import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function CleanRoomModal(props) {
  const room = props.room;
//   console.log(room);
  const status = room.conditionStatus === "ROOM_CLEAN" ? 1 : 2;
  return (
    <Form method="PUT" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-7/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">
              Chuyển trạng thái buồng phòng
            </h1>
            <input type="hidden" name="isCleanRoom" defaultValue={true} />
            <input type="hidden" name="roomId" defaultValue={room.roomId} />
            <input
              type="hidden"
              name="status"
              defaultValue={
                room.conditionStatus === "ROOM_CLEAN"
                  ? "ROOM_UNCLEAN"
                  : "ROOM_CLEAN"
              }
            />
          </div>
          <div className="text-sm">
            Chuyển trạng thái buồng phòng{" "}
            <span className="font-medium">{room.roomName}</span> thành{" "}
            <span
              className={`${status === 1 && "text-red-500"} ${
                status === 2 && "text-green-500"
              }`}
            >
              {status === 1 && "Chưa dọn"}
              {status === 2 && "Sạch"}?
            </span>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default CleanRoomModal;
