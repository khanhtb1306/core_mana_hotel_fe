import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import FundBookForm from "../UI/FundBookForm";

function EditFundBook(props) {
  const [fundBook, setfundBook ] = useState(null);
  const [isIncome, setIsIncome ] = useState(true);
  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axiosPrivate.get("fund-book/" + props.fundBookId);
        setfundBook(response.data.result);
        if(response.data.result.type === "EXPENSE" ||response.data.result.type === "OTHER_EXPENSE")
        {
          setIsIncome(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategory();
  }, []);

  return (
    fundBook && (
      <FundBookForm
        name="Phiếu thu"
        method="put"
        open={props.open}
        onClose={props.onClose}
        fundBook={fundBook}
        isIncome={isIncome}
      />
    )
  );
}

export default EditFundBook;
