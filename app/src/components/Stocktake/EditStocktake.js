import StocktakeForm from "../UI/StocktakeForm";

function EditStocktake(props) {
  return (
    <StocktakeForm
      name="Chỉnh sửa phiếu kiểm kho"
      method="put"
      open={props.open}
      onClose={props.onClose}
      stocktake={props.stocktake}
    />
  );
}

export default EditStocktake;