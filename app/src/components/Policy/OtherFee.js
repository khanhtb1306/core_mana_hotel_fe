import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import OtherFeeModal from "./OtherFeeModal";
import DeleteOtherFeeModal from "./DeleteOtherFeeModal";
import StatusOtherFeeModal from "./StatuOtherFeeModal";

function OtherFee() {
  const { listRevenue } = useLoaderData();
  // console.log(listRevenue);

  const [openNewRevenue, setOpenNewRevenue] = useState(false);
  const [openEditRevenue, setOpenEditRevenue] = useState(false);
  const [openDeleteRevenue, setOpenDeleteRevenue] = useState(false);
  const [openStatusRevenue, setOpenStatusRevenue] = useState(false);
  const [selectedRevenueId, setSelectedRevenueId] = useState(null);
  const columns = [
    { field: "policyDetailId", headerName: "Mã thu khác", width: 200 },
    { field: "type", headerName: "Loại thu", width: 200 },
    { field: "price", headerName: "Tiền thu", width: 200 },
    { field: "status", headerName: "Trạng thái", width: 200 },
    {
      field: "action",
      headerName: "Hoạt động",
      type: "actions",
      width: 300,
      getActions: (params) => {
        const row = params.row;
        const status = row.status;
        return [
          status === "Ngừng thu" ? (
            <GridActionsCellItem
              icon={<i className="fa-solid fa-lock-open p-1"></i>}
              label="Ngừng thu"
              onClick={() => {
                setSelectedRevenueId(row.policyDetailId);
                setOpenStatusRevenue(true);
              }}
            />
          ) : (
            <GridActionsCellItem
              icon={<i className="fa-solid fa-lock p-1"></i>}
              label="Đang thu"
              onClick={() => {
                setSelectedRevenueId(row.policyDetailId);
                setOpenStatusRevenue(true);
              }}
            />
          ),
          <GridActionsCellItem
            icon={<i className="fa-solid fa-pen p-1"></i>}
            label="Chỉnh sửa"
            onClick={() => {
              setSelectedRevenueId(row.policyDetailId);
              setOpenEditRevenue(true);
            }}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-trash p-1"></i>}
            label="Xoá"
            onClick={() => {
              setSelectedRevenueId(row.policyDetailId);
              setOpenDeleteRevenue(true);
            }}
          />,
        ];
      },
    },
  ];

  const rows = listRevenue.LIST_OTHER_REVENUE_DETAIL.map((revenue, index) => {
    const status = revenue.status === 1 ? "Đang thu" : "Ngừng thu";
    return {
      id: index,
      policyDetailId: revenue.policyDetailId,
      type: revenue.type,
      price: revenue.policyValue + " " + revenue.typeValue,
      status: status,
    };
  });

  return (
    <div className="ml-4 my-4">
      <div className="flex mb-4">
        <button
          className="ml-auto text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={() => setOpenNewRevenue(true)}
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Thêm phí thu mới
        </button>
      </div>
      <div className={`${rows.length <= 0 && "h-48"}`}>
        <DataGrid
          className="bg-white"
          columns={columns}
          rows={rows}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          slots={{
            noRowsOverlay: () => (
              <div className="pt-8 text-center">
                Không có phí thu nào, hãy tạo phí thu mới!
              </div>
            ),
          }}
        />
      </div>
      {openNewRevenue && (
        <OtherFeeModal
          open={openNewRevenue}
          onClose={() => setOpenNewRevenue(false)}
          name="Thêm loại thu mới"
          method="POST"
          revenue={null}
          policyId={listRevenue.Policy.policyId}
        />
      )}
      {openEditRevenue && (
        <OtherFeeModal
          open={openEditRevenue}
          onClose={() => setOpenEditRevenue(false)}
          name="Chỉnh sửa loại thu"
          method="PUT"
          revenue={listRevenue.LIST_OTHER_REVENUE_DETAIL.find(
            (revenue) => revenue.policyDetailId === selectedRevenueId
          )}
          policyId={listRevenue.Policy.policyId}
        />
      )}
      {openDeleteRevenue && (
        <DeleteOtherFeeModal
          open={openDeleteRevenue}
          onClose={() => setOpenDeleteRevenue(false)}
          revenue={listRevenue.LIST_OTHER_REVENUE_DETAIL.find(
            (revenue) => revenue.policyDetailId === selectedRevenueId
          )}
          policyId={listRevenue.Policy.policyId}
        />
      )}
      {openStatusRevenue && (
        <StatusOtherFeeModal
          open={openStatusRevenue}
          onClose={() => setOpenStatusRevenue(false)}
          revenue={listRevenue.LIST_OTHER_REVENUE_DETAIL.find(
            (revenue) => revenue.policyDetailId === selectedRevenueId
          )}
          policyId={listRevenue.Policy.policyId}
        />
      )}
    </div>
  );
}

export default OtherFee;
