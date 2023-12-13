import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import ButtonHover from "../../components/UI/ButtonHover";
import NewCustomer from "../../components/Customer/NewCustomer";
import DetailsCustomer from "../../components/Customer/DetailsCustomer";
import { axiosPrivate } from "../../utils/axiosConfig";
import { defer, redirect, useLoaderData } from "react-router-dom";
import EditCustomer from "../../components/Customer/EditCustomer";
import DeleteCustomer from "../../components/Customer/DeleteCustomer";
import ButtonClick from "../../components/UI/ButtonClick";
import Swal from "sweetalert2";
import NewGroupCustomer from "../../components/NewGroupCustomer";
import CustomerGroupForm from "../../components/UI/CustomerGroupForm";
import DeleteCustomerGroup from "../../components/CustomerGroup/DeleteCustomerGroup";

function CustomerManagementPage() {
  const { customers, customerGroups } = useLoaderData();
  const [hoveredCustomerGroups, setHoveredCustomerGroups] = useState(null);
  const [filteredCustomerGroups, setfilteredCustomerGroups] = useState([]);
  const [openNewGroupCusModal, setOpenNewGroupCusModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCustomerGroups, setSelectedCustomerGroups] = useState(null);
  const [selectedCustomerGroupName, setSelectedCustomerGroupName] = useState(null);
  const [customerByCustomerGroups, setCustomerByCustomerGroups] = useState(customers);
  const [selectedCustomerGroupId, setSelectedCustomerGroupId] = useState(null);
  const [openEditCustomerGroupModal, setOpenEditCustomerGroupModal] = useState(null);
  const [openDeleteCustomerGroupModal, setOpenDeleteCustomerGroupModal] = useState(null);


  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [openNewCustomerModal, setOpenNewCustomerModal] = useState(false);
  const [openEditCustomerModal, setOpenEditCustomerModal] = useState(false);
  const [openDetailsCustomerModal, setOpenDetailsCustomerModal] = useState(false);
  const [openDeleteCustomerModal, setOpenDeleteCustomerModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const newCustomerHandler = () => {
    setOpenNewCustomerModal(true);
  };

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


  const handleEditCustomerGroup = (id) => {
    setOpenEditCustomerGroupModal(true);
    setSelectedCustomerGroupId(id);
  };
  const handleDeleteCustomerGroup = (id) => {
    setOpenDeleteCustomerGroupModal(true);
    setSelectedCustomerGroupId(id);
  };


  // const handleEditArea = (customerGroupsId) => {
  //   setSelectedCustomerGroupsId(customerGroupsId);
  //   setOpenEditAreaModal(true);
  // };

  useEffect(() => {
    const filtered = customerGroups.filter(customerGroups => customerGroups.customerGroupName.toLowerCase().includes(searchValue.toLowerCase()));
    setfilteredCustomerGroups(filtered);
  }, [customerGroups, searchValue]);

  useEffect(() => {
    console.log(customers);
    const filtered = selectedCustomerGroups
      ? customers.filter(customer => customer.customerGroup.customerGroupName === selectedCustomerGroups)
      : customers;
    setCustomerByCustomerGroups(filtered);
  }, [customers, selectedCustomerGroups]);

  const handleSelectAllCustomerGroups = () => {
    setSelectedCustomerGroups(null);
    setSelectedCustomerGroupName(null);
    setCustomerByCustomerGroups(customers);
  };

  const handleCustomerGroupsSelection = (customerGroupName) => {
    setSelectedCustomerGroups(customerGroupName);
    setSelectedCustomerGroupName(customerGroupName);
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

  const rows = customerByCustomerGroups.filter((customer) => customer.status !== 'NO_ACTIVE').map((cus) => {
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


  return (

    <div className="flex flex-row">
      <div className=" mt-10 mx-5">
        <div className="flex pt-1 mt-10">
          <div className="w-10/12 text-1xl ">
            <p className="text-lg font-bold">Nhóm khách hàng</p>
          </div>
          <div className="w-2/12">
            <button
              type="button"
              className="w-1/12 text-2xl text-gray-500"
              onClick={() => setOpenNewGroupCusModal(true)}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
            {openNewGroupCusModal && (
              <NewGroupCustomer
                open={openNewGroupCusModal}
                onClose={() => setOpenNewGroupCusModal(false)}
              />
            )}
          </div>
        </div>
        <div className="">
          <input
            type="text"
            placeholder="Tìm kiếm "
            className="w-full p-2 border border-gray-300 rounded"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="pt-2 ">
          <button
            type="button"
            className="w-full p-1 border border-gray-300 rounded bg-gray-200"
            onClick={handleSelectAllCustomerGroups}
          >
            Tất cả nhóm khách hàng
          </button>
          <div className="overflow-y-auto h-40">
            {filteredCustomerGroups.map((customerGroups, index) => (
              <div className="flex flex-row custom-button "
                key={index}
                onMouseEnter={() => setHoveredCustomerGroups(customerGroups.customerGroupName)}
                onMouseLeave={() => setHoveredCustomerGroups(null)}
              >
                <button className="pt-1 ms-3 basis-3/4 text-left " onClick={() => handleCustomerGroupsSelection(customerGroups.customerGroupName)}>
                  {customerGroups.customerGroupName}
                </button>
                {hoveredCustomerGroups === customerGroups.customerGroupName && (
                  <button
                    type="button"
                    className="basis-1/4 text-1xl text-gray-500"
                    onClick={() => handleEditCustomerGroup(customerGroups.customerGroupId)}
                  >
                    <i className="fa-solid fa-pen-to-square edit-action"></i>
                  </button>
                )}
                {hoveredCustomerGroups === customerGroups.customerGroupName && (
                  <button
                    type="button"
                    className="basis-1/4 text-1xl text-gray-500"
                    onClick={() => handleDeleteCustomerGroup(customerGroups.customerGroupId)}
                  >
                    <i className="fa-solid fa-trash edit-action"></i>
                  </button>
                )}
              </div>
            ))}
            {openEditCustomerGroupModal && (
              <CustomerGroupForm
                open={openEditCustomerGroupModal}
                onClose={() => setOpenEditCustomerGroupModal(false)}
                customerGroupId={selectedCustomerGroupId}
              />
            )}
             {openDeleteCustomerGroupModal && (
              <DeleteCustomerGroup
                open={openDeleteCustomerGroupModal}
                onClose={() => setOpenDeleteCustomerGroupModal(false)}
                customerGroupId={selectedCustomerGroupId}
              />
            )}
          </div>
        </div>
      </div>
      <div className="w-10/12">
        <Box className="h-full w-11/12 mt-10">
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
      </div>
    </div >

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
  try {
    const response = await axiosPrivate
      .get("customer/customerGroup")
      .catch((e) => {
        redirect("/login");
      });
    if (response.data.success) {
      return response.data.result.filter((customer) => customer.status !== 'NO_ACTIVE');
    } else {
      window.location.href = "/login";
      return;
    }
  } catch (e) {
    window.location.href = "/login";
    return;
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
  if (data.get("isEditGroup")) {
    const formData = new FormData();
    formData.append("customerGroupId", data.get("customerGroupId"));
    formData.append("customerGroupName", data.get("groupCusName"));

    const response = await axiosPrivate
      .post("customer/customerGroup", formData)
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Chỉnh sửa nhóm khách hàng thất bại",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    if (response.data.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Chỉnh sửa nhóm khách hàng thành công",
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
          title: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data.message,
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
          title: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/customerManagement");
  }
  if (method === "DELETE") {
    const dataArray = data.get("customerGroupId");
    const response = await axiosPrivate
      .delete("customer/customerGroup/" + dataArray)
      .then((response) => {
        let message = "";
       
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Xóa nhóm khách hàng thành công",
          showConfirmButton: true,
        });
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Xóa nhóm khách hàng thất bại",
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
          message += response.data[id] + " có mã khách hàng là " + id + "<br/>";
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
          title: e.response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return redirect("/manager/customerManagement");
  }
  return redirect("/manager/customerManagement");
}
