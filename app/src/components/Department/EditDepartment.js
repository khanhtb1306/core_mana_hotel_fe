import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import DepartmentForm from "../UI/DepartmentForm";

function EditDepartment(props) {
  const [department, setDepartment ] = useState(null);
  useEffect(() => {
    async function fetchCategory() {
      if(props.departmentId !==null )
      {
        try {
            const response = await axiosPrivate.get("staff/department/" + props.departmentId);
            setDepartment(response.data.result);
          } catch (error) {
            console.log(error);
          }
      }
    }
    fetchCategory();
  }, []);

  return (
    department && (
      <DepartmentForm
        name="Chỉnh sửa phòng ban"
        method="post"
        open={props.open}
        onClose={props.onClose}
        department={department}

      />
    )
  );
}

export default EditDepartment;
