import { defer, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import ReservationForm from "../../components/UI/ReservationForm";
import Swal from "sweetalert2";
import dayjs from "dayjs";

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
    window.location.href = "/error";
    return;
  }
}

async function loadCategories() {
  const response = await axiosPrivate.get("room-class");
  return response.data;
}

async function loadListFundsById(id) {
  const response = await axiosPrivate.get(
    "reservation/get_fund_book_by_reservation?reservationId=" + id
  );
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/error";
    return;
  }
}

async function loadReservationById(id) {
  const response = await axiosPrivate.get("reservation/" + id);
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/error";
    return;
  }
}

async function loadInvoicesById(id) {
  const response = await axiosPrivate.get("order/by_reservation/" + id);
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/error";
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
    window.location.href = "/error";
    return;
  }
}

async function loadTimeUsing() {
  const response = await axiosPrivate.get("policy/time_use");
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/error";
    return;
  }
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

async function loadDeposit() {
  const response = await axiosPrivate.get("policy/SETUP_DEPOSIT").catch((e) => {
    console.log(e);
  });
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/error";
    return;
  }
}

async function loadInvoiceReservation(id) {
  const response = await axiosPrivate.get("invoice/reservation/" + id);
  if (response.data.success) {
    return response.data.result;
  } else {
    Swal.close();
    window.location.href = "/error";
    return;
  }
}

async function loadListSurchage(id) {
  const response = await axiosPrivate.get(
    "reservation/get_control_policy_by_reservation?reservationId=" + id
  );
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

export async function loader({ request, params }) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/error";
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
    const points = await loadPoints();
    const customerGroups = await loadCustomerGroup();
    const goodsUnit = await loadGoodsUnit();
    const categories = await loadCategories();
    const invoices = await loadInvoicesById(id);
    const prices = await loadPriceList();
    const customers = await loadCustomers();
    const listQR = await loadListQR();
    const otherFees = await loadOtherRevenue();
    const deposit = await loadDeposit();
    const listFunds = await loadListFundsById(id);
    const invoiceReservation = await loadInvoiceReservation(id);
    const listSurchage = await loadListSurchage(id);
    const reservation = await loadReservationById(id);
    return defer(
      {
        timeUsing,
        points,
        customerGroups,
        goodsUnit,
        categories,
        invoices,
        prices,
        customers,
        listQR,
        otherFees,
        deposit,
        listFunds,
        invoiceReservation,
        listSurchage,
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
    if (data.get("customerId") === null) {
      return { success: true, isNotCustomer: true };
    }
    const formReser = new FormData();
    formReser.append("customerId", data.get("customerId"));
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
      .catch((e) => {
        console.log(e);
      });
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
  //Add Room in reservation
  if (data.get("addRoom")) {
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
            console.log(res);
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
        formData.append(`orderDetailDTOList[${i}].invoiceId`, "HD000000");
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
        console.log(e);
      });
      return { success: true, isAddInvoice: response };
    }
    //Edit Invoice
    if (method === "PUT") {
      const formData = new FormData();
      formData.append("orderDTO.orderId", data.get("orderId"));
      formData.append(
        "orderDTO.reservationDetailId",
        data.get("reservationDetailId")
      );
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
        console.log(data.get("goodsId" + i));
        formData.append(
          `orderDetailDTOList[${i}].goodsUnitId`,
          data.get("goodsUnitId" + i)
        );
        console.log(data.get("goodsUnitId" + i));
        console.log(data.get("price" + i));
        console.log(data.get("number" + i));
        formData.append(
          `orderDetailDTOList[${i}].price`,
          data.get("price" + i)
        );
        formData.append(
          `orderDetailDTOList[${i}].quantity`,
          data.get("number" + i)
        );
      }
      // return { success: true };
      const response = await axiosPrivate
        .put("order/" + data.get("orderId"), formData)
        .catch((e) => {
          console.log(e);
        });
      return { success: true, isEditInvoice: response };
    }
    return { success: true };
  }
  if (data.get("isStatusInvoice")) {
    const formData = new FormData();
    formData.append("status", data.get("status"));
    const response = await axiosPrivate
      .put("order/updateStatus/" + data.get("orderId"), formData)
      .catch((e) => {
        console.log(e);
      });
    return {
      success: true,
      isStatusInvoice: response,
      status: data.get("status") === "CONFIRMED" ? "Xác nhận" : "Trả",
    };
  }
  if (data.get("isCancelInvoice")) {
    const formData = new FormData();
    formData.append("status", data.get("status"));
    const response = await axiosPrivate
      .put("order/updateStatus/" + data.get("orderId"), formData)
      .catch((e) => {
        console.log(e);
      });
    return { success: true, isCancelInvoice: response };
  }

  if (data.get("removeRoom")) {
    //Remove room in reservation
    const response = await axiosPrivate
      .delete("reservation-detail/" + data.get("reservationDetailsId"))
      .catch((er) => console.log(er));
    return { success: true, removeRoom: response };
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

  //Change room
  if (data.get("isChangeRoom")) {
    if (data.get("status") === "BOOKING") {
      const formDetails = new FormData();
      formDetails.append("reservationId", reservationId);
      formDetails.append("roomId", data.get("oldRoomId"));
      formDetails.append("reservationDetailDTO.roomId", data.get("roomId"));
      formDetails.append("reservationDetailDTO.price", data.get("price"));
      const response = await axiosPrivate
        .put("reservation-detail/change-room", formDetails)
        .catch((e) => {
          console.log(e);
        });
      return { success: true, changeRoom: response.data.success };
    } else if (data.get("status") === "CHECK_IN") {
      if (data.get("radio") === "1") {
        const formDetails = new FormData();
        formDetails.append("reservationId", reservationId);
        formDetails.append("roomId", data.get("oldRoomId"));
        formDetails.append("reservationDetailDTO.roomId", data.get("roomId"));
        formDetails.append("reservationDetailDTO.price", data.get("price"));
        const response = await axiosPrivate
          .put("reservation-detail/change-room", formDetails)
          .catch((e) => {
            console.log(e);
          });
        console.log(response);
        return { success: true, changeRoom: response.data.success };
      } else {
        const formCheckout = new FormData();
        formCheckout.append("checkInActual", data.get("fromTime"));
        formCheckout.append(
          "checkOutActual",
          dayjs().format("YYYY-MM-DD HH:mm:ss")
        );
        formCheckout.append("price", data.get("price1"));
        formCheckout.append("status", "CHECK_OUT");
        // return { success: true };
        const response1 = await axiosPrivate
          .put(
            "reservation-detail/" + data.get("reservationDetailId"),
            formCheckout
          )
          .catch((e) => {
            console.log(e);
          });
        if (response1.data.success) {
          const formCheckin = new FormData();
          formCheckin.append("reservationId", reservationId);
          formCheckin.append("roomId", data.get("roomId"));
          formCheckin.append("reservationType", data.get("reservationType"));
          formCheckin.append(
            "checkInActual",
            dayjs().format("YYYY-MM-DD HH:mm:ss")
          );
          formCheckin.append("checkOutEstimate", data.get("toTime"));
          formCheckin.append("price", data.get("price2"));
          formCheckin.append("status", "CHECK_IN");
          const response2 = await axiosPrivate
            .post("reservation-detail", formCheckin)
            .catch((e) => {
              console.log(e);
            });
          return { success: true, changeRoom: response2.data.success };
        }
        return { success: true, changeRoom: false };
      }
    }
    return { success: true };
  }

  //Add account bank
  if (data.get("isAddAccountBank")) {
    const formAccount = new FormData();
    formAccount.append("bankId", data.get("bankId"));
    formAccount.append("bankAccountNumber", data.get("bankAccountNumber"));
    formAccount.append("bankAccountName", data.get("bankAccountName"));
    const response = await axiosPrivate
      .post("qr-code", formAccount)
      .catch((e) => {
        console.log(e);
      });
    return { success: true };
  }
  //Create payment
  if (data.get("isCreateInvoiceRoom")) {
    const formInvoice = new FormData();
    const listReservationDetails = data
      .get("listReservationDetails")
      .split(",");
    for (let i = 0; i < listReservationDetails.length; i++) {
      formInvoice.append(
        `reservationDetailDTO[${i}].reservationDetailId`,
        listReservationDetails[i]
      );
      formInvoice.append(
        `reservationDetailDTO[${i}].reservationId`,
        data.get("reservationId")
      );
    }
    formInvoice.append("invoiceDTO.total", data.get("total"));
    formInvoice.append("invoiceDTO.discount", data.get("discount"));
    formInvoice.append("invoiceDTO.prePail", data.get("prePail"));
    formInvoice.append(
      "invoiceDTO.paidMethod",
      data.get("paidMethod") === "1" ? "CASH" : "TRANSFER"
    );
    formInvoice.append("invoiceDTO.priceOther", data.get("priceOther"));
    formInvoice.append("invoiceDTO.customerId", data.get("customerId"));
    formInvoice.append(
      "invoiceDTO.transactionCode",
      data.get("transactionCode")
    );
    formInvoice.append("invoiceDTO.usePoint", data.get("usePoint"));
    // console.log(data.get("total"));
    // console.log(data.get("discount"));
    // console.log(data.get("prePail"));
    // console.log(data.get("paidMethod"));
    // console.log(data.get("priceOther"));
    // console.log(data.get("customerId"));
    // console.log(data.get("transactionCode"));
    // console.log(data.get("usePoint"));
    const response = await axiosPrivate
      .post("invoice/reservation", formInvoice)
      .catch((e) => {
        console.log(e);
      });
    console.log(response);
    return { success: true, isCreateInvoiceRoom: true };
    return redirect("/listReservation");
  }
  //Add deposit
  if (data.get("addDeposit")) {
    let payPrice = Number(data.get("payPrice"));
    let depositPrice = Number(data.get("depositPrice"));
    const formDeposit = new FormData();
    const priceAll = Number(data.get("priceAll"));
    if (payPrice > priceAll - depositPrice) {
      payPrice = priceAll - depositPrice;
    }
    formDeposit.append("reservationId", data.get("reservationId"));
    formDeposit.append("money", payPrice);
    formDeposit.append(
      "paidMethod",
      data.get("payType") === "1" ? "CASH" : "TRANSFER"
    );
    formDeposit.append("transactionCode", data.get("transactionCode"));
    const response = await axiosPrivate
      .post("fund-book/create_fund_book_by_deposit", formDeposit)
      .catch((e) => {
        console.log(e);
        Swal.close();
      });
    return { success: true, addDeposit: response };
  }

  return { success: true };
}
