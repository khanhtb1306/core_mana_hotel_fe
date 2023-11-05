import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  viVN,
} from "@mui/x-data-grid";
import { useState } from "react";
import ButtonHover from "../../components/UI/ButtonHover";
import { axiosPrivate } from "../../utils/axiosConfig";
import { defer, redirect, useLoaderData } from "react-router-dom";
import ButtonClick from "../../components/UI/ButtonClick";
import Swal from "sweetalert2";
import DetailsPriceBook from "../../components/PriceBook/DetailsPriceBook";
import NewPriceBook from "../../components/PriceBook/NewPriceBook";
import EditPriceBook from "../../components/PriceBook/EditPriceBook";

function PriceManagementPage() {
  const { dataPriceBooks } = useLoaderData();
  const priceBooks = dataPriceBooks.result;

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openDetailsPriceBookModal, setOpenDetailsPriceBookModal] =
    useState(false);
  const [openNewPriceBookModal, setOpenNewPriceBookModal] = useState(false);
  const [openEditPriceBookModal, setOpenEditPriceBookModal] = useState(false);
  const [selectedPriceBookId, setSelectedPriceBookId] = useState(null);

  const newPriceBookHandler = (id) => {
    setOpenNewPriceBookModal(true);
    setSelectedPriceBookId(id);
  };

  const handleDetailsPriceBook = (id) => {
    setOpenDetailsPriceBookModal(true);
    setSelectedPriceBookId(id);
  };

  const handleEditPriceBook = (id) => {
    setOpenEditPriceBookModal(true);
    setSelectedPriceBookId(id);
  };

  const deletePriceBookHandler = (id) => {
    setSelectedPriceBookId(id);
  };

  const columns = [
    { field: "code", headerName: "Mã bảng giá", width: 200 },
    { field: "namePriceBook", headerName: "Tên bảng giá", width: 200 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    { field: "timeActive", headerName: "Thời gian hiệu lực", width: 300 },
    {
      field: "actions",
      headerName: "Hoạt động",
      type: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<i className="fa-solid fa-eye"></i>}
            label="Xem chi tiết"
            onClick={() => handleDetailsPriceBook(id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-pen-to-square"></i>}
            label="Sửa đổi"
            onClick={() => handleEditPriceBook(id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-trash"></i>}
            label="Xoá"
            onClick={() => {
              setSelectedPriceBookId(id);
              deletePriceBookHandler(id);
            }}
          />,
        ];
      },
      width: 200,
    },
  ];

  const transferDate = (dateTampt) => {
    const date = new Date(dateTampt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const rows = priceBooks.map((priceBook) => {
    const status =
      priceBook.PriceList.status === 1 ? "Đang hoạt động" : "Ngừng hoạt động";
    const timeStart = transferDate(priceBook.PriceList.effectiveTimeStart);
    const timeEnd = transferDate(priceBook.PriceList.effectiveTimeEnd);
    return {
      id: priceBook.PriceList.priceListId,
      code: priceBook.PriceList.priceListId,
      namePriceBook: priceBook.PriceList.priceListName,
      status: status,
      timeActive: timeStart + " - " + timeEnd,
    };
  });

  return (
    <>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex mb-10">
          <h1 className="text-4xl">Bảng giá</h1>
          <div className="ml-auto flex">
            {rowSelectionModel.length > 0 ? (
              <div className="mx-2">
                <ButtonHover
                  action="Thao tác"
                  iconAction="fa-solid fa-ellipsis-vertical"
                  names={[
                    {
                      name: "Xoá khách hàng",
                      icon: "fa-solid fa-trash",
                      action: deletePriceBookHandler,
                    },
                  ]}
                />
              </div>
            ) : null}
            <div className="mx-2">
              <ButtonClick
                name="Thêm mới khách hàng"
                iconAction="fa-solid fa-plus"
                action={newPriceBookHandler}
              />
            </div>
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
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
      {openDetailsPriceBookModal && selectedPriceBookId && (
        <DetailsPriceBook
          open={openDetailsPriceBookModal}
          onClose={() => setOpenDetailsPriceBookModal(false)}
          priceBook={priceBooks.find(
            (price) => price.PriceList.priceListId === selectedPriceBookId
          )}
        />
      )}
      {openNewPriceBookModal && selectedPriceBookId && (
        <NewPriceBook
          open={openNewPriceBookModal}
          onClose={() => setOpenNewPriceBookModal(false)}
        />
      )}
      {openEditPriceBookModal && selectedPriceBookId && (
        <EditPriceBook
          open={openEditPriceBookModal}
          onClose={() => setOpenEditPriceBookModal(false)}
          priceBook={priceBooks.find(
            (price) => price.PriceList.priceListId === selectedPriceBookId
          )}
        />
      )}
    </>
  );
}

export default PriceManagementPage;

async function loadPriceBooks() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("price-list");
  return response.data;
}

async function loadCategories() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("room-class");
  return response.data;
}

export async function loader() {
  return defer({
    categories: await loadCategories(),
    dataPriceBooks: await loadPriceBooks(),
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const formData = new FormData();
  formData.append("priceListDTO.priceListName", data.get("priceListName"));
  formData.append(
    "priceListDTO.effectiveTimeStart",
    data.get("effectiveTimeStart")
  );
  formData.append(
    "priceListDTO.effectiveTimeEnd",
    data.get("effectiveTimeEnd")
  );
  formData.append("priceListDTO.status", 1);
  formData.append("priceListDTO.note", data.get("note"));
  const listCateRoomId = data.get("listCateRoomId").split(",");
  listCateRoomId.map((cateRoomId, index) => {
    const indexes = data.get(`${cateRoomId}`);
    for (let i = 0; i < indexes; i++) {
      formData.append(`priceListDetailDTO[${i}].roomCategoryId`, cateRoomId);
      console.log(`priceListDetailDTO[${i}].roomCategoryId`);
      formData.append(
        `priceListDetailDTO[${i}].priceByHour`,
        data.get(`priceByHour-${cateRoomId}-${i}`)
      );
      formData.append(
        `priceListDetailDTO[${i}].priceByDay`,
        data.get(`priceByDay-${cateRoomId}-${i}`)
      );
      formData.append(
        `priceListDetailDTO[${i}].priceByNight`,
        data.get(`priceByNight-${cateRoomId}-${i}`)
      );
      if (data.get(`timeApply-${cateRoomId}-${i}`)) {
        formData.append(
          `priceListDetailDTO[${i}].timeApply`,
          data.get(`timeApply-${cateRoomId}-${i}`)
        );
      }
      const list = data.get(`dayOfWeek-${cateRoomId}-${i}`).split(",");
      list.map((row, ind) => {
        formData.append(`priceListDetailDTO[${i}].dayOfWeek[${ind}]`, row);
      });
    }
  });
  // return redirect("/manager/priceBook");
  if (method === "POST") {
    await axiosPrivate
      .post("price-list", formData)
      .then((response) => {
        const data = response.data;
        if (data.success) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: data.displayMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: data.displayMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/priceBook");
  }

  if (method === "PUT") {
    await axiosPrivate
      .put("price-list/" + data.get("priceListId"), formData)
      .then((response) => {
        const data = response.data;
        if (data.success) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: data.displayMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: data.displayMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/priceBook");
  }
  return redirect("/manager/priceBook");
}
