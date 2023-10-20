import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import { useState } from "react";

function DetailsService(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openWastage, setOpenWastage] = useState(false);
  const service = props.service;

  const defaultVal = service.listGoodsUnit.find((unit) => unit.isDefault);

  const name = service.goods.goodsName + " (" + defaultVal.goodsUnitName + ")";

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenWastage(false);
  };

  const handleWastage = () => {
    setOpenInfo(false);
    setOpenWastage(true);
  };

  const columns = [
    { field: "code", headerName: "Mã hàng hoá", width: 150 },
    { field: "wastage", headerName: "Tên nguyên liệu tiêu hao", width: 250 },
    { field: "amount", headerName: "Số lượng", width: 150 },
  ];

  const rows = [
    {
      id: 1,
      code: "HH000001",
      wastage: "Bim bim",
      amount: "1",
    },
  ];

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      reset={props.onClose}
      button={true}
      size="w-8/12 h-4/6"
    >
      <div className="p-2 w-full">
        <div className="mb-5">
          <h1 className="text-lg pb-5 font-bold">Thông tin dịch vụ</h1>
          <div className="flex w-5/12">
            <div className="w-6/12">
              <button
                className={`border-0 border-b border-gray-500 w-full ${
                  openInfo ? "border-b-2 border-green-500 ring-0" : ""
                }`}
                onClick={handleInfo}
              >
                Thông tin
              </button>
            </div>
            <div className="w-6/12">
              <button
                className={`border-0 border-b border-gray-500 w-full ${
                  openWastage ? "border-b-2 border-green-500 ring-0" : ""
                }`}
                onClick={handleWastage}
              >
                Nguyên liệu tiêu hao
              </button>
            </div>
          </div>
        </div>
        {openInfo ? (
          <>
            <div className="flex">
              <div className="w-4/12">
                <h2 className="text-lg pb-5 font-bold">{name ? name : ""}</h2>
                <ImageDisplay
                  image1={
                    service.goods.image
                      ? `data:image/png;base64,${service.goods.image}`
                      : null
                  }
                  image2={
                    service.goods.image
                      ? `data:image/png;base64,${service.goods.image}`
                      : null
                  }
                  image3={
                    service.goods.image
                      ? `data:image/png;base64,${service.goods.image}`
                      : null
                  }
                />
              </div>
              <div className="w-8/12 px-5">
                <table className="m-4 w-full">
                  <tbody>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Mã dịch vụ:</td>
                      <td className="w-7/12 pt-2">
                        {service.goods.goodsId ? service.goods.goodsId : ""}
                      </td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Loại hàng:</td>
                      <td className="w-7/12 pt-2">Dịch vụ</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Giá bán:</td>
                      <td className="w-7/12 pt-2">
                        {defaultVal.price ? defaultVal.price : 0}
                      </td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Giá vốn:</td>
                      <td className="w-7/12 pt-2">
                        {defaultVal.cost ? defaultVal.cost : 0}
                      </td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Mô tả chi tiết</td>
                      <td className="w-7/12 pt-2">
                        {service.goods.description
                          ? service.goods.description
                          : ""}
                      </td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Chú ý</td>
                      <td className="w-7/12 pt-2">
                        {service.goods.note ? service.goods.note : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
        {openWastage ? (
          <>
            <DataGrid
              columns={columns}
              rows={rows}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          </>
        ) : null}
      </div>
    </Modal>
  );
}

export default DetailsService;
