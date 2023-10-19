import ProductForm from "../UI/ProductForm";

function NewProduct(props) {
  return (
    <ProductForm
      name="Thêm hàng hoá mới"
      method="post"
      open={props.open}
      onClose={props.onClose}
      product={{
        goods: {

        },
        listGoodsUnit: [
          {}
        ]
      }}
    />
  );
}

export default NewProduct;
