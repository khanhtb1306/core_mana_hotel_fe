import React, { useState, useEffect } from "react";
import { Form, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import Modal from "./Modal";
import Swal from "sweetalert2";

function DepartmentForm({ name, open, onClose, method, department }) {
  const { departments } = useLoaderData();
  const [nameDepartment, setNameDepartment] = useState(
    department.departmentName ? department.departmentName : ""
  );
  let check = false;
  if (
    nameDepartment.trim() === "" ||
    (departments.some(
      (depart) => depart.departmentName.trim() === nameDepartment.trim()
    ) &&
      department.departmentName !== nameDepartment.trim())
  ) {
    check = false;
  } else {
    check = true;
  }
  return (
    <Form method={method} onSubmit={onClose} encType="multipart/form-data">
      <Modal open={open} onClose={onClose} size="w-5/12 h-.5/6" button={true}>
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">{name}</h1>
          <table className="ml-auto mr-5 w-full">
            <tbody>
              <input hidden name="isDepartment" value={true} />
              {department.departmentId && (
                <input
                  name="departmentId"
                  defaultValue={
                    department.departmentId ? department.departmentId : ""
                  }
                  hidden
                />
              )}
              <tr>
                <td className="w-3/12">
                  <h2>
                    <span className="text-red-500">*</span> Tên phòng ban
                  </h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="departmentName"
                    value={nameDepartment}
                    onChange={(e) => setNameDepartment(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex pt-5">
          <div className="ml-auto">
            <button
              type={check ? `` : `button`}
              className="bg-green-500 mr-10 py-2 px-6 text-white rounded hover:bg-green-600"
              onClick={() => {
                if (!check) {
                  let message = "";
                  if (nameDepartment.trim() === "") {
                    message = "Không được để trống tên phòng ban";
                  } else if (
                    departments.some(
                      (depart) =>
                        depart.departmentName.trim() === nameDepartment.trim()
                    ) &&
                    department.departmentName !== nameDepartment.trim()
                  ) {
                    message = "Không được trùng với tên phòng ban khác";
                  }
                  Swal.fire({
                    position: "bottom",
                    html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">${message}</button>`,
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
              onClick={() => {
                onClose();
              }}
            >
              Bỏ qua
            </button>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default DepartmentForm;
