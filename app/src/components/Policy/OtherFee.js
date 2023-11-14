import { DataGrid } from "@mui/x-data-grid";

function OtherFee() {
  const columns = [
    { field: "name", headerName: "Tên phòng", width: 150 },
    { field: "area", headerName: "Khu vực", width: 200 },
    { field: "status", headerName: "Trạng thái", width: 200 },
  ];

  const rows = [
    {
      id: 1,
      name: "12",
      area: "23",
      status: "34",
    },
  ];

  return (
    <div className="ml-4 my-4">
      <DataGrid
        columns={columns}
        rows={rows}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25]}
      />
    </div>
  );
}

export default OtherFee;
