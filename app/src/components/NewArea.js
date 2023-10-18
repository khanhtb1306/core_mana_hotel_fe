import Modal from "./UI/Modal";
import { Form } from "react-router-dom";

function NewArea(props) {
  return (
    <Form method="post" onSubmit={props.onClose} encType="multipart/form-data">
      <Modal open={props.open} onClose={props.onClose} size="w-5/12 h-.5/6">
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Thêm khu vực mới</h1>
          <table className="ml-auto mr-5 w-full">
            <tbody>
              <tr>
                <td className="w-3/12">
                  <h2>Khu vực</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="floorName"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </Form>
  );
}

export default NewArea;
