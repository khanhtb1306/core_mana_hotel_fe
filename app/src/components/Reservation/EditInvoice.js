import InvoiceFormModal from "./InvoiceFormModal";

function EditInvoice(props) {
  return (
    <InvoiceFormModal
      open={props.open}
      onClose={props.onClose}
      name="Chỉnh sửa hoá đơn"
      method="PUT"
      invoice={props.invoice}
      reservationDetail={props.reservationDetail}
    />
  );
}

export default EditInvoice;
