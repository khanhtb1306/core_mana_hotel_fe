import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import StaffForm from "../UI/StaffForm";

function EditStaff(props) {
  return (
    <StaffForm
      name="Chỉnh sửa nhân viên"
      method="post"
      open={props.open}
      onClose={props.onClose}
      staff={props.staff}
    />
  );
}

export default EditStaff;
