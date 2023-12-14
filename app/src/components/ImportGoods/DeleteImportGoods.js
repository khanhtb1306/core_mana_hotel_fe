import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function DeleteImportGoods(props) {
  return (
    <Form method="delete" onSubmit={() => props.onClose()}>
      <Modal
        open={props.open}
        onClose={props.onClose}
        size="w-5/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Xoá phiếu nhập hàng</h1>
          <input
            // type="hidden"
            name="importGoodsId"
            defaultValue={props.importGoodsId}
          />
          <div className="ml-auto mr-5 w-full">
            <p>
              Hệ thống sẽ xóa hoàn toàn phiếu nhập hàng.
            </p>
            <p>Bạn có chắc chắn muốn xóa?</p>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default DeleteImportGoods;