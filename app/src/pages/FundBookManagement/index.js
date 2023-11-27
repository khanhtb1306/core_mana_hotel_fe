import React, { useState } from "react";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import ButtonHover from "../../components/UI/ButtonHover";
import ButtonClick from "../../components/UI/ButtonClick";

function FundBookManagementPage() {
    // Replace the following line with actual data or fetch it from an API
    const rows = []; // Provide your data here

    // Define and initialize state variables
    const [rowSelectionModel, setRowSelectionModel] = useState([]);

    const columns = [
        { field: "code", headerName: "Mã khách hàng", width: 150 },
        { field: "nameCus", headerName: "Tên khách hàng", width: 200 },
        { field: "customerGroup", headerName: "Nhóm khách hàng", width: 150 },
        { field: "IC", headerName: "CMND", width: 150 },
        { field: "address", headerName: "Địa chỉ", width: 200 },
        { field: "phoneNumber", headerName: "Số điện thoại", width: 150 },
        { field: "DOB", headerName: "Năm sinh", width: 150 },
        { field: "gender", headerName: "Giới tính", width: 100 },
        { field: "email", headerName: "Thư điện tử", width: 200 },
        { field: "taxCode", headerName: "Mã số thuế", width: 150 },
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
                    <h1 className="text-4xl">Sổ quỹ</h1>
                    <div className="ml-auto flex">
                        <div className="mx-2">
                            <ButtonHover
                                action="Thao tác"
                                iconAction="fa-solid fa-ellipsis-vertical"
                                names={[
                                    {
                                        name: "Xoá khách hàng",
                                        icon: "fa-solid fa-trash",
                                    },
                                ]}
                            />
                        </div>
                        <div className="mx-2">
                            <ButtonClick
                                name="Thêm mới khách hàng"
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

export default FundBookManagementPage;
