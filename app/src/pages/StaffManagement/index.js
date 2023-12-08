import { Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
} from "@mui/x-data-grid";
import { useState } from "react";
import ButtonHover from "../../components/UI/ButtonHover";
import DetailsStaff from "../../components/Staff/DetailsStaff";
import DeleteStaff from "../../components/Staff/DeleteStaff";
import NewStaff from "../../components/Staff/NewStaff";
import EditStaff from "../../components/Staff/EditStaff";
import AdminStaff from "../../components/Staff/AdminStaff";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import { defer, redirect, useLoaderData } from "react-router-dom";
import ButtonClick from "../../components/UI/ButtonClick";
import Swal from "sweetalert2";

function StaffManagementPage() {
  const { staffs,departments } = useLoaderData();

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewStaffModal, setOpenNewStaffModal] = useState(false);
  const [openEditStaffModal, setOpenEditStaffModal] = useState(false);
  const [openDetailsStaffModal, setOpenDetailsStaffModal] = useState(false);
  const [openDeleteStaffModal, setOpenDeleteStaffModal] = useState(false);
  const [openAdminStaffModal, setOpenAdminStaffModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const handleDetailsStaff = (id) => {
    setOpenDetailsStaffModal(true);
    setSelectedStaffId(id);
  };

  const handleEditStaff = (id) => {
    setOpenEditStaffModal(true);
    setSelectedStaffId(id);
  };

  const deleteStaffHandler = () => {
    setOpenDeleteStaffModal(true);
  };

  const adminStaffHandler = () => {
    setOpenAdminStaffModal(true);
  };

  const columns = [
    { field: "code", headerName: "Mã nhân viên", width: 50 },
    { field: "nameStaff", headerName: "Tên nhân viên", width: 200 },
    { field: "status", headerName: "Tình trạng", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phoneNumber", headerName: "Số điện thoại", width: 150 },
    { field: "department", headerName: "Phòng ban", width: 150 },
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
            onClick={() => handleDetailsStaff(id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-pen-to-square"></i>}
            label="Sửa đổi"
            onClick={() => handleEditStaff(id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-trash"></i>}
            label="Xoá"
            onClick={() => {
              setSelectedStaffId(id);
              deleteStaffHandler();
            }}
          />,
          <GridActionsCellItem
            icon={<i className="bi bi-person-gear"></i>}
            label="Admin"
            onClick={() => {
              setSelectedStaffId(id);
              adminStaffHandler();
            }}
          />,
        ];
      },
    },
  ];

  const rows = Array.isArray(staffs)?staffs.map((staff) => {
    const gender = staff.gender ? "Nam giới" : "Nữ giới";
    const dateNow = new Date(staff.dob);
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, "0");
    const day = String(dateNow.getDate()).padStart(2, "0");
    const status = staff.status === 'ACTIVE' ? 'hoạt động' : 'không hoạt động';
    const formattedDate = `${year}-${month}-${day}`;
    return {
      id: staff.staffId,
      code: staff.staffId,
      nameStaff: staff.staffName,
      role: staff.role,
      status: status,
      DOB: formattedDate,
      address: staff.address,
      email: staff.email,
      identity: staff.identity,
      phoneNumber: staff.phoneNumber,
      department: staff.department.departmentName,
    };
  }):[];

  const newStaffHandler = () => {
    setOpenNewStaffModal(true);
  };

  return (
    <>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex mb-10">
          <h1 className="text-4xl">Nhân viên</h1>
          <div className="ml-auto flex">
            {rowSelectionModel.length > 0 ? (
              <div className="mx-2">
                <ButtonHover
                  action="Thao tác"
                  iconAction="fa-solid fa-ellipsis-vertical"
                  names={[
                    {
                      name: "Xoá nhân viên",
                      icon: "fa-solid fa-trash",
                      action: deleteStaffHandler,
                    },
                  ]}
                />
              </div>
            ) : null}
            <div className="mx-2">
              <ButtonClick
                name="Thêm mới nhân viên"
                iconAction="fa-solid fa-plus"
                action={newStaffHandler}
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
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
      {openNewStaffModal && (
        <NewStaff
          open={openNewStaffModal}
          onClose={() => setOpenNewStaffModal(false)}
          departments={departments}
        />
      )}

      {openEditStaffModal && selectedStaffId && (
        <EditStaff
          open={openEditStaffModal}
          onClose={() => setOpenEditStaffModal(false)}
          StaffId={selectedStaffId}
          departments={departments}

        />
      )}
      {openDetailsStaffModal && selectedStaffId && (
        <DetailsStaff
          open={openDetailsStaffModal}
          onClose={() => setOpenDetailsStaffModal(false)}
          StaffId={selectedStaffId}
        />
      )}
      {openDeleteStaffModal && rowSelectionModel && (
        <DeleteStaff
          open={openDeleteStaffModal}
          onClose={() => setOpenDeleteStaffModal(false)}
          listStaffId={rowSelectionModel}
        />
      )}
      {openDeleteStaffModal && selectedStaffId && (
        <DeleteStaff
          open={openDeleteStaffModal}
          onClose={() => setOpenDeleteStaffModal(false)}
          listStaffId={selectedStaffId}
        />
      )}
      {openAdminStaffModal && selectedStaffId && (
        <AdminStaff
          open={openAdminStaffModal}
          onClose={() => setOpenAdminStaffModal(false)}
          listStaffId={selectedStaffId}
        />
      )}
     
    </>
  );
}

export default StaffManagementPage;

async function loadStaffs() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("staff");
  return response.data.result;
}
async function loadDepartments() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("staff/department");
  return response.data.result;
}

export async function loader() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  return defer({
    // demo: await loadStaffs(),
    staffs: await loadStaffs(),
    departments: await loadDepartments()
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const formData = new FormData();
  // const body = new FormData();
  if (data.get("departmentName")) {

    formData.append("departmentName", data.get("departmentName"));
    formData.append("status", data.get("status"));

    const response = await axiosPrivate
      .post("staff/department", formData)
      .then((response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data.result,
          showConfirmButton: false,
          timer: 1500,
        });
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
    return redirect("/manager/staffManagement");
  }
  if(data.get("staffId") != null){
    formData.append("staffId", data.get("staffId"));
  }

  formData.append("staffName", data.get("staffName"));
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
  
  if(data.get("role")==="admin")
  {
    const response = await axiosPrivate
    .put("staff/admin/" + data.get("staffId"))
    .then((response) => {
      if(response.data.success)
        {
          
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.data.displayMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        }
        else{
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
      Swal.fire({
        position: "center",
        icon: "error",
        title: e.response.data.result,
        showConfirmButton: false,
        timer: 1500,
      });
    });
  return redirect("/manager/staffManagement");
  }

  console.log(data.get("image"));
  if (method === "POST") {
    const response = await axiosPrivate
      .post("staff", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if(response.data.success)
        {
          
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.data.displayMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        }
        else{
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

      if(data.get("staffId") === null && data.get("userName") !== ""){
       
        const body ={ email: data.get("email"), type:1}
        const response = await axiosConfig.post("auth/password-reset-request",body
        )
        .then((response) => {
        console.log(response);
        });
       
      }
    return redirect("/manager/staffManagement");
  }
  
  if (method === "DELETE") {
    const dataArray = data.get("staffId").split(",");
    const response = await axiosPrivate
      .delete("staff/" + dataArray)
      .then((response) => {
        let message = "";
        dataArray.map((id) => {
          message += response.data.result[id] + " có mã nhân viên là " + id + "<br/>";
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
    return redirect("/manager/staffManagement");
  }
  return redirect("/manager/staffManagement");
}
