import PriceBookForm from "../UI/PriceBookForm";

function NewPriceBook(props) {
  return (
    <PriceBookForm
      name="Thêm bảng giá phòng mới"
      method="post"
      open={props.open}
      onClose={props.onClose}
      priceBook={null}
    />
  );
}

export default NewPriceBook;