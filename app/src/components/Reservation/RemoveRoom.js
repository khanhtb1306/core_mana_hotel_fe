import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function RemoveRoom(props) {
  const room = props.room;
  return (
    <Form method="delete" onSubmit={() => props.onClose()}>
      <Modal open={props.open} onClose={props.onClose} size="w-5/12 h-.5/6">
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Xoá hạng phòng</h1>
          <input
            type="hidden"
            name="removeRoom"
            defaultValue={true}
          />
          <input
            type="hidden"
            name="reservationId"
            defaultValue={room.reservation.reservationId}
          />
          <input
            type="hidden"
            name="reservationDetailsId"
            defaultValue={room.reservationDetailId}
          />
          <div className="ml-auto mr-5 w-full">
            <p>
              Bạn có muốn lưu lại các thay đổi trên phiếu đặt phòng{" "}
              {room.reservation.reservationId} trước khi thực hiện xóa phòng{" "}
              {room.room.roomName}?
            </p>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default RemoveRoom;
