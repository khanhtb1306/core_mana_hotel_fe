import FundBookForm from "../UI/FundBookForm";

function NewFundBook(props) {
  return (
    <FundBookForm
      
      method="post"
      open={props.open}
      onClose={props.onClose}
      fundBook={{
        fundBookId: null,
        paidMethod: null,
        note: null,
        value: null,
        time: null,
        payerReceiver:null
      }}
      isIncome = {props.isIncome}
    />
  );
}

export default NewFundBook;
