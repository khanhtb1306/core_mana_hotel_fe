import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import dayjs from "dayjs";

function DetailsPriceInRoom(props) {
  const columns = [
    { field: "time", headerName: "Thời gian", width: 400 },
    { field: "price", headerName: "Đơn giá", width: 300 },
  ];
  const listPrices = props.listPrices;

  let rows = listPrices.map((price, index) => {
    const priceTime = price.split("|");
    return {
      id: index,
      time: priceTime[0],
      price: Number(priceTime[1]).toLocaleString(),
    };
  });

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      reset={props.onClose}
      button={true}
      size="w-.5/12 h-.5/6"
    >
      <div className="p-2 w-full">
        <div className="mb-5">
          <h1 className="text-lg pb-5 font-bold">Chi tiết tiền phòng</h1>
        </div>
        <div className="flex">
          <DataGrid
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

export default DetailsPriceInRoom;
