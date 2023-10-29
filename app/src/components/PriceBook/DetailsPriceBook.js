import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import { useEffect, useState } from "react";

function DetailsPriceBook(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openListPrice, setOpenListPrice] = useState(false);

  const priceBook = props.priceBook;
  console.log(props.priceBook);

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenListPrice(false);
  };

  const handleListPrice = () => {
    setOpenInfo(false);
    setOpenListPrice(true);
  };

  const transferDate = (dateTampt) => {
    const date = new Date(dateTampt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const columnsRoom = [
    { field: "nameCateRoom", headerName: "Hạng phòng", width: 150 },
    { field: "date", headerName: "Ngày lưu trú", width: 200 },
    { field: "typePrice", headerName: "Loại giá", width: 200 },
    { field: "Price", headerName: "Giá tiền", width: 200 },
  ];

  let rowsRoom = priceBook.ListPriceListDetail.map((details, index) => {
    return {
        id: index
    }
  });

  return (
    props.priceBook && (
      <Modal
        open={props.open}
        onClose={props.onClose}
        reset={props.onClose}
        button={true}
        size="w-8/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thông tin hạng phòng</h1>
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
                    openListPrice ? "border-b-2 border-green-500 ring-0" : ""
                  }`}
                  onClick={handleListPrice}
                >
                  Giá phòng
                </button>
              </div>
            </div>
          </div>
          {openInfo ? (
            <>
              <div className="flex">
                <div className="w-5/12">
                  <table className="m-4 w-full">
                    <tbody>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Mã bảng giá:</td>
                        <td className="w-7/12 pt-2">
                          {priceBook.PriceList.priceListId}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Tên bảng giá:</td>
                        <td className="w-7/12 pt-2">
                          {priceBook.PriceList.priceListName}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Trạng thái:</td>
                        <td className="w-7/12 pt-2">
                          {priceBook.PriceList.status === 1
                            ? "Đang hoạt động"
                            : "Ngừng hoạt động"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="w-7/12 mx-5">
                  <table className="m-4 w-full">
                    <tbody>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Thời gian hiệu lực:</td>
                        <td className="w-7/12 pt-2">{`${transferDate(
                          priceBook.PriceList.effectiveTimeStart
                        )} đến ${transferDate(
                          priceBook.PriceList.effectiveTimeEnd
                        )}`}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Ghi chú:</td>
                        <td className="w-7/12 pt-2">{priceBook.PriceList.note}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
          {openListPrice ? (
            <>
              <DataGrid
                columns={columnsRoom}
                rows={rowsRoom}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 25]}
              />
            </>
          ) : null}
        </div>
      </Modal>
    )
  );
}

export default DetailsPriceBook;
