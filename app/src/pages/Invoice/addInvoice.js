import { defer, redirect } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import Swal from "sweetalert2";
import AddRetailInvoice from "../../components/Reservation/AddRetailInvoice";

function AddInvoicePage() {
  return <AddRetailInvoice />;
}

export default AddInvoicePage;

async function loadCustomers() {
  const response = await axiosPrivate.get("customer");
  return response.data;
}

async function loadCustomerGroup() {
  const response = await axiosPrivate.get("customer/customerGroup");
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/error";
    return;
  }
}

async function loadOtherRevenue() {
  const response = await axiosPrivate.get("policy/OTHER_REVENUE");
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/error";
    return;
  }
}

async function loadPoints() {
  const response = await axiosPrivate
    .get("policy/PROMOTION_POLICY")
    .catch((e) => {
      console.log(e);
    });
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("/login");
  }
}

async function loadListGoodUnits() {
  const response = await axiosPrivate.get("goods-unit");
  return response.data;
}

async function loadListQR() {
  const response = await axiosPrivate.get("qr-code");
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/error";
    return;
  }
}

export async function loader() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/error";
    return;
  }
  Swal.fire({
    didOpen: () => {
      Swal.showLoading();
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    background: "transparent",
  });
  try {
    const goodsUnit = await loadListGoodUnits();
    const otherFees = await loadOtherRevenue();
    const points = await loadPoints();
    const customerGroups = await loadCustomerGroup();
    const customers = await loadCustomers();
    const listQR = await loadListQR();
    return defer(
      {
        goodsUnit,
        otherFees,
        points,
        customerGroups,
        customers,
        listQR,
      },
      Swal.close()
    );
  } catch (error) {
    Swal.close();
    window.location.href = "/error";
    return;
  }
}

export async function action({ request }) {
  Swal.fire({
    didOpen: () => {
      Swal.showLoading();
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    background: "transparent",
  });
  const method = request.method;
  const data = await request.formData();
  if (data.get("newMainCustomer")) {
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
    const response = await axiosPrivate
      .post("customer", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(response);
    return { success: true, addCustomer: response.data };
  }

  if (data.get("editMainCustomer")) {
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
    const response = await axiosPrivate
      .put("customer/" + data.get("customerId"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((e) => {
        console.log(e);
      });
    return { success: true, editCustomer: response.data };
  }

  if (data.get("addRetailInvoice")) {
    const formData = new FormData();
    formData.append("invoiceDTO.total", data.get("totalPay"));
    formData.append("invoiceDTO.paidMethod", data.get("paidMethod"));
    formData.append("invoiceDTO.priceOther", data.get("priceOther"));
    formData.append("invoiceDTO.customerId", data.get("customerId"));
    formData.append("invoiceDTO.transactionCode", data.get("transactionCode"));
    const length = data.get("length");
    for (let i = 0; i < length; i++) {
      formData.append(
        `orderDetailDTOList[${i}].goodsId`,
        data.get("goodsId" + i)
      );
      formData.append(
        `orderDetailDTOList[${i}].quantity`,
        data.get("number" + i)
      );
      formData.append(`orderDetailDTOList[${i}].price`, data.get("price" + i));
      formData.append(
        `orderDetailDTOList[${i}].goodsUnitId`,
        data.get("goodsUnitId" + i)
      );
    }
    const response = await axiosPrivate
      .post("invoice/purchase", formData)
      .catch((e) => {
        console.log(e);
      });
    Swal.close();
    return redirect("/listReservation");
  }

  //Add account bank
  if (data.get("isAddAccountBank")) {
    const formAccount = new FormData();
    formAccount.append("bankId", data.get("bankId"));
    formAccount.append("bankAccountNumber", data.get("bankAccountNumber"));
    formAccount.append("bankAccountName", data.get("bankAccountName"));
    // const response = await axiosPrivate
    //   .post("qr-code", formAccount)
    //   .catch((e) => {
    //     console.log(e);
    //   });
    return { success: true };
  }
}
