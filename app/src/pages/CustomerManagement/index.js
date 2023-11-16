import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import ButtonHover from "../../components/UI/ButtonHover";
import NewCustomer from "../../components/Customer/NewCustomer";
import DetailsCustomer from "../../components/Customer/DetailsCustomer";
import { axiosPrivate } from "../../utils/axiosConfig";
import { defer, redirect, useLoaderData } from "react-router-dom";
import EditCustomer from "../../components/Customer/EditCustomer";
import DeleteCustomer from "../../components/Customer/DeleteCustomer";
import ButtonClick from "../../components/UI/ButtonClick";
import Swal from "sweetalert2";

function CustomerManagementPage() {
  const { customers } = useLoaderData();

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewCustomerModal, setOpenNewCustomerModal] = useState(false);
  const [openEditCustomerModal, setOpenEditCustomerModal] = useState(false);
  const [openDetailsCustomerModal, setOpenDetailsCustomerModal] =
    useState(false);
  const [openDeleteCustomerModal, setOpenDeleteCustomerModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const handleDetailsCustomer = (id) => {
    setOpenDetailsCustomerModal(true);
    setSelectedCustomerId(id);
  };

  const handleEditCustomer = (id) => {
    setOpenEditCustomerModal(true);
    setSelectedCustomerId(id);
  };

  const deleteCustomerHandler = () => {
    setOpenDeleteCustomerModal(true);
  };

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
            onClick={() => handleDetailsCustomer(id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-pen-to-square"></i>}
            label="Sửa đổi"
            onClick={() => handleEditCustomer(id)}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-trash"></i>}
            label="Xoá"
            onClick={() => {
              setSelectedCustomerId(id);
              deleteCustomerHandler();
            }}
          />,
        ];
      },
    },
  ];

  const rows = customers.map((cus) => {
    const gender = cus.gender ? "Nam giới" : "Nữ giới";
    const dateNow = new Date(cus.dob);
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, "0");
    const day = String(dateNow.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return {
      id: cus.customerId,
      code: cus.customerId,
      nameCus: cus.customerName,
      customerGroup: cus.customerGroup.customerGroupName,
      IC: cus.identity,
      address: cus.address,
      phoneNumber: cus.phoneNumber,
      DOB: formattedDate,
      gender: gender,
      email: cus.email,
      taxCode: cus.taxCode,
    };
  });

  const newCustomerHandler = () => {
    setOpenNewCustomerModal(true);
  };

  return (
    <>
      <Box className="h-full w-10/12 mx-auto mt-10">
        <div className="flex mb-10">
          <h1 className="text-4xl">Khách hàng</h1>
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
                      action: deleteCustomerHandler,
                    },
                  ]}
                />
              </div>
            ) : null}
            <div className="mx-2">
              <ButtonClick
                name="Thêm mới khách hàng"
                iconAction="fa-solid fa-plus"
                action={newCustomerHandler}
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
      {openNewCustomerModal && (
        <NewCustomer
          open={openNewCustomerModal}
          onClose={() => setOpenNewCustomerModal(false)}
        />
      )}

      {openEditCustomerModal && selectedCustomerId && (
        <EditCustomer
          open={openEditCustomerModal}
          onClose={() => setOpenEditCustomerModal(false)}
          customerId={selectedCustomerId}
        />
      )}
      {openDetailsCustomerModal && selectedCustomerId && (
        <DetailsCustomer
          open={openDetailsCustomerModal}
          onClose={() => setOpenDetailsCustomerModal(false)}
          customerId={selectedCustomerId}
        />
      )}
      {openDeleteCustomerModal && rowSelectionModel && (
        <DeleteCustomer
          open={openDeleteCustomerModal}
          onClose={() => setOpenDeleteCustomerModal(false)}
          listCateRoomId={rowSelectionModel}
        />
      )}
      {openDeleteCustomerModal && selectedCustomerId && (
        <DeleteCustomer
          open={openDeleteCustomerModal}
          onClose={() => setOpenDeleteCustomerModal(false)}
          listCateRoomId={selectedCustomerId}
        />
      )}
    </>
  );
}

export default CustomerManagementPage;

async function loadCustomers() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("customer");
  return response.data;
}

async function loadCustomerGroup() {
  const response = await axiosPrivate
    .get("customer/customerGroup")
    .catch((e) => {
      redirect("/login");
    });
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("/login");
  }
}

export async function loader() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  return defer({
    customerGroups: await loadCustomerGroup(),
    customers: await loadCustomers(),
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  if (data.get("isAddGroup")) {
    const formData = new FormData();
    formData.append("customerGroupName", data.get("groupCusName"));
    const response = await axiosPrivate
      .post("customer/customerGroup", formData)
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Thêm nhóm khách hàng thất bại",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    if (response.data.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Thêm nhóm khách hàng thành công",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Thêm nhóm khách hàng thất bại",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    return redirect("/manager/customerManagement");
  }
  const formData = new FormData();
  formData.append("customerName", data.get("customerName"));
  formData.append("customerGroupId", data.get("customerGroupId"));
  formData.append("phoneNumber", data.get("phoneNumber"));
  formData.append("dob", new Date(data.get("dob")).toISOString());
  formData.append("email", data.get("email"));
  formData.append("address", data.get("address"));
  formData.append("identity", data.get("identity"));
  formData.append("nationality", data.get("nationality"));
  formData.append("taxCode", data.get("taxCode"));
  formData.append("gender", data.get("gender"));
  formData.append("image", data.get("image"));
  if (method === "POST") {
    const response = await axiosPrivate
      .post("customer", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    console.log(response);
    return redirect("/manager/customerManagement");
  }
  if (method === "PUT") {
    const response = await axiosPrivate
      .put("customer/" + data.get("customerId"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/customerManagement");
  }
  if (method === "DELETE") {
    const dataArray = data.get("customerId").split(",");
    const response = await axiosPrivate
      .delete("customer/" + dataArray)
      .then((response) => {
        let message = "";
        dataArray.map((id) => {
          message += response.data[id] + " có mã sản phẩm là " + id + "<br/>";
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
          title: e.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/customerManagement");
  }
  return redirect("/manager/customerManagement");
}
