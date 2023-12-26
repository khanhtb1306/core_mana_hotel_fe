import { Box } from "@mui/material";
import * as React from "react";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import { defer, redirect, useLoaderData } from "react-router-dom";
import ButtonClick from "../../components/UI/ButtonClick";
import Swal from "sweetalert2";
import DeleteTransaction from "../../components/Transaction/DeleteTransaction";
import DetailTransaction from "../../components/Transaction/DetailTransaction";
import ButtonHover from "../../components/UI/ButtonHover";

function TransactionManagementPage() {
  const { transactions } = useLoaderData();

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewTransactionModal, setOpenNewTransactionModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [openDeleteTransactionModal, setOpenDeleteTransactionModal] =
    useState(false);
  const [openDetailsTransactionModal, setOpenDetailsTransactionModal] =
    useState(false);

  const deleteTransactionHandler = () => {
    setOpenDeleteTransactionModal(true);
  };
  const handleDetailsTransaction = (id) => {
    setOpenDetailsTransactionModal(true);
    setSelectedTransactionId(id);
  };

  const columns = [
    { field: "code", headerName: "Mã hóa đơn", width: 100 },
    { field: "createDate", headerName: "Ngày tạo", width: 150 },
    { field: "custormer", headerName: "Khách hàng", width: 200 },
    { field: "discount", headerName: "Giảm giá", width: 150 },
    { field: "total", headerName: "Tổng tiền", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    { field: "paid_method", headerName: "Phương thức thanh toán", width: 200 },
    {
      field: "actions",
      headerName: "Hoạt động",
      type: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<i className="fa-solid fa-eye"></i>}
            label="Xem chi tiết"
            onClick={() => handleDetailsTransaction(id)}
          />,
          // <GridActionsCellItem
          //   icon={<i className="fa-solid fa-trash"></i>}
          //   label="Xoá"
          //   onClick={() => {
          //     setSelectedTransactionId(id);
          //     deleteTransactionHandler();
          //   }}
          // />,
        ];
      },
    },
  ];

  const rows = Array.isArray(transactions)
    ? transactions
        .filter((transaction) => transaction.invoice.invoiceId !== "HD000000")
        .map((transaction) => {
          const dateNow = new Date(transaction.invoice.createdDate);
          const year = dateNow.getFullYear();
          const month = String(dateNow.getMonth() + 1).padStart(2, "0");
          const day = String(dateNow.getDate()).padStart(2, "0");
          const formattedDate = `${day}-${month}-${year}`;

          return {
            id: transaction.invoice.invoiceId,
            code: transaction.invoice.invoiceId,
            createDate: formattedDate,
            custormer: transaction.invoice.customer.customerName,
            discount: transaction.invoice.discount,
            total: (transaction.invoice.total + transaction.invoice.priceOther -  transaction.invoice.discount).toLocaleString()  + " VND ",
            status: transaction.invoice.status === "COMPLETE" ? "Hoàn thành" : transaction.invoice.status === "C" ? "Lưu tạm" : "Hủy",
            paid_method: transaction.fundBook.paidMethod

        };
    }) : [];

  const newTransactionHandler = () => {
    setOpenNewTransactionModal(true);
  };

  return (
    <>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex mb-10">
          <h1 className="text-4xl">Hóa đơn</h1>
          <div className="ml-auto flex">
            {rowSelectionModel.length > 0 ? (
              <div className="mx-2">
                <ButtonHover
                  action="Thao tác"
                  iconAction="fa-solid fa-ellipsis-vertical"
                  names={[
                    {
                      name: "Xoá hóa đơn",
                      icon: "fa-solid fa-trash",
                      action: deleteTransactionHandler,
                    },
                  ]}
                />
              </div>
            ) : null}
            {/* <div className="mx-2">
                            <ButtonClick
                                name="Thêm mới hóa đơn"
                                iconAction="fa-solid fa-plus"
                                action={newTransactionHandler}
                            />
                        </div> */}
          </div>
        </div>
        <div className={`${rows.length <= 0 && "h-60"}`}>
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
            slots={{
              toolbar: GridToolbar,
              noRowsOverlay: () => (
                <div className="pt-8 text-center">
                  Không có hoá đơn nào, hãy tạo hoá đơn mới!
                </div>
              ),
            }}
          />
        </div>
      </Box>

      {openDetailsTransactionModal && selectedTransactionId && (
        <DetailTransaction
          open={openDetailsTransactionModal}
          onClose={() => setOpenDetailsTransactionModal(false)}
          TransactionId={selectedTransactionId}
        />
      )}
      {openDeleteTransactionModal && rowSelectionModel && (
        <DeleteTransaction
          open={openDeleteTransactionModal}
          onClose={() => setOpenDeleteTransactionModal(false)}
          listCateRoomId={rowSelectionModel}
        />
      )}
      {openDeleteTransactionModal && selectedTransactionId && (
        <DeleteTransaction
          open={openDeleteTransactionModal}
          onClose={() => setOpenDeleteTransactionModal(false)}
          listCateRoomId={selectedTransactionId}
        />
      )}
    </>
  );
}

export default TransactionManagementPage;

async function loadTransactions() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("invoice");
  return response.data.result;
}

export async function loader() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  return defer({
    transactions: await loadTransactions(),
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const formData = new FormData();

  if (data.get("transactionId") != null) {
    formData.append("transactionId", data.get("transactionId"));
  }

  formData.append("TransactionName", data.get("TransactionName"));
  formData.append("username", data.get("userName"));
  formData.append("phoneNumber", data.get("phoneNumber"));
  formData.append("role", "ROLE_RECEPTIONIST");
  formData.append("dob", new Date(data.get("dob")).toISOString());
  formData.append("email", data.get("email"));
  formData.append("address", data.get("address"));
  formData.append("identity", data.get("identity"));
  formData.append("taxCode", data.get("taxCode"));
  formData.append("gender", data.get("gender"));
  formData.append("image", data.get("image"));
  formData.append("departmentId", data.get("departmentId"));

  if (method === "POST") {
    const response = await axiosPrivate
      .post("transaction", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.data.displayMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: response.data.displayMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data.result,
          showConfirmButton: false,
          timer: 1500,
        });
      });

    return redirect("/manager/transactionManagement");
  }
  return redirect("/manager/transactionManagement");
}
