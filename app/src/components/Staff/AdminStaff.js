import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function AdminStaff(props) {
  return (
    <Form method="put" onSubmit={() => props.onClose()}>
      <Modal
        open={props.open}
        onClose={props.onClose}
        size="w-5/12 h-.5/6"
      >
        <input
            hidden
            type="text"
            name="role"
            defaultValue="admin"
          />
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Chuyển nhân viên</h1>
          <input
            hidden
            type="text"
            name="staffId"
            defaultValue={props.listStaffId}
          />
          <div className="ml-auto mr-5 w-full">
            <p>
              Hệ thống sẽ chuyển nhân viên thành admin.
            </p>
            <p>Bạn có chắc chắn muốn chuyển?</p>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default AdminStaff;