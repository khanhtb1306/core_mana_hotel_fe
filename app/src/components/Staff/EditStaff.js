import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import StaffForm from "../UI/StaffForm";

function EditStaff(props) {
  const [staff, setStaff ] = useState(null);
  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axiosPrivate.get("staff/" + props.StaffId);
        setStaff(response.data.result);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategory();
  }, []);

  return (
    staff && (
      <StaffForm
        name="Chỉnh sửa nhân viên"
        method="post"
        open={props.open}
        onClose={props.onClose}
        staff={staff}
        departments={props.departments}

      />
    )
  );
}

export default EditStaff;
