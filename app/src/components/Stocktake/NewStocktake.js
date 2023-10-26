import StocktakeForm from "../UI/StocktakeForm";

function NewStocktake(props) {
  return (
    <StocktakeForm
      name="Thêm phiếu kiểm kho mới"
      method="post"
      open={props.open}
      onClose={props.onClose}
      stocktake={{}}
    />
  );
}

export default NewStocktake;
