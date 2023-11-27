import React, { useState } from "react";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import ButtonHover from "../../components/UI/ButtonHover";
import ButtonClick from "../../components/UI/ButtonClick";

function TransactionManagementPage() {
    // Replace the following line with actual data or fetch it from an API
    const rows = []; // Provide your data here

    // Define and initialize state variables
    const [rowSelectionModel, setRowSelectionModel] = useState([]);

    const columns = [
        { field: "code", headerName: "Mã đặt phòng", width: 150 },
        { field: "nameCus", headerName: "Trạng thái", width: 200 },
        { field: "customerGroup", headerName: "Thời gian", width: 150 },
        { field: "IC", headerName: "Khách hàng", width: 150 },
        { field: "address", headerName: "Điện thoại", width: 200 },
        { field: "phoneNumber", headerName: "Địa chỉ", width: 150 },
        { field: "DOB", headerName: "Nhân viên đặt", width: 150 },
        { field: "gender", headerName: "Tổng tiền hàng", width: 100 },
        { field: "email", headerName: "Khách đã trả", width: 200 },
        { field: "taxCode", headerName: "Còn cần trả", width: 150 },
        {
            field: "actions",
            headerName: "Hoạt động",
            type: "actions",
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<i className="fa-solid fa-eye"></i>}
                        label="Xem chi tiết"
                    />,
                    <GridActionsCellItem
                        icon={<i className="fa-solid fa-pen-to-square"></i>}
                        label="Sửa đổi"
                    />,
                    <GridActionsCellItem
                        icon={<i className="fa-solid fa-trash"></i>}
                        label="Xoá"
                    />,
                ];
            },
        },
    ];

    return (
        <>
            <Box className="h-full w-10/12 mx-auto mt-10">
                <div className="flex mb-10">
                    <h1 className="text-4xl">Hóa Đơn</h1>
                    <div className="ml-auto flex">
                        <div className="mx-2">
                            <ButtonHover
                                action="Thao tác"
                                iconAction="fa-solid fa-ellipsis-vertical"
                                names={[
                                    {
                                        name: "Xoá",
                                        icon: "fa-solid fa-trash",
                                    },
                                ]}
                            />
                        </div>
                        <div className="mx-2">
                            <ButtonClick
                                name="Thêm giao dịch"
                                iconAction="fa-solid fa-plus"
                            />
                        </div>
                    </div>
                </div>
                <DataGrid
                    className="bg-white"
                    columns={columns}
                    rows={rows}
                    pageSize={5}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    disableSelectionOnClick
                    onSelectionModelChange={(newSelectionModel) => {
                        setRowSelectionModel(newSelectionModel.selectionModel);
                    }}
                    selectionModel={rowSelectionModel}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                />
            </Box>
        </>
    );
}

export default TransactionManagementPage;
