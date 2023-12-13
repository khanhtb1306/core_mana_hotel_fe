import DepartmentForm from "../UI/DepartmentForm";
function NewDepartment(props) {
  return (
    <DepartmentForm
      name="Thêm phòng ban mới"
      method="post"
      open={props.open}
      onClose={props.onClose}
      department={{
        departmentId: null,
        departmentName: null,
        status: null,
      
      }}
    />
  );
}

export default NewDepartment;
