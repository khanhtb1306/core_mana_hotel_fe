import ProductForm from "../UI/ProductForm";

function EditProduct(props) {
  console.log(props.product);
  return (
    <ProductForm
      name="Sửa hàng hoá"
      method="method"
      open={props.open}
      onClose={props.onClose}
      product={props.product}
    />
  );
}

export default EditProduct;
