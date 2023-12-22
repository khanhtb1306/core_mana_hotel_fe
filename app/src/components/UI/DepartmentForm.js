import React, { useState, useEffect } from "react";
import { Form, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import Modal from "./Modal";

function DepartmentForm({ name, open, onClose, method,  department }) {
  return (
    <Form method={method} onSubmit={onClose} encType="multipart/form-data">
      <Modal open={open} onClose={onClose}  size="w-5/12 h-.5/6">
        <div className="p-2 w-full">
          <h1 className="text-lg pb-10 font-bold">{name}</h1>
          <table className="ml-auto mr-5 w-full">
            <tbody>
              <input hidden name="isDepartment" value={true} />
              {department.departmentId !== null && (  <input
                name="departmentId"
                defaultValue={
                  department.departmentId ? department.departmentId: ""
              }
                hidden
              />)}
              <tr>
                <td className="w-3/12">
                  <h2>Tên phòng ban</h2>
                </td>
                <td className="w-9/12">
                  <input
                    className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                    type="text"
                    name="departmentName"
                    defaultValue={
                      department ? department.departmentName: ""
                    }
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

export default DepartmentForm;
