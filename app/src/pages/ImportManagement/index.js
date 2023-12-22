import { Box } from "@mui/material";
import * as React from "react";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import { defer, redirect, useLoaderData } from "react-router-dom";
import ButtonClick from "../../components/UI/ButtonClick";
import Swal from "sweetalert2";
import ButtonHover from "../../components/UI/ButtonHover";
import NewImportGoods from "../../components/ImportGoods/NewImportGoods";
import EditImportGoods from "../../components/ImportGoods/EditImportGoods";
import DeleteImportGoods from "../../components/ImportGoods/DeleteImportGoods";
import { useReactToPrint } from "react-to-print";
function ImportGoodsManagementPage() {
  const { listImport, goodsUnit } = useLoaderData();

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewImportGoodsModal, setOpenNewImportGoodsModal] = useState(false);
  const [selectedImportGoodsId, setSelectedImportGoodsId] = useState(null);
  const [openDeleteImportGoodsModal, setOpenDeleteImportGoodsModal] =
    useState(false);
  const [openDetailsImportGoodsModal, setOpenDetailsImportGoodsModal] =
    useState(false);
  const [openEditImportGoodsModal, setOpenEditImportGoodsModal] =
    useState(false);

    const handleDeleteImportGoods = (id) => {
        setOpenDeleteImportGoodsModal(true);
        setSelectedImportGoodsId(id);

    };
    const handleDetailsImportGoods = (id) => {
        setOpenDetailsImportGoodsModal(true);
        setSelectedImportGoodsId(id);
    };
    const handleEditImportGoods = (id) => {
        setOpenEditImportGoodsModal(true);
        setSelectedImportGoodsId(id);
    };
    const printImportGoodsRef = useRef();
    const handleImportGoodsPrint = useReactToPrint({
        content: () => printImportGoodsRef.current,
    });
    const columns = [
        { field: "code", headerName: "Mã nhập hàng", width: 200 },
        { field: "timeImport", headerName: "Ngày tạo", width: 150 },
        { field: "supplier", headerName: "Nhà cung cấp", width: 200 },
        { field: "paid", headerName: "Đã trả ", width: 150 },
        { field: "price", headerName: "Tổng", width: 150 },
        { field: "status", headerName: "Trạng thái", width: 150 },
        {
            field: "actions",
            headerName: "Hoạt động",
            type: "actions",
            getActions: (params) => {
                const row = params.row;
                return [
                    <>
                        {row.status === "Lưu tạm" && (
                            <>
                                <GridActionsCellItem
                                    icon={<i className="fa-solid fa-pen-to-square"></i>}
                                    label="Chỉnh sửa"
                                    onClick={() => handleEditImportGoods(params.id)}

                                />
                                <GridActionsCellItem
                                    icon={<i className="fa-solid fa-trash"></i>}
                                    label="Xoá"
                                    onClick={() => {
                                        handleDeleteImportGoods(params.id);
                                    }}

                                />
                            </>
                        )}
                        {(row.status ==="Đã lưu" || row.status ==="Huỷ") && (
                            <GridActionsCellItem
                                icon={<i className="fa-solid fa-print"></i>}
                                label="In"
                                onClick={() => handleImportGoodsPrint()}
                                onMouseOver={() => {
                                    setSelectedImportGoodsId(params.id);
                                }}
                                onMouseLeave={() => {
                                    setSelectedImportGoodsId(null);
                                }}
                            />
                        )}


                    </>
                ];
            },
        },
    ];

  const rows = Array.isArray(listImport)
    ? listImport.map((listImport) => {
        const dateNow = new Date(listImport.importGoods.timeImport);
        const year = dateNow.getFullYear();
        const month = String(dateNow.getMonth() + 1).padStart(2, "0");
        const day = String(dateNow.getDate()).padStart(2, "0");
        const formattedDate = `${day}-${month}-${year}`;

        return {
            id: listImport.importGoods.importGoodsId,
            code: listImport.importGoods.importGoodsId,
            timeImport: formattedDate,
            supplier: listImport.importGoods.supplier,
            paid: listImport.importGoods.paid.toLocaleString(),
            total: listImport.importGoods.total ? listImport.importGoods.total.toLocaleString():"",
            status: listImport.importGoods.status === 7 ? "Đã lưu" : listImport.importGoods.status === 4 ? "Lưu tạm" : "Hủy",
            price: listImport.importGoods.price
        };
      })
    : [];

  const newImportGoodsHandler = () => {
    if (goodsUnit.length > 0) {
      setOpenNewImportGoodsModal(true);
    } else {
      Swal.fire({
        position: "bottom",
        html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Không có hàng hoá để tạo phiếu nhập hàng</button>`,
        showConfirmButton: false,
        background: "transparent",
        backdrop: "none",
        timer: 2500,
      });
    }
  };

    return (
        <>
            <Box className="h-full w-10/12 mx-auto mt-10">
                <div className="flex mb-10">
                    <h1 className="text-4xl">Nhập hàng</h1>
                    <div className="ml-auto flex">

                        <div className="mx-2">
                            <ButtonClick
                                name="Nhập hàng"
                                iconAction="fa-solid fa-plus"
                                action={newImportGoodsHandler}
                            />
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
                                Không có phiếu nhập hàng nào, hãy tạo phiếu nhập hàng mới!
                            </div>
                        ),
                    }}

                />
                </div>
            </Box>

            {openNewImportGoodsModal && (
                <NewImportGoods
                    open={openNewImportGoodsModal}
                    onClose={() => setOpenNewImportGoodsModal(false)}
                />
            )}
            {openEditImportGoodsModal && selectedImportGoodsId && (
                <EditImportGoods
                    open={openEditImportGoodsModal}
                    onClose={() => setOpenEditImportGoodsModal(false)}
                    importGoodsId={selectedImportGoodsId}
                />
            )}

            {openDeleteImportGoodsModal && selectedImportGoodsId && (
                <DeleteImportGoods
                    open={openDeleteImportGoodsModal}
                    onClose={() => setOpenDeleteImportGoodsModal(false)}
                    importGoodsId={selectedImportGoodsId}
                />
            )}
            <div className="hidden">
                <div ref={printImportGoodsRef}>
                    {listImport.map((importGoods) => {
                        return (
                            <div
                                className={
                                    `${importGoods.importGoods.importGoodsId
                                        ? importGoods.importGoods.importGoodsId === selectedImportGoodsId

                                            ? ""
                                            : "hidden"
                                        : "hidden"
                                    } 
                                    m-10`}
                                key={importGoods.importGoods.importGoodsId}
                            >
                                <p>Tên khách sạn: Khách sạn Văn Lâm</p>
                                <p>Điện thoại: 0981987625</p>
                                <div className="mt-4 border-t border-black border-dotted">
                                    Ngày xuất phiếu: {importGoods.importGoods.timeImport}
                                </div>
                                <p>Địa chỉ:</p>
                                <div className="mt-4">
                                    <div className="font-bold text-center">
                                        <h2>HOÁ ĐƠN NHẬP HÀNG</h2>
                                    </div>
                                    <div>
                                        <p>
                                            Mã nhập hàng:{" "}
                                            {importGoods ? (importGoods.importGoods.importGoodsId ? importGoods.importGoods.importGoodsId : "") : ""}
                                        </p>
                                        <p>
                                            Nhà cung cấp :{" "}
                                            {importGoods ? (importGoods.importGoods.supplier) : ""}
                                        </p>
                                        <p>
                                            Đã trả :{" "}
                                            {importGoods ? (importGoods.importGoods.paid ? importGoods.importGoods.paid.toLocaleString() : "") : ""}
                                        </p>
                                        <p>
                                            Tổng :{" "}
                                            {importGoods ? (importGoods.importGoods.price ? importGoods.importGoods.price.toLocaleString() : "") : ""}
                                        </p>

                                    </div>
                                </div>
                                <div className="border border-black mt-2">
                                    <div className="flex flex-row">
                                        <div className="basis-1/4 font-bold text-lg" >Tên hàng hóa</div>
                                        <div className="basis-1/4 font-bold text-lg" >Đơn giá</div>
                                        <div className="basis-1/4 font-bold text-lg">Số lượng</div>
                                        <div className="basis-1/4 font-bold text-lg">Thành tiền</div>
                                    </div>
                                    {importGoods.listImportGoodsDetail.map((detail) => (
                                        <div className="flex flex-row">
                                            <div className="basis-1/4">{detail.goods.goodsName}</div>
                                            <div className="basis-1/4">{detail.amount}</div>
                                            <div className="basis-1/4">{detail.cost.toLocaleString()}</div>
                                            <div className="basis-1/4">{detail.total.toLocaleString()}</div>
                                        </div>
                                    ))}
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

export default ImportGoodsManagementPage;

async function loadImportGoods() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("import-goods");
  return response.data.result;
}
async function loadGoodsUnit() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  const response = await axiosPrivate.get("goods-unit");
  return response.data;
}
export async function loader() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  return defer({
    goodsUnit: await loadGoodsUnit(),
    listImport: await loadImportGoods(),
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const formData = new FormData();

  if (data.get("importGoodsId") != null) {
    formData.append("importGoodsDTO.importGoodsId", data.get("importGoodsId"));
  }
  if (method === "DELETE") {
    const response = await axiosPrivate
      .delete("import-goods/" + data.get("importGoodsId"))
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

    return redirect("/manager/importManagement");
  }

  formData.append("importGoodsDTO.timeImport", data.get("timeImport"));
  formData.append("importGoodsDTO.supplier", data.get("supplier"));
  formData.append("importGoodsDTO.paid", data.get("paid"));
  formData.append("importGoodsDTO.status", data.get("status"));
  const unitsArray = data.get("products").split(",");
  const units = unitsArray.map((units) => {
    const unit = units.split("|");
    return {
      unitId: unit[0],
      productId: unit[1],
      amount: unit[2],
    };
  });

  const result = units.reduce((acc, curr) => {
    const actualInventory = data.get("actualInventory" + curr.unitId);
    const existingItem = acc.find((item) => item.productId === curr.productId);
    console.log(curr.unitId);
    acc.push({
      goodsUnit: Number(curr.unitId),
      productId: curr.productId,
      actualInventory: Number(actualInventory),
      amount: Number(curr.amount),
    });

    return acc;
  }, []);
  result.map((pro, index) => {
    formData.append(
      `listImportGoodsDetailDTO[${index}].amountUnit`,
      pro.amount
    );
    formData.append(
      `listImportGoodsDetailDTO[${index}].goodsUnitId`,
      pro.goodsUnit
    );
    formData.append(
      `listImportGoodsDetailDTO[${index}].goodsId`,
      pro.productId
    );
    formData.append(
      `listImportGoodsDetailDTO[${index}].amount`,
      pro.actualInventory
    );
  });
  if (method === "POST") {
    const response = await axiosPrivate
      .post("import-goods", formData, {
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

    return redirect("/manager/importManagement");
  }
  if (method === "PUT") {
    const response = await axiosPrivate
      .put("import-goods/" + data.get("importGoodsId"), formData, {
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

    return redirect("/manager/importManagement");
  }

  return redirect("/manager/importManagement");
}
