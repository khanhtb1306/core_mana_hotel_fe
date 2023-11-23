import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function DeleteVisitor(props) {
  return (
    <Form method="DELETE" onSubmit={() => props.onClose()}>
      <Modal open={props.open} onClose={props.onClose} size="w-5/12 h-.5/6">
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Xoá khách lưu trú</h1>
          <input
            hidden
            type="text"
            name="isVisitor"
            defaultValue={true}
          />
          <input
            type="hidden"
            name="reservationDetailCustomerId"
            defaultValue={props.visitor.reservationDetailCustomerId}
          />
          <div className="ml-auto mr-5 w-full">
            <p>Bạn có chắc chắn muốn xóa khách lưu trú?</p>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default DeleteVisitor;
