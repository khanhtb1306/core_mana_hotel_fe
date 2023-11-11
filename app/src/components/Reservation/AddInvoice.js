import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import InvoiceFormModal from "./InvoiceFormModal";

function AddInvoice(props) {
  return (
    <InvoiceFormModal
      open={props.open}
      onClose={props.onClose}
      name="Thêm hoá đơn"
      invoice={null}
    />
  );
}

export default AddInvoice;
