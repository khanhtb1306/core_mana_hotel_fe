import StaffForm from "../UI/StaffForm";

function NewStaff(props) {
  return (
    <StaffForm
      name="Thêm nhân viên mới"
      method="post"
      open={props.open}
      onClose={props.onClose}
      departments={props.departments}
      staff={{
        staffId: null,
        staffName: null,
        userName: null,
        password: null,
        role: null,
        status: null,
        dob: null,
        address: null,
        email: null,
        gender: true,
        identity: null,
        taxCode: null,
        phoneNumber: null,
      }}
    />
  );
}

export default NewStaff;
