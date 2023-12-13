import Modal from "../UI/Modal";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

function FuncBooksModal(props) {
  const listFunds = props.listFunds;
  console.log(listFunds);
  const columns = [
    { field: "idFund", headerName: "Mã phiếu thu", width: 150 },
    { field: "time", headerName: "Thời gian", width: 200 },
    { field: "price", headerName: "Tiền thu", width: 200 },
    { field: "method", headerName: "Phương thức", width: 200 },
  ];
  const rows = listFunds.map((fund, index) => {
    return {
      id: index,
      idFund: fund.fundBookId,
      time: dayjs(fund.time).format("DD/MM/YYYY HH:mm"),
      price: fund.value.toLocaleString(),
      method: fund.paidMethod === "CASH" ? "Tiền mặt" : "Chuyển khoản",
    };
  });

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      button={true}
      size="w-7/12 h-.5/6"
    >
      <div className="p-2 w-full">
        <div className="mb-5">
          <h1 className="text-lg pb-5 font-bold">{props.name}</h1>
        </div>
        <div>
          <DataGrid
            className="bg-white"
            columns={columns}
            rows={rows}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </div>
      </div>
    </Modal>
  );
}

export default FuncBooksModal;
