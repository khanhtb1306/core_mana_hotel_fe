import CustomerForm from "../UI/CustomerForm";

function NewCustomer(props) {
  return (
    <CustomerForm
      name="Thêm khách hàng mới"
      method="post"
      open={props.open}
      onClose={props.onClose}
      customer={{
        customerId: null,
        customerName: null,
        customerGroup: null,
        address: null,
        email: null,
        dob: null,
        gender: true,
        identity: null,
        nationality: null,
        phoneNumber: null,
        taxCode: null,
      }}
    />
  );
}

export default NewCustomer;
