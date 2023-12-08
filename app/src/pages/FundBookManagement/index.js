import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
} from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import ButtonHover from "../../components/UI/ButtonHover";
import dayjs from "dayjs";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import { defer, redirect, useLoaderData } from "react-router-dom";
import ButtonClick from "../../components/UI/ButtonClick";
import Swal from "sweetalert2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function FundBookManagementPage() {
  const [fundBooks, setFundBooks] = useState(null);
  const [fundBooksSummary, setFundBooksSummary] = useState({
    openingBalance: 0,
    allIncome: 0,
    allExpense: 0,
    fundBalance: 0,
  });


  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewFundBookModal, setOpenNewFundBookModal] = useState(false);
  const [openEditFundBookModal, setOpenEditFundBookModal] = useState(false);
  const [openDetailsFundBookModal, setOpenDetailsFundBookModal] = useState(false);
  const [openDeleteFundBookModal, setOpenDeleteFundBookModal] = useState(false);
  const [selectedFundBookId, setSelectedFundBookId] = useState(null);
  //-------------------------------------------------------------------------------------------------------

  const handleDropdownChange = (event) => {
    setSelectedValue1(event.target.value);
  };
  const [selectedValue1, setSelectedValue1] = useState('1');
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
      console.log(selectedValue1);
      console.log(month.format('YYYY/MM/DD').toString());
      console.log(year.format('YYYY/MM/DD').toString());

      if (selectedValue1 !==null &&( month !== null || year!==null)) {
        try {
          if (selectedValue1 === "1") {
            formattedDate = month.format('YYYY/MM/DD').toString();
            formData.append("time", formattedDate);
            formData.append("isMonth", true);
            const urlSearchParams = new URLSearchParams(formData);
            response = await axiosPrivate.get("fund-book?" + urlSearchParams, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            responseSummary = await axiosPrivate.get("fund-book/summary?" + urlSearchParams, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            setFundBooks(response.data.result);
            setFundBooksSummary(responseSummary.data.result);
            if (responseSummary.data.result.openingBalance === null) {
              console.log("as");
            }
          }
          else {
            formattedDate = year.format('YYYY/MM/DD').toString();
            formData.append("time", formattedDate);
            formData.append("isMonth", false);
            const urlSearchParams = new URLSearchParams(formData);
            response = await axiosPrivate.get("fund-book?" + urlSearchParams, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            responseSummary = await axiosPrivate.get("fund-book/summary?" + urlSearchParams, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            setFundBooks(response.data.result);
            setFundBooksSummary(responseSummary.data.result);

          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    fetchListInvoices();
  }, [month, year, selectedValue1]);
  //-------------------------------------------------------------------------------------------------------

  const handleDetailsFundBook = (id) => {
    setOpenDetailsFundBookModal(true);
    setSelectedFundBookId(id);
  };

  const handleEditFundBook = (id) => {
    setOpenEditFundBookModal(true);
    setSelectedFundBookId(id);
  };

  const deleteFundBookHandler = () => {
    setOpenDeleteFundBookModal(true);
  };


  const columns = [
    { field: "code", headerName: "Mã sổ quỹ", width: 200 },
    { field: "time", headerName: "Thời gian", width: 150 },
    { field: "type", headerName: "Loại", width: 150 },
    { field: "paidMethod", headerName: "Thanh toán", width: 150 },
    { field: "value", headerName: "Giá trị", width: 200 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    {
      field: "actions",
      headerName: "Hoạt động",
      type: "actions",
      width: 200,
      getActions: ({ id }) => {
        return [

          <GridActionsCellItem
            icon={<i className="fa-solid fa-eye"></i>}
            label="Xem chi tiết"
            onClick={() => handleDetailsFundBook(id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-pen-to-square"></i>}
            label="Sửa đổi"
            onClick={() => handleEditFundBook(id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-trash"></i>}
            label="Xoá"
            onClick={() => {
              setSelectedFundBookId(id);
              deleteFundBookHandler();
            }}
          />,

        ];
      },
    },
  ];

  const rows = Array.isArray(fundBooks) ? fundBooks.filter((fundBook) => fundBook.role !== 'ROLE_MANAGER').map((fundBook) => {
    const dateNow = new Date(fundBook.time);
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, "0");
    const day = String(dateNow.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return {
      id: fundBook.fundBookId,
      code: fundBook.fundBookId,
      time: formattedDate,
      type: fundBook.type === "INCOME" ? 'Thu nhập' : fundBook.type === "OTHER_INCOME" ? 'Thu nhập khác' : fundBook.type === "OTHER_EXPENSE" ? 'Chi phí khác' : 'Chi phí',
      paidMethod: fundBook.paidMethod,
      value: fundBook.value,
      status: fundBook.status === "COMPLETE" ? "Hoàn tất" : ""
    };
  }) : [];

  const newFundBookHandler = () => {
    setOpenNewFundBookModal(true);
  };

  return (
    <>

      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex mb-10">
          <h1 className="text-4xl">Sổ quỹ</h1>
          <div className="ml-auto flex">
            {rowSelectionModel.length > 0 ? (
              <div className="mx-2">
                <ButtonHover
                  action="Thao tác"
                  iconAction="fa-solid fa-ellipsis-vertical"
                  names={[
                    {
                      name: "Xoá sổ quỹ",
                      icon: "fa-solid fa-trash",
                      action: deleteFundBookHandler,
                    },
                  ]}
                />
              </div>
            ) : null}

            <div className=" flex justify-between">
              <div className="">
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="vi-VN"
                >
                  {selectedValue1 === "1" ? (
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
              <div className="">
                <select
                  value={selectedValue1}
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
                action={newFundBookHandler}
              />
            </div>
            <div className="mx-2">
              <ButtonClick
                name="Lập phiếu chi"
                iconAction="fa-solid fa-plus"
                action={newFundBookHandler}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end bg-gray-200">
          <div className="mx-5">
            <div className="text-lg">Quỹ đầu kì:</div>
            <div className="text-lg text-gray-400">{fundBooksSummary.openingBalance}</div>
          </div>
          <div className="mx-5">
            <div className="text-lg">Tổng thu:</div>
            <div className="text-lg text-green-400">{fundBooksSummary.allIncome}</div>
          </div>
          <div className="mx-5">
            <div className="text-lg">Tổng chi:</div>
            <div className="text-lg text-red-400">{fundBooksSummary.allExpense}</div>
          </div>
          <div className="mx-5">
            <div className="text-lg">Tồn quỹ:</div>
            <div className="text-lg text-blue-400"> {fundBooksSummary.fundBalance}</div>
          </div>
        </div>
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
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
      {/* {openNewFundBookModal && (
        <NewFundBook
          open={openNewFundBookModal}
          onClose={() => setOpenNewFundBookModal(false)}
          departments={departments}
        />
      )}

      {openEditFundBookModal && selectedFundBookId && (
        <EditFundBook
          open={openEditFundBookModal}
          onClose={() => setOpenEditFundBookModal(false)}
          FundBookId={selectedFundBookId}
          departments={departments}

        />
      )}
      {openDetailsFundBookModal && selectedFundBookId && (
        <DetailsFundBook
          open={openDetailsFundBookModal}
          onClose={() => setOpenDetailsFundBookModal(false)}
          FundBookId={selectedFundBookId}
        />
      )}
      {openDeleteFundBookModal && rowSelectionModel && (
        <DeleteFundBook
          open={openDeleteFundBookModal}
          onClose={() => setOpenDeleteFundBookModal(false)}
          listFundBookId={rowSelectionModel}
        />
      )}
      {openDeleteFundBookModal && selectedFundBookId && (
        <DeleteFundBook
          open={openDeleteFundBookModal}
          onClose={() => setOpenDeleteFundBookModal(false)}
          listFundBookId={selectedFundBookId}
        />
      )} */}

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

  console.log(response);

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

  const response = await axiosPrivate.get("fund-book/summary?" + urlSearchParams, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response.data.result);

  return response.data.result;

}


export async function loader() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  return defer({
    fundBooks: await loadFundBooks(),
    fundBooksSummary: await loadFundBooksSummary(),

  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const formData = new FormData();

  if (data.get("FundBookId") != null) {
    formData.append("FundBookId", data.get("FundBookId"));
  }

  formData.append("FundBookName", data.get("FundBookName"));

  console.log(data.get("image"));
  if (method === "POST") {
    const response = await axiosPrivate
      .post("FundBook", formData, {
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
        }
        else {
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

    if (data.get("FundBookId") === null && data.get("userName") !== "") {

      const body = { email: data.get("email"), type: 1 }
      const response = await axiosConfig.post("auth/password-reset-request", body
      )
        .then((response) => {
          console.log(response);
        });

    }
    return redirect("/manager/FundBookManagement");
  }

  if (method === "DELETE") {
    const dataArray = data.get("FundBookId").split(",");
    const response = await axiosPrivate
      .delete("FundBook/" + dataArray)
      .then((response) => {
        let message = "";
        dataArray.map((id) => {
          message += response.data.result[id] + " có mã sổ quỹ là " + id + "<br/>";
        });
        Swal.fire({
          position: "center",
          html: `<p>${message}</p>`,
          showConfirmButton: true,
        });
      })
      .catch((e) => {
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
  return redirect("/manager/FundBookManagement");
}
