import { Form } from "react-router-dom";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

function CreateInvoiceRoomModal(props) {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const columns = [
    { field: "idCateRoom", headerName: "Mã hạng phòng", width: 150 },
    { field: "name", headerName: "Tên hạng phòng", width: 200 },
  ];
  const rows = [
    {
      id: 1,
      idCateRoom: 1,
      name: "Hehe",
    },
  ];
  return (
    <Form onSubmit={() => props.onClose()}>
      <div
        onClick={props.onClose}
        className={`fixed inset-0 flex justify-center items-center transition-colors overflow-auto z-10 ${
          props.open ? "visible bg-black/20" : "invisible"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-white absolute top-0 right-0 rounded-xl shadow p-6 transition-all w-9/12 h-full ${
            props.open ? "scale-100 opacity-100" : "scale-125 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              props.onClose();
            }}
            className={`absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600`}
          >
            <i className="fa-solid fa-x"></i>
          </button>
          <div className="p-2 w-full">
            <h1 className="text-lg pb-10 font-bold">
              <button
                type="button"
                className="mr-2 px-2 rounded hover:bg-gray-200"
                onClick={props.onClose}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              Toạ hoá đơn mới
            </h1>
            <div className="w-full flex text-sm">
              <div className="w-9/12 pr-4 border-r-2 border-gray-500 border-dotted">
                <DataGrid
                  className="bg-white"
                  columns={columns}
                  rows={rows}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                  }}
                  rowSelectionModel={rowSelectionModel}
                />
              </div>
              <div className="w-3/12 ml-4">
                <div className="flex mt-2">
                  <div className="mr-auto">Tổng tiền</div>
                  <div className="ml-auto">3,800,000</div>
                </div>
                <div className="flex mt-2">
                  <div className="mr-auto">Giảm giá</div>
                  <div className="ml-auto">0</div>
                </div>
                <div className="flex mt-2">
                  <div className="mr-auto">Phí khác</div>
                  <div className="ml-auto">0</div>
                </div>
                <div className="flex mt-2">
                  <div className="mr-auto">Khách đã trả</div>
                  <div className="ml-auto">1,000,000</div>
                </div>
                <div className="flex mt-4">
                  <div className="mr-auto">Khách cần trả</div>
                  <div className="ml-auto">2,800,000</div>
                </div>
                <div className="mt-4 border-t-2 border-gray-500 border-dotted">
                  <div className="flex mt-4">
                    <div className="mr-auto">Lịch sử hoá đơn</div>
                  </div>
                  <div className="mt-2 mx-2 rounded p-2 border border-gray-300 border-dotted flex">
                    <div className="mr-auto">HD000001</div>
                    <div className="ml-auto">1,000,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex pt-5 absolute bottom-0 right-0">
            <div className="mr-10 mb-10 ml-auto">
              <button className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600">
                Hoàn thành
              </button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}

export default CreateInvoiceRoomModal;
