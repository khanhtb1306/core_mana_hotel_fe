import ServiceForm from "../UI/ServiceForm";

function EditService(props) {
  return (
    <ServiceForm
      name="Thêm dịch vụ mới"
      method="put"
      open={props.open}
      onClose={props.onClose}
      product={props.product}
    />
  );
}

export default EditService;