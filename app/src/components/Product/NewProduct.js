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
          goodsId: null,
          goodsName: null,
          goodsCategory: null,
          status: null,
          inventory: null,
          minInventory: null,
          maxInventory: null,
          note: null,
          description: null,
          image: null,
        },
        listGoodsUnit: [
          {
            goodsUnitId: null,
            goodsUnitName: null,
            cost: null,
            price: null,
            isDefault: null,
          },
        ],
      }}
    />
  );
}

export default NewProduct;
