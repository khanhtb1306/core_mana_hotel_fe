import { defer, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import ReservationForm from "../../components/UI/ReservationForm";
import dayjs from "dayjs";

function AddReservationPage() {
  return <ReservationForm reservation={null} />;
}

export default AddReservationPage;

async function loadCustomerGroup() {
  const response = await axiosPrivate
    .get("customer/customerGroup")
    .catch((e) => {
      console.log(e);
    });
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("/login");
  }
}

async function loadTimeUsing() {
  const response = await axiosPrivate.get("policy/time_use").catch((e) => {
    console.log(e);
  });
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("/login");
  }
}
async function loadPriceList() {
  const response = await axiosPrivate.get("price-list");
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("login");
  }
}

async function loadCustomers() {
  const response = await axiosPrivate.get("customer");
  return response.data;
}

async function loadGoodsUnit() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("goods-unit");
  return response.data;
}

async function loadCategories() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("room-class");
  return response.data;
}

export async function loader() {
  return defer({
    timeUsing: await loadTimeUsing(),
    customerGroups: await loadCustomerGroup(),
    goodsUnit: await loadGoodsUnit(),
    categories: await loadCategories(),
    prices: await loadPriceList(),
    customers: await loadCustomers(),
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  if (data.get("addRoom")) {
    //Add new reservation
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
    formReser.append("totalChildren", 0);
    formReser.append("totalAdults", 0);
    formReser.append("totalDeposit", 0);
    formReser.append("totalPrice", 0);
    const categories = data.get("categories");
    formReser.append("status", "BOOKING");
    const response = await axiosPrivate
      .post("reservation", formReser)
      .catch((e) => {
        console.log(e);
      });
    if (response.data.success) {
      for (let i = 0; i < categories; i++) {
        const listCateRoomId = data.get("listCateRoomId" + i).split("|");
        const numberRoom = data.get("numberRoom" + i);
        const listPrice = data.get(`historyPrice${i}`).split(",");
        let price = 0;
        const formPrice = new FormData();
        for (let k = 0; k < listPrice.length; k++) {
          const priceTime = listPrice[k].split("|");
          formPrice.append(`timePrices[${k}].time`, priceTime[0]);
          formPrice.append(`timePrices[${k}].price`, priceTime[1]);
          price += Number(priceTime[1]);
        }
        for (let j = 0; j < numberRoom; j++) {
          const formData = new FormData();
          formData.append("reservationId", response.data.result);
          formData.append("checkInEstimate", data.get("fromTime"));
          formData.append("checkOutEstimate", data.get("toTime"));
          formData.append("reservationType", data.get("reservationType"));
          formData.append("status", "BOOKING");
          formData.append("price", price);
          formData.append("roomId", listCateRoomId[j]);
          const responseDetail = await axiosPrivate
            .post("reservation-detail", formData)
            .catch((er) => console.log(er));
          if (responseDetail && responseDetail.data.success) {
            formPrice.append(
              "reservationDetailId",
              responseDetail.data.result.reservationDetailId
            );
            await axiosPrivate
              .post(
                "reservation-detail/update_price_History_ver_time",
                formPrice
              )
              .catch((e) => console.log(e));
          }
        }
      }
      return redirect("/editReservation/" + response.data.result);
    } else {
      return { success: false };
    }
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
    formData.append("customer", true);
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
    formData.append("customer", data.get("isCustomer"));
    const response = await axiosPrivate
      .put("customer/" + data.get("customerId"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(response);
    return { success: true, editCustomer: response.data };
  }
}
