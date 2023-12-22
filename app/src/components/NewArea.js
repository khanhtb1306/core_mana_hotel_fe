import { useState } from "react";
import Modal from "./UI/Modal";
import { Form, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

function NewArea(props) {
  const { floors } = useLoaderData();
  const [name, setName] = useState("");
  return (
    <Form method="post" onSubmit={props.onClose} encType="multipart/form-data">
      <Modal
        open={props.open}
        onClose={props.onClose}
        size="w-5/12 h-.5/6"
        button={true}
      >
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
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex pt-5">
          <div className="ml-auto">
            <button
              type={
                name.trim() === "" ||
                floors.find((floor) => floor.floorName === name.trim())
                  ? "button"
                  : ""
              }
              className="bg-green-500 mr-10 py-2 px-6 text-white rounded hover:bg-green-600"
              onClick={() => {
                if (name.trim() === "") {
                  Swal.fire({
                    position: "bottom",
                    html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Tên khu vực không được để trống</button>`,
                    showConfirmButton: false,
                    background: "transparent",
                    backdrop: "none",
                    timer: 2000,
                  });
                } else if (floors.find((floor) => floor.floorName === name.trim())) {
                  Swal.fire({
                    position: "bottom",
                    html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Tên khu vực bị trùng</button>`,
                    showConfirmButton: false,
                    background: "transparent",
                    backdrop: "none",
                    timer: 2000,
                  });
                }
              }}
            >
              Lưu
            </button>
            <button
              type="button"
              className="bg-gray-400 py-2 px-6 text-white rounded hover:bg-gray-500"
              onClick={() => props.onClose()}
            >
              Bỏ qua
            </button>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default NewArea;
