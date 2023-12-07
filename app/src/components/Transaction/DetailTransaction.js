import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import TransactionForm from "../UI/TransactionForm";

function DetailTransaction(props) {
  const [transaction, setTransaction] = useState(null);
  useEffect(() => {
    if (props.TransactionId !== null) {
        async function fetch() {
            try {

                const response = await axiosPrivate.get("invoice/" + props.TransactionId);
                setTransaction(response.data.result);
                console.log(response.data.result);

            } catch (error) {
                console.log(error);
            }
        }
        fetch();
    }
}, []);

  return (
    transaction && (
      <TransactionForm
        name="Chi tiết hoá đơn"
        method="post"
        open={props.open}
        onClose={props.onClose}
        transaction={transaction}

      />
    )
  );
}

export default DetailTransaction;