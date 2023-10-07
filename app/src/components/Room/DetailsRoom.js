import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import { useState } from "react";

function DetailsRoom(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openTransition, setOpenTransition] = useState(false);
  const [openCleaning, setOpenCleaning] = useState(false);

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenTransition(false);
    setOpenCleaning(false);
  };

  const handleTransition = () => {
    setOpenInfo(false);
    setOpenTransition(true);
    setOpenCleaning(false);
  };

  const handleCleaning = () => {
    setOpenInfo(false);
    setOpenTransition(false);
    setOpenCleaning(true);
  };

  const columnsTrans = [
    { field: "idBill", headerName: "Mã hoá đơn", width: 150 },
    { field: "time", headerName: "Thời gian", width: 200 },
    { field: "recept", headerName: "Lễ tân", width: 100 },
    { field: "sum", headerName: "Tổng cộng", width: 150 },
  ];

  const rowsTrans = [
    {
      id: 1,
      idBill: "HD000075",
      time: "26/09/2023",
      recept: "tien",
      sum: 5000000,
    },
  ];

  const columnsCleaning = [
    { field: "time", headerName: "Thời gian", width: 250 },
    { field: "work", headerName: "Công việc", width: 200 },
  ];

  const rowsCleaning = [
    {
      id: 1,
      time: "22:06 26/09/2023",
      work: "Chuyển sang chưa dọn",
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
          <h1 className="text-lg pb-5 font-bold">Thông tin phòng</h1>
          <div className="flex w-5/12">
            <div className="w-3/12">
              <button
                className={`border-0 border-b border-gray-500 w-full ${
                  openInfo ? "border-b-2 border-green-500 ring-0" : ""
                }`}
                onClick={handleInfo}
              >
                Thông tin
              </button>
            </div>
            <div className="w-4/12">
              <button
                className={`border-0 border-b border-gray-500 w-full ${
                  openTransition ? "border-b-2 border-green-500 ring-0" : ""
                }`}
                onClick={handleTransition}
              >
                Lịch sử giao dịch
              </button>
            </div>
            <div className="w-5/12">
              <button
                className={`border-0 border-b border-gray-500 w-full ${
                  openCleaning ? "border-b-2 border-green-500 ring-0" : ""
                }`}
                onClick={handleCleaning}
              >
                Lịch sử dọn dẹp
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
                      <td className="w-5/12 pt-2">Tên phòng:</td>
                      <td className="w-7/12 pt-2">P.201</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Hạng phòng:</td>
                      <td className="w-7/12 pt-2">
                        Phòng 01 giường đôi cho 2 người
                      </td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Khu vực:</td>
                      <td className="w-7/12 pt-2">Tầng 2</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Giá theo giờ:</td>
                      <td className="w-7/12 pt-2">180,000</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Giá theo ngày:</td>
                      <td className="w-7/12 pt-2">720,000</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Giá theo đêm:</td>
                      <td className="w-7/12 pt-2">720,000</td>
                    </tr>
                    <tr className="border-0 border-b">
                      <td className="w-5/12 pt-2">Bắt đầu sử dụng:</td>
                      <td className="w-7/12 pt-2">24/09/2023</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
        {openTransition ? (
          <>
            <DataGrid
              columns={columnsTrans}
              rows={rowsTrans}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          </>
        ) : null}
        {openCleaning ? (
          <>
            <DataGrid
              columns={columnsCleaning}
              rows={rowsCleaning}
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

export default DetailsRoom;
