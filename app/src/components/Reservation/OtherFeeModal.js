import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

function OtherFeeModal(props) {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const otherFees = props.otherFees.LIST_OTHER_REVENUE_DETAIL;
  const invoicePrice = props.invoicePrice;
  const columns = [
    { field: "idFee", headerName: "Mã thu khác", width: 150 },
    { field: "typeFee", headerName: "Loại thu", width: 200 },
    { field: "priceFee", headerName: "Mức thu", width: 200 },
    { field: "priceInvoice", headerName: "Thu trên hoá đơn", width: 200 },
  ];
  const rows = otherFees.map((fee) => {
    let priceInvoice = 0;
    if (fee.typeValue === "%") {
      priceInvoice = (invoicePrice * fee.policyValue) / 100;
    } else {
      priceInvoice = fee.policyValue;
    }
    return {
      id: fee.policyDetailId,
      idFee: fee.policyDetailId,
      typeFee: fee.type,
      priceFee: (fee.policyValue + " " + fee.typeValue).toLocaleString(),
      priceInvoice: priceInvoice.toLocaleString(),
    };
  });
  useEffect(() => {
    const listSelectedFee = otherFees.filter((fee) =>
      rowSelectionModel.includes(fee.policyDetailId)
    );
    let price = 0;
    listSelectedFee.map((fee) => {
      if (fee.typeValue === "%") {
        price += (invoicePrice * fee.policyValue) / 100;
      } else {
        price += fee.policyValue;
      }
    });
    props.changePrice(price);
  }, [rowSelectionModel]);
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      button={true}
      size="w-7/12 h-.5/6"
    >
      <div className="p-2 w-full">
        <div className="mb-5">
          <h1 className="text-lg pb-5 font-bold">Các khoản thu khác</h1>
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
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
          />
        </div>
      </div>
    </Modal>
  );
}

export default OtherFeeModal;
