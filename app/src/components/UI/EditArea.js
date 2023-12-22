import React, { useState, useEffect } from "react";
import { Form, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import Swal from "sweetalert2";
import Modal from "./Modal";

function EditArea(props) {
  const { floors } = useLoaderData();
  const [floorName, setFloorName] = useState(props.floor.floorName);

  return (
    <Form method="put" onSubmit={props.onClose} encType="multipart/form-data">
      <Modal
        open={props.open}
        onClose={props.onClose}
        size="w-5/12 h-.5/6"
        button={true}
      >
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">Chỉnh sửa khu vực</h1>
          <table className="ml-auto mr-5 w-full">
            <tbody>
              <tr>
                <input type="hidden" name="isEditFloor" value={true} />
                <input
                  className="hidden"
                  type="text"
                  name="floorId"
                  value={props.floor.floorId}
                />
                <td className="w-3/12">
                  <h2>Khu vực</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="floorNameEdit"
                    value={floorName}
                    onChange={(event) => setFloorName(event.target.value)}
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
                floorName.trim() === "" ||
                (floors.find(
                  (floor) => floor.floorName.trim() === floorName.trim()
                ) &&
                  props.floor.floorName.trim() !== floorName.trim())
                  ? "button"
                  : ""
              }
              className="bg-green-500 mr-10 py-2 px-6 text-white rounded hover:bg-green-600"
              onClick={() => {
                if (floorName.trim() === "") {
                  Swal.fire({
                    position: "bottom",
                    html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Tên khu vực không được để trống</button>`,
                    showConfirmButton: false,
                    background: "transparent",
                    backdrop: "none",
                    timer: 2000,
                  });
                } else if (
                  floors.find(
                    (floor) => floor.floorName.trim() === floorName.trim()
                  ) &&
                  props.floor.floorName.trim() !== floorName.trim()
                ) {
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
  // <div className={`fixed inset-0 flex justify-center items-center transition-colors overflow-auto z-10 ${props.open ? "visible bg-black/20" : "invisible"}`}>
  //     <div className={`bg-white absolute top-24 rounded-xl shadow p-6 transition-all w-5/12 h-.5/6 ${props.open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
  //         <Form method="post" onSubmit={handleSubmit} encType="multipart/form-data">
  //             <div className="p-2 w-full">
  //                 <h1 className="text-lg pb-10 font-bold">Sửa khu vực</h1>
  //                 <table className="ml-auto mr-5 w-full">
  //                     <tbody>
  //                     <tr>
  //                         <td className="w-3/12">
  //                             <h2>Khu vực</h2>
  //                         </td>
  //                         <td className="w-9/12">
  //                             <input
  //                                 className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
  //                                 type="text"
  //                                 name="floorName"
  //                                 value={editedFloorName}
  //                                 onChange={handleFloorNameChange}
  //                             />
  //                         </td>
  //                     </tr>
  //                     </tbody>
  //                 </table>
  //             </div>

  //         </Form>
  //     </div>
  // </div>
}

export default EditArea;
