import PriceBookForm from "../UI/PriceBookForm";

function EditPriceBook(props) {
  return (
    <PriceBookForm
      name="Chỉnh sửa bảng giá phòng"
      method="post"
      open={props.open}
      onClose={props.onClose}
      priceBook={props.priceBook}
    />
  );
}

export default EditPriceBook;