import ServiceForm from "../UI/ServiceForm";

function NewService(props) {
  return (
    <ServiceForm
      name="Thêm dịch vụ mới"
      method="post"
      open={props.open}
      onClose={props.onClose}
      product={{
        goods: {
          goodsId: null,
          goodsName: null,
          goodsCategory: null,
          status: null,
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

export default NewService;
