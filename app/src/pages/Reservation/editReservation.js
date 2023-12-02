import { defer, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import ReservationForm from "../../components/UI/ReservationForm";
import Swal from "sweetalert2";

function EditReservationPage() {
  const { reservation } = useLoaderData();

  return <ReservationForm reservation={reservation} />;
}

export default EditReservationPage;

async function loadCustomers() {
  const response = await axiosPrivate.get("customer");
  return response.data;
}

async function loadPriceList() {
  const response = await axiosPrivate.get("price-list");
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/login";
    return;
  }
}

async function loadCategories() {
  const response = await axiosPrivate.get("room-class");
  return response.data;
}

async function loadReservationById(id) {
  const response = await axiosPrivate.get("reservation/" + id);
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/login";
    return;
  }
}

async function loadInvoicesById(id) {
  const response = await axiosPrivate.get("order/by_reservation/" + id);
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/login";
    return;
  }
}

async function loadGoodsUnit() {
  const response = await axiosPrivate.get("goods-unit");
  return response.data;
}

async function loadCustomerGroup() {
  const response = await axiosPrivate.get("customer/customerGroup");
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/login";
    return;
  }
}

async function loadTimeUsing() {
  const response = await axiosPrivate.get("policy/time_use");
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/login";
    return;
  }
}

export async function loader({ request, params }) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  const id = params.reservationId;
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
    const timeUsing = await loadTimeUsing();
    const customerGroups = await loadCustomerGroup();
    const goodsUnit = await loadGoodsUnit();
    const categories = await loadCategories();
    const invoices = await loadInvoicesById(id);
    const prices = await loadPriceList();
    const customers = await loadCustomers();
    const reservation = await loadReservationById(id);
    return defer(
      {
        timeUsing,
        customerGroups,
        goodsUnit,
        categories,
        invoices,
        prices,
        customers,
        reservation,
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
  const reservationId = data.get("reservationId");
  let listRoom = [];
  if (data.get("isReservation")) {
    const formReser = new FormData();
    if (data.get("customerId")) {
      formReser.append("customerId", data.get("customerId"));
    } else {
      formReser.append("customerId", "C000000");
    }
    if (data.get("priceListId")) {
      if (data.get("priceListId") === "0") {
        formReser.append("priceListId", "BG000000");
      } else {
        formReser.append("priceListId", data.get("priceListId"));
      }
    } else {
      formReser.append("priceListId", "BG000000");
    }
    const response = await axiosPrivate
      .put("reservation/" + reservationId, formReser)
      .catch((e) => {
        console.log(e);
      });
    const numberRoom = data.get("numberRoom");
    for (let i = 0; i < numberRoom; i++) {
      const formDetails = new FormData();
      formDetails.append("reservationId", reservationId);
      formDetails.append("roomId", data.get(`roomId${i}`));
      formDetails.append("reservationType", data.get(`reservationType${i}`));
      if (data.get(`isBooking${i}`)) {
        formDetails.append("checkInEstimate", data.get(`fromTime${i}`));
        formDetails.append("checkOutEstimate", data.get(`toTime${i}`));
        formDetails.append("price", Number(data.get(`price${i}`)));
        const response = await axiosPrivate
          .put(
            "reservation-detail/" + data.get(`reservationDetailId${i}`),
            formDetails
          )
          .catch((e) => {
            console.log(e);
          });
        listRoom = [...listRoom, response.data];
      }
      if (data.get(`isCheckin${i}`)) {
        formDetails.append("checkInActual", data.get(`fromTime${i}`));
        formDetails.append("checkOutEstimate", data.get(`toTime${i}`));
        formDetails.append("price", Number(data.get(`price${i}`)));
        const response = await axiosPrivate
          .put(
            "reservation-detail/" + data.get(`reservationDetailId${i}`),
            formDetails
          )
          .catch((e) => {
            console.log(e);
          });
        listRoom = [...listRoom, response.data];
      }
    }
    console.log(listRoom);
    if (listRoom.find((room) => !room.success)) {
      return { success: true, listRoom: listRoom };
    }
  }
  if (data.get("isAddGroup")) {
    const formData = new FormData();
    formData.append("customerGroupName", data.get("groupCusName"));
    const response = await axiosPrivate
      .post("customer/customerGroup", formData)
      .catch((e) => {
        console.log(e);
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
    return { success: true };
  }
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
      .then((response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Thêm khách hàng thành công",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Thêm khách hàng thất bại",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return { success: true };
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
      .then((response) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Chỉnh sửa khách hàng thành công",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Chỉnh sửa khách hàng thất bại",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    return { success: true };
  }
  if (data.get("isVisitor")) {
    //Add visitor in reservation details
    if (method === "POST") {
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
      if (response) {
        const formData1 = new FormData();
        formData1.append(
          "reservationDetailCustomerDTO.reservationDetailId",
          data.get("reservationDetailId")
        );
        formData1.append(
          "reservationDetailCustomerDTO.customerId",
          response.data.customerId
        );
        formData1.append("adult", data.get("isAdult"));
        await axiosPrivate
          .post("reservation-detail/reservation-detail-customer", formData1)
          .then((e) => {
            console.log(e);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
    //Edit visitor in reservation details
    if (method === "PUT") {
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
      // return { success: true };
      const response = await axiosPrivate
        .put("customer/" + data.get("customerId"), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch((e) => {
          console.log(e);
        });
      if (response && data.get("isChange") !== null) {
        const formData1 = new FormData();
        formData1.append(
          "reservationDetailCustomerDTO.reservationDetailId",
          data.get("reservationDetailId")
        );
        formData1.append(
          "reservationDetailCustomerDTO.customerId",
          data.get("customerId")
        );
        formData1.append("adult", data.get("isAdult"));
        formData1.append("check", data.get("isChange"));
        await axiosPrivate
          .put("reservation-detail/reservation-detail-customer", formData1)
          .then((e) => {
            console.log(e);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
    //Remove visitor in reservation details
    if (method === "DELETE") {
      await axiosPrivate
        .delete(
          "reservation-detail/reservation-detail-customer/" +
            data.get("reservationDetailCustomerId") +
            "?isAdult=" +
            data.get("isAdult")
        )
        .catch((e) => {
          console.log(e);
        });
      const dataArray = data.get("customerId").split(",");
      await axiosPrivate.delete("customer/" + dataArray).catch((e) => {
        console.log(e);
      });
    }
    return { success: true };
  }
  console.log("a");
  //Add Room in reservation
  if (data.get("addRoom")) {
    console.log("b");
    const categories = data.get("categories");
    let listAddingRoom = [];
    for (let i = 0; i < categories; i++) {
      const listCateRoomId = data.get("listCateRoomId" + i).split("|");
      const numberRoom = data.get("numberRoom" + i);
      for (let j = 0; j < numberRoom; j++) {
        const formData = new FormData();
        formData.append("reservationId", reservationId);
        formData.append("checkInEstimate", data.get("fromTime"));
        formData.append("checkOutEstimate", data.get("toTime"));
        formData.append("reservationType", data.get("reservationType"));
        formData.append("status", "BOOKING");
        formData.append("price", data.get("price" + i));
        formData.append("roomId", listCateRoomId[j]);
        await axiosPrivate
          .post("reservation-detail", formData)
          .then((res) => {
            listAddingRoom = [...listAddingRoom, res.data];
          })
          .catch((er) => console.log(er));
      }
    }
    return { success: true, listAddingRoom: listAddingRoom };
  }
  //Action Invoice in reservation details
  if (data.get("isInvoice")) {
    //Create Invoice
    if (method === "POST") {
      const formData = new FormData();
      formData.append(
        "orderDTO.reservationDetailId",
        data.get("reservationDetailId")
      );
      formData.append("orderDTO.totalPay", data.get("totalPay"));
      formData.append("orderDTO.status", "UNCONFIRMED");
      const length = data.get("length");
      for (let i = 0; i < length; i++) {
        formData.append(
          `orderDetailDTOList[${i}].goodsId`,
          data.get("goodsId" + i)
        );
        formData.append(
          `orderDetailDTOList[${i}].goodsUnitId`,
          data.get("goodsUnitId" + i)
        );
        formData.append(
          `orderDetailDTOList[${i}].price`,
          data.get("price" + i)
        );
        formData.append(
          `orderDetailDTOList[${i}].quantity`,
          data.get("number" + i)
        );
      }
      const response = await axiosPrivate.post("order", formData).catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Thêm hoá đơn thất bại",
          showConfirmButton: false,
          timer: 1500,
        });
      });
      if (response.data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Thêm hoá đơn thành công",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Thêm hoá đơn thất bại",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
    //Edit Invoice
    if (method === "PUT") {
      const formData = new FormData();
      formData.append(
        "orderDTO.reservationDetailId",
        data.get("reservationDetailId")
      );
      formData.append("orderDTO.orderId", data.get("orderId"));
      formData.append("orderDTO.totalPay", data.get("totalPay"));
      formData.append("orderDTO.status", "UNCONFIRMED");
      const length = data.get("length");
      for (let i = 0; i < length; i++) {
        formData.append(
          `orderDetailDTOList[${i}].orderId`,
          data.get("orderId")
        );
        formData.append(
          `orderDetailDTOList[${i}].goodsId`,
          data.get("goodsId" + i)
        );
        formData.append(
          `orderDetailDTOList[${i}].goodsUnitId`,
          data.get("goodsUnitId" + i)
        );
        formData.append(
          `orderDetailDTOList[${i}].price`,
          data.get("price" + i)
        );
        formData.append(
          `orderDetailDTOList[${i}].quantity`,
          data.get("number" + i)
        );
      }
      const response = await axiosPrivate
        .put("order/" + data.get("orderId"), formData)
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Chỉnh sửa hoá đơn thất bại",
            showConfirmButton: false,
            timer: 1500,
          });
        });
      if (response.data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Chỉnh sửa hoá đơn thành công",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Chỉnh sửa hoá đơn thất bại",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
    return { success: true };
  }
  if (data.get("isStatusInvoice")) {
    const formData = new FormData();
    formData.append("status", data.get("status"));
    const response = await axiosPrivate
      .put("order/updateStatus/" + data.get("orderId"), formData)
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Chỉnh sửa trạng thái hoá đơn thất bại",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    if (response.data.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Chỉnh sửa trạng thái hoá đơn thành công",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Chỉnh sửa trạng thái hoá đơn thất bại",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    return { success: true };
  }
  if (data.get("isCancelInvoice")) {
    const formData = new FormData();
    formData.append("status", data.get("status"));
    const response = await axiosPrivate
      .put("order/updateStatus/" + data.get("orderId"), formData)
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Huỷ hoá đơn thất bại",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    if (response.data.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Huỷ hoá đơn thành công",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Huỷ hoá đơn thất bại",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    return { success: true };
  }

  if (data.get("removeRoom")) {
    //Remove room in reservation
    await axiosPrivate
      .delete("reservation-detail/" + data.get("reservationDetailsId"))
      .then((res) => console.log(res))
      .catch((er) => console.log(er));
    return { success: true };
  }

  //Change status room to checkin
  if (data.get("isReceiveRoom")) {
    const formDetails = new FormData();
    formDetails.append("checkInActual", data.get("fromTime"));
    formDetails.append("checkOutEstimate", data.get("toTime"));
    formDetails.append("price", data.get("price"));
    formDetails.append("status", "CHECK_IN");
    const response = await axiosPrivate
      .put("reservation-detail/" + data.get("reservationDetailId"), formDetails)
      .catch((e) => {
        console.log(e);
      });
    return { success: true, checkinRoom: response.data };
  }

  //Change status room to checkout
  if (data.get("isPayRoom")) {
    const formDetails = new FormData();
    formDetails.append("checkInActual", data.get("fromTime"));
    formDetails.append("checkOutActual", data.get("toTime"));
    formDetails.append("price", data.get("price"));
    formDetails.append("status", "CHECK_OUT");
    const response = await axiosPrivate
      .put("reservation-detail/" + data.get("reservationDetailId"), formDetails)
      .catch((e) => {
        console.log(e);
      });
    return { success: true, checkoutRoom: response.data };
  }
  return { success: true };
}
