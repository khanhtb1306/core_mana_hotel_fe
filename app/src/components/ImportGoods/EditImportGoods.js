import ImportGoodsForm from "../UI/ImportGoodsForm";
import { useEffect, useState } from "react";
import { axiosPrivate } from "../../utils/axiosConfig";

function EditImportGoods(props) {
  const [importGoods, setImportGoods] = useState(null);
  const [importGoodsDetail, setImportGoodsDetail] = useState(null);
  useEffect(() => {
    async function fetchCategory() {
      if (props.importGoodsId !== null) {
        try {
          const response = await axiosPrivate.get("import-goods/details/" + props.importGoodsId);
          setImportGoods(response.data.result.ImportGoods);
          setImportGoodsDetail(response.data.result.ListDetail)
        } catch (error) {
          console.log(error);
        }
      }

    }
    fetchCategory();
  }, []);

  return (
    importGoods && (<ImportGoodsForm
      name="Chỉnh sửa nhập hàng"
      method="put"
      open={props.open}
      onClose={props.onClose}
      importGoods={importGoods}
      importGoodsDetail={importGoodsDetail}
    />)
  );
}

export default EditImportGoods;