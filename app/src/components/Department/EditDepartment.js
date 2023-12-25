import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import DepartmentForm from "../UI/DepartmentForm";

function EditDepartment(props) {
  return (
    <DepartmentForm
      name="Chỉnh sửa phòng ban"
      method="post"
      open={props.open}
      onClose={props.onClose}
      department={props.department}
    />
  );
}

export default EditDepartment;
