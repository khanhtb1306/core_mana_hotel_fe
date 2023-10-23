import ProductForm from "../UI/ProductForm";

function EditProduct(props) {
  return (
    <ProductForm
      name="Sửa hàng hoá"
      method="put"
      open={props.open}
      onClose={props.onClose}
      product={props.product}
    />
  );
}

export default EditProduct;
