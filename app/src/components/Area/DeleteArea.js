import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function DeleteArea(props) {
  return (
    <Form method="delete" onSubmit={() => props.onClose()}>
      <Modal
        open={props.open}
        onClose={props.onClose}
        size="w-5/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Xoá khu vực</h1>
          <input
            hidden
            type="text"
            name="floorId"
            defaultValue={props.floorId}
          />
          <div className="ml-auto mr-5 w-full">
            <p>
              Hệ thống sẽ xóa hoàn toàn danh sách khu vực được chọn.
            </p>
            <p>Bạn có chắc chắn muốn xóa? </p>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default DeleteArea;