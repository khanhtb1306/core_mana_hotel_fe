import ImportGoodsForm from "../UI/ImportGoodsForm";

function NewImportGoods(props) {
  return (
    <ImportGoodsForm
      name="Nhập hàng mới"
      method="post"
      open={props.open}
      onClose={props.onClose}
      importGoods={{
        importGoodsId:null,
        timeImport:null,
        supplier:null,
        paid:null,
        status:null,
        
      }}
      importGoodsDetail={null}
    />
  );
}

export default NewImportGoods;
