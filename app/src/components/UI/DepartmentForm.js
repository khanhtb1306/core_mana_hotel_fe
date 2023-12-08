import Modal from "./Modal";
import { Form } from "react-router-dom";

function DepartmentForm(props) {
  return (
    <Form method="post" onSubmit={props.onClose} encType="multipart/form-data">
      <Modal open={props.open} onClose={props.onClose} size="w-5/12 h-.5/6">
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Thêm phòng ban mới</h1>
          <table className="ml-auto mr-5 w-full">
            <tbody>
              <tr>
                <td className="w-3/12">
                  <h2>Tên phòng ban</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="departmentName"
                  />
                </td>
              </tr>
              {/* <tr>
                <td className="w-3/12">
                  <h2>Tình trạng</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="status"
                  />
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </Modal>
    </Form>
  );
}

export default DepartmentForm;
