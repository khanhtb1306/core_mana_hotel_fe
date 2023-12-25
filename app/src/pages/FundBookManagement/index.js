import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useState, useEffect,useRef } from "react";
import ButtonHover from "../../components/UI/ButtonHover";
import dayjs from "dayjs";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import { defer, redirect, useLoaderData } from "react-router-dom";
import ButtonClick from "../../components/UI/ButtonClick";
import Swal from "sweetalert2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import NewFundBook from "../../components/FundBook/NewFundBook";
import EditFundBook from "../../components/FundBook/EditFundBook";
import DetailsFundBook from "../../components/FundBook/DetailsFundBook";
import { useReactToPrint } from "react-to-print";

function FundBookManagementPage() {
  let { data } = useLoaderData();
  let { dataSummary } = useLoaderData();

  const [fundBooks, setFundBooks] = useState(data);
  const [fundBooksSummary, setFundBooksSummary] = useState(dataSummary);

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewFundBookExpenseModal, setOpenNewFundBookExpenseModal] =
    useState(false);
  const [openNewFundBookOutComeModal, setOpenNewFundBookOutComeModal] =
    useState(false);
  const [openEditFundBookModal, setOpenEditFundBookModal] = useState(false);
  const [openDetailsFundBookModal, setOpenDetailsFundBookModal] =
    useState(false);
  const [selectedFundBookId, setSelectedFundBookId] = useState(null);

  const handleDropdownChange = (event) => {
    setselectedValue(event.target.value);
  };

  const [selectedValue, setselectedValue] = useState("1");
  const [month, setMonth] = useState(dayjs());
  const [year, setYear] = useState(dayjs());

  const options = [
    { value: 1, name: "Theo tháng" },
    { value: 2, name: "Theo năm" },
  ];

  useEffect(() => {
    async function fetchListInvoices() {
      let response = null;
      let responseSummary = null;
      let formattedDate = null;
      let formData = new FormData();

      try {
        if (selectedValue === "1") {
          formattedDate = month.format("YYYY/MM/DD").toString();
          formData.append("time", formattedDate);
          formData.append("isMonth", true);
          const urlSearchParams = new URLSearchParams(formData);
          response = await axiosPrivate.get("fund-book?" + urlSearchParams, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          responseSummary = await axiosPrivate.get(
            "fund-book/summary?" + urlSearchParams,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setFundBooks(response.data.result);
          setFundBooksSummary(responseSummary.data.result);
        } else {
          formattedDate = year.format("YYYY/MM/DD").toString();
          formData.append("time", formattedDate);
          formData.append("isMonth", false);
          const urlSearchParams = new URLSearchParams(formData);
          response = await axiosPrivate.get("fund-book?" + urlSearchParams, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          responseSummary = await axiosPrivate.get(
            "fund-book/summary?" + urlSearchParams,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setFundBooks(response.data.result);
          setFundBooksSummary(responseSummary.data.result);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchListInvoices();
  }, [month, year, selectedValue, data, dataSummary]);

  const handleDetailsFundBook = (id) => {
    setOpenDetailsFundBookModal(true);
    setSelectedFundBookId(id);
  };

  const handleEditFundBook = (id) => {
    setOpenEditFundBookModal(true);
    setSelectedFundBookId(id);
  };

  const printBookingRef = useRef();
  const handleBookingPrint = useReactToPrint({
    content: () => printBookingRef.current,
  });

  const columns = [
    { field: "code", headerName: "Số hiệu chứng từ", width: 150 },
    { field: "time", headerName: "Ngày", width: 100 },
    { field: "note", headerName: "Diễn giải", width: 150 },
    { field: "paidMethod", headerName: "Hình thức thanh toán", width: 200 },
    { field: "valueIncome", headerName: "Thu", width: 100 },
    { field: "valueExpense", headerName: "Chi", width: 100 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    { field: "payerReceiver", headerName: "Người nhận/nộp", width: 150 },
    {
      field: "actions",
      headerName: "Hoạt động",
      type: "actions",
      width: 200,
      getActions: (params) => {
        const row = params.row;
        // const date = new Date();
        const date = new Date();

        const dateNow = new Date(date);
        const year = dateNow.getFullYear();
        const month = String(dateNow.getMonth() + 1).padStart(2, "0");
        const day = String(dateNow.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        return [
          <>
            {row.time === formattedDate && (
              <>
                <GridActionsCellItem
                  icon={<i className="fa-solid fa-eye"></i>}
                  label="Xem chi tiết"
                  onClick={() => handleDetailsFundBook(row.id)}
                />
                <GridActionsCellItem
                  icon={<i className="fa-solid fa-pen-to-square"></i>}
                  label="Sửa đổi"
                  onClick={() => handleEditFundBook(row.id)}
                />
                <GridActionsCellItem
                  icon={<i className="fa-solid fa-print"></i>}
                  label="In"
                  onClick={() => handleBookingPrint()}
                  onMouseOver={() => {
                    setSelectedFundBookId(row.id);
                  }}
                  onMouseLeave={() => {
                    setSelectedFundBookId(null);
                  }}
                />
              </>
            )}
            {row.time !== formattedDate && (
              <GridActionsCellItem
                icon={<i className="fa-solid fa-print"></i>}
                label="In"
                onClick={() => handleBookingPrint()}
                onMouseOver={() => {
                  setSelectedFundBookId(row.id);
                }}
                onMouseLeave={() => {
                  setSelectedFundBookId(null);
                }}
              />
            )}


          </>
        ];
      },
    },
  ];

  const rows = Array.isArray(fundBooks) ? fundBooks.filter((fundBook) => fundBook.value > 0 && fundBook.value !==0).map((fundBook) => {
    const dateNow = new Date(fundBook.time);
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, "0");
    const day = String(dateNow.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    if (fundBook.type === "INCOME" || fundBook.type === "OTHER_INCOME") {
      return {
        id: fundBook.fundBookId,
        code: fundBook.fundBookId,
        time: formattedDate,
        note: fundBook.note,
        paidMethod: fundBook.paidMethod === "BANK" ? "Chuyển khoản" : "Tiền mặt",
        valueIncome: fundBook.value.toLocaleString() + " VND",
        valueExpense: 0 + " VND",
        status: fundBook.status === "COMPLETE" ? "Hoàn tất" : "Hủy bỏ",
        payerReceiver: fundBook.payerReceiver

      };
    }
    return {
      id: fundBook.fundBookId,
      code: fundBook.fundBookId,
      time: formattedDate,
      note: fundBook.note
      //  === "INCOME" ? 'Thu nhập' : fundBook.type === "OTHER_INCOME" ? 'Thu nhập khác' : fundBook.type === "OTHER_EXPENSE" ? 'Chi phí khác' : 'Chi phí'
      ,
      paidMethod: fundBook.paidMethod === "BANK" ? "Chuyển khoản" : "Tiền mặt",
      valueIncome: 0 + " VND",
      valueExpense: fundBook.value.toLocaleString() + " VND",
      status: fundBook.status === "COMPLETE" ? "Hoàn tất" : "",
      payerReceiver: fundBook.payerReceiver
    };

  }) : [];

  const newFundBookOutComeHandler = () => {
    setOpenNewFundBookOutComeModal(true);
  };
  const newFundBookExpenseHandler = () => {
    setOpenNewFundBookExpenseModal(true);
  };

  return (
    <>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex mb-10">
          <h1 className="text-4xl">Sổ quỹ</h1>
          <div className="ml-auto flex">
            <div className=" flex justify-between">
              <div className="">
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="vi-VN"
                >
                  {selectedValue === "1" ? (
                    <DatePicker
                      sx={{ ".MuiInputBase-input": { padding: 1, width: 100 } }}
                      value={month}
                      onChange={(e) => {
                        setMonth(e);
                      }}
                      format="MMM YYYY"
                      views={["month", "year"]}
                    />
                  ) : (
                    <DatePicker
                      sx={{ ".MuiInputBase-input": { padding: 1, width: 100 } }}
                      value={year}
                      onChange={(e) => {
                        setYear(e);
                      }}
                      format="YYYY"
                      views={["year"]}
                    />
                  )}
                </LocalizationProvider>
              </div>
              <div className="ml-2">
                <select
                  className="rounded"
                  value={selectedValue}
                  onChange={(event) => handleDropdownChange(event)}
                >
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mx-2">
              <ButtonClick
                name="Lập phiếu thu"
                iconAction="fa-solid fa-plus"
                action={newFundBookOutComeHandler}
              />
            </div>
            <div className="mx-2">
              <ButtonClick
                name="Lập phiếu chi"
                iconAction="fa-solid fa-plus"
                action={newFundBookExpenseHandler}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end bg-white mb-3">
          <div className="mx-5">
            <div className="text-lg">Quỹ đầu kì:</div>
            <div className="text-lg text-gray-400">
              {fundBooksSummary?.openingBalance.toLocaleString()}
            </div>
          </div>
          <div className="mx-5">
            <div className="text-lg">Tổng thu:</div>
            <div className="text-lg text-green-400">
              {fundBooksSummary?.allIncome.toLocaleString()}
            </div>
          </div>
          <div className="mx-5">
            <div className="text-lg">Tổng chi:</div>
            <div className="text-lg text-red-400">
              {fundBooksSummary?.allExpense.toLocaleString()}
            </div>
          </div>
          <div className="mx-5">
            <div className="text-lg">Tồn quỹ:</div>
            <div className="text-lg text-blue-400">
              {fundBooksSummary?.fundBalance.toLocaleString()}
            </div>
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
                  Không có phiếu thu, chi nào, hãy tạo phiếu thu, chi mới!
                </div>
              ),
            }}
          />
        </div>
      </Box>
      {openNewFundBookOutComeModal && (
        <NewFundBook
          open={openNewFundBookOutComeModal}
          onClose={() => setOpenNewFundBookOutComeModal(false)}
          isIncome={true}
        />
      )}
      {openNewFundBookExpenseModal && (
        <NewFundBook
          open={openNewFundBookExpenseModal}
          onClose={() => setOpenNewFundBookExpenseModal(false)}
          isIncome={false}
        />
      )}

      {openEditFundBookModal && selectedFundBookId && (
        <EditFundBook
          open={openEditFundBookModal}
          onClose={() => setOpenEditFundBookModal(false)}
          fundBookId={selectedFundBookId}
        />
      )}
      {openDetailsFundBookModal && selectedFundBookId && (
        <DetailsFundBook
          open={openDetailsFundBookModal}
          onClose={() => setOpenDetailsFundBookModal(false)}
          fundBookId={selectedFundBookId}
        />
      )}

      <div className="hidden">
        <div ref={printBookingRef}>
          {fundBooks.map((fundBook) => {
            return (
              <div
                className={`${fundBook
                  ? fundBook.fundBookId === selectedFundBookId

                    ? ""
                    : "hidden"
                  : "hidden"
                  } m-10`}
              >
                <p>Tên khách sạn: Khách sạn Văn Lâm</p>
                <p>Điện thoại: 0981987625</p>
                {/* <div className="mt-4 border-t border-black border-dotted">
                  Ngày xuất phiếu: {dayjs().format("DD/MM/YYYY HH:mm")}
                </div> */}
                <p>Địa chỉ:</p>
                <div className="mt-4">
                  <div className="font-bold text-center">
                    {(fundBook.type === "INCOME" || fundBook.type === "OTHER_INCOME") && (
                      <h2>PHIẾU THU</h2>
                    )}
                    <p className="text-sm"></p>
                    {(fundBook.type === "EXPENSE" || fundBook.type === "OTHER_EXPENSE") && (
                      <h2>PHIẾU CHI</h2>
                    )}
                    <p className="text-sm"></p>
                  </div>
                  <div>
                    <p>
                      Số hiệu:{" "}
                      {fundBook ? (fundBook.fundBookId ? fundBook.fundBookId : "") : ""}
                    </p>
                    {/* <p>
                        {fundBook ? (fundBook.time ? fundBook.time : "") : ""}
                    </p> */}
                    <p>
                      Hình thức :{" "}
                      {fundBook ? (fundBook.paidMethod === "BANK" ? "Chuyển khoản" : "Tiền mặt") : ""}
                    </p>
                    <p>
                      Giá trị :{" "}
                      {fundBook ? (fundBook.value ? fundBook.value.toLocaleString() : "") : ""}
                    </p>
                    <p>
                      Người nộp :{" "}
                      {fundBook ? (fundBook.payerReceiver ? fundBook.payerReceiver : "") : ""}
                    </p>
                    <p>
                      Ghi chú :{" "}
                      {fundBook ? (fundBook.note ? fundBook.note : "") : ""}
                    </p>
                  </div>
                </div>
                <div className="text-center text-sm">Cảm ơn và hẹn gặp lại</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default FundBookManagementPage;

async function loadFundBooks() {
  const token = localStorage.getItem("token");
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const month = String(dateNow.getMonth() + 1).padStart(2, "0");
  const day = String(dateNow.getDate()).padStart(2, "0");
  const formattedDate = `${year}/${month}/${day}`;
  const formData = new FormData();
  if (!token) {
    return redirect("/login");
  }

  formData.append("time", formattedDate);
  formData.append("isMonth", true);
  const urlSearchParams = new URLSearchParams(formData);

  const response = await axiosPrivate.get("fund-book?" + urlSearchParams, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.result;
}

async function loadFundBooksSummary() {
  const token = localStorage.getItem("token");
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const month = String(dateNow.getMonth() + 1).padStart(2, "0");
  const day = String(dateNow.getDate()).padStart(2, "0");
  const formattedDate = `${year}/${month}/${day}`;
  const formData = new FormData();
  if (!token) {
    return redirect("/login");
  }
  formData.append("time", formattedDate);
  formData.append("isMonth", true);
  const urlSearchParams = new URLSearchParams(formData);
  const response = await axiosPrivate.get(
    "fund-book/summary?" + urlSearchParams,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.result;
}

export async function loader() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  return defer({
    data: await loadFundBooks(),
    dataSummary: await loadFundBooksSummary(),
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const formData = new FormData();
  const fundBookId = data.get("fundBookId");
  formData.append("fundBookId", data.get("fundBookId"));
  // formData.append("time", data.get("time"));
  formData.append("value", data.get("value"));
  formData.append("note", data.get("note"));
  formData.append("payerReceiver", data.get("payerReceiver"));
  formData.append("paidMethod", data.get("paidMethod"));
  formData.append("type", data.get("type"));

  if (method === "POST") {
    const response = await axiosPrivate
      .post("fund-book", formData, {
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

    return redirect("/manager/FundBookManagement");
  }
  if (method === "PUT") {
    const response = await axiosPrivate
      .put("fund-book/" + fundBookId, formData, {
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

    return redirect("/manager/FundBookManagement");
  }
  if (method === "GET") {
    console.log("success");
  }

  return redirect("/manager/FundBookManagement");
}
