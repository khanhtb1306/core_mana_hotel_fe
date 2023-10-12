import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import { useState } from "react";

function DetailsCustomer(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openTrans, setOpenTrans] = useState(false);

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenTrans(false);
  };

  const handleTrans = () => {
    setOpenInfo(false);
    setOpenTrans(true);
  };

  const columns = [
    { field: "code", headerName: "Mã hoá đơn", width: 150 },
    { field: "time", headerName: "Thời gian", width: 200 },
    { field: "receptionist", headerName: "Thu ngân", width: 150 },
    { field: "sum", headerName: "Tổng cộng", width: 150 },
  ];

  const rows = [
    {
      id: 1,
      code: "HD000001",
      time: "26/09/2023 10:00",
      receptionist: "tien",
      sum: "1,000,000",
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
          <h1 className="text-lg pb-5 font-bold">Thông tin khách hàng</h1>
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
                    openTrans ? "border-b-2 border-green-500 ring-0" : ""
                }`}
                onClick={handleTrans}
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
                      <td className="w-5/12 pt-2">Mã khách hàng:</td>
                      <td className="w-7/12 pt-2">KH000001</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Tên khách hàng:</td>
                      <td className="w-7/12 pt-2">Tiến</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Ngày sinh:</td>
                      <td className="w-7/12 pt-2">26/10/2001</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Điện thoại</td>
                      <td className="w-7/12 pt-2">0981987625</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Địa chỉ:</td>
                      <td className="w-7/12 pt-2">...</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Giới tính:</td>
                      <td className="w-7/12 pt-2">Nam</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Email</td>
                      <td className="w-7/12 pt-2">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
        {openTrans ? (
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

export default DetailsCustomer;