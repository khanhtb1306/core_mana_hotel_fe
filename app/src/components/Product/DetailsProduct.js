import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import { useState } from "react";

function DetailsProduct(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openWarehouse, setOpenWarehouse] = useState(false);

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenWarehouse(false);
  };

  const handleWarehouse = () => {
    setOpenInfo(false);
    setOpenWarehouse(true);
  };

  const columns = [
    { field: "code", headerName: "Chứng từ", width: 150 },
    { field: "method", headerName: "Phương thức", width: 150 },
    { field: "time", headerName: "Thời gian", width: 150 },
    { field: "capitalPrice", headerName: "Giá vốn", width: 150 },
    { field: "amount", headerName: "Số lượng", width: 150 },
    { field: "inventory", headerName: "Tồn cuối", width: 150 },
  ];

  const rows = [
    {
      id: 1,
      code: "HD000001",
      method: "Bán hàng",
      time: "26/09/2023",
      capitalPrice: "20,000",
      amount: "-100",
      inventory: "900",
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
          <h1 className="text-lg pb-5 font-bold">Thông tin hàng hoá</h1>
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
                    openWarehouse ? "border-b-2 border-green-500 ring-0" : ""
                }`}
                onClick={handleWarehouse}
              >
                Thẻ kho
              </button>
            </div>
          </div>
        </div>
        {openInfo ? (
          <>
            <div className="flex">
              <div className="w-4/12">
                <ImageDisplay />
              </div>
              <div className="w-8/12">
                <table className="m-4 w-full text-xl">
                  <tbody>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Mã hàng hoá:</td>
                      <td className="w-7/12 pt-2">SP000001</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Loại hàng:</td>
                      <td className="w-7/12 pt-2">Hàng hoá</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Định mức tồn:</td>
                      <td className="w-7/12 pt-2">0 {'>'} 100000</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Giá bán:</td>
                      <td className="w-7/12 pt-2">18,000</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Giá vốn:</td>
                      <td className="w-7/12 pt-2">10,000</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Vị trí:</td>
                      <td className="w-7/12 pt-2">...</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Trọng lượng</td>
                      <td className="w-7/12 pt-2">...</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Mô tả chi tiết</td>
                      <td className="w-7/12 pt-2">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
        {openWarehouse ? (
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

export default DetailsProduct;
