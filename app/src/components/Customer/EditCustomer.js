import { useEffect, useState } from "react";
import { axiosConfig } from "../../utils/axiosConfig";
import CustomerForm from "../UI/CustomerForm";

function EditCustomer(props) {
  const [customer, setCustomer] = useState(null);
  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axiosConfig.get("customer/" + props.customerId);
        setCustomer(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategory();
  }, []);

  return (
    customer && (
      <CustomerForm
        name="Chỉnh sửa khách hàng"
        method="put"
        open={props.open}
        onClose={props.onClose}
        customer={customer}
      />
    )
  );
}

export default EditCustomer;
