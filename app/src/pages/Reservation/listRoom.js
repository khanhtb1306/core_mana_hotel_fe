import { defer, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import CustomCalendar from "../../components/FullCalendar/CustomCalendar";

function ListRoomPage() {
  return <CustomCalendar />;
}

export default ListRoomPage;

async function loadListRooms() {
  const response = await axiosPrivate.get(
    "reservation/get_active_room_class_with_active_rooms"
  );
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("/error");
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
    const listRoomsBycate = await loadListRooms();
    const timeUsing = await loadTimeUsing();
    const categories = await loadCategories();
    const prices = await loadPriceList();
    return defer(
      {
        listRoomsBycate,
        timeUsing,
        categories,
        prices,
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

  //Clean room
  if (data.get("isCleanRoom")) {
    const formRoom = new FormData();
    const status = data.get("status");
    formRoom.append("conditionStatus", status);
    const response = await axiosPrivate
      .put("room/" + data.get("roomId"), formRoom, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((e) => {
        console.log(e);
      });
    return {
      success: true,
      cleanRoom: response ? true : false,
      isClean: status === "ROOM_CLEAN" ? true : false,
    };
  }

  //Change room
  if (data.get("isChangeRoom")) {
    if (data.get("status") === "BOOKING") {
      const formDetails = new FormData();
      formDetails.append("reservationId", data.get("reservationId"));
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
        formDetails.append("reservationId", data.get("reservationId"));
        formDetails.append("roomId", data.get("oldRoomId"));
        formDetails.append("reservationDetailDTO.roomId", data.get("roomId"));
        formDetails.append("reservationDetailDTO.price", data.get("price"));
        const response = await axiosPrivate
          .put("reservation-detail/change-room", formDetails)
          .catch((e) => {
            console.log(e);
          });
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
          formCheckin.append("reservationId", data.get("reservationId"));
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

  //Change status room to checkin
  if (data.get("isReceiveRoom")) {
    const formDetails = new FormData();
    const listPrice = data.get(`historyPrice`).split(",");
    let price = 0;
    const formPrice = new FormData();
    for (let k = 0; k < listPrice.length; k++) {
      const priceTime = listPrice[k].split("|");
      formPrice.append(`timePrices[${k}].time`, priceTime[0]);
      formPrice.append(`timePrices[${k}].price`, priceTime[1]);
      price += Number(priceTime[1]);
    }
    formDetails.append("checkInActual", data.get("fromTime"));
    formDetails.append("checkOutEstimate", data.get("toTime"));
    formDetails.append("price", price + "");
    formDetails.append("status", "CHECK_IN");
    const response = await axiosPrivate
      .put("reservation-detail/" + data.get("reservationDetailId"), formDetails)
      .catch((e) => {
        console.log(e);
      });
    if (response && response.data.success) {
      formPrice.append(
        "reservationDetailId",
        response.data.result.reservationDetailId
      );
      await axiosPrivate
        .post("reservation-detail/update_price_History_ver_time", formPrice)
        .catch((e) => console.log(e));
    }
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

  if (data.get("addRoom")) {
    //Add new reservation
    const formReser = new FormData();
    formReser.append("customerId", "C000000");
    formReser.append("priceListId", "BG000000");
    formReser.append("totalChildren", 0);
    formReser.append("totalAdults", 0);
    formReser.append("totalDeposit", 0);
    formReser.append("totalPrice", 0);
    formReser.append("status", "BOOKING");
    const response = await axiosPrivate
      .post("reservation", formReser)
      .catch((e) => {
        console.log(e);
      });
    const listPrice = data.get(`historyPrice`).split(",");
    let price = 0;
    const formPrice = new FormData();
    for (let k = 0; k < listPrice.length; k++) {
      const priceTime = listPrice[k].split("|");
      formPrice.append(`timePrices[${k}].time`, priceTime[0]);
      formPrice.append(`timePrices[${k}].price`, priceTime[1]);
      price += Number(priceTime[1]);
    }
    if (response && response.data.success) {
      //Add new room in reservation
      const formData = new FormData();
      formData.append("reservationId", response.data.result);
      formData.append("checkInEstimate", data.get("fromTime"));
      formData.append("checkOutEstimate", data.get("toTime"));
      formData.append("reservationType", data.get("reservationType"));
      formData.append("status", "BOOKING");
      formData.append("price", price);
      formData.append("roomId", data.get("roomId"));
      const responseDetail = await axiosPrivate
        .post("reservation-detail", formData)
        .catch((er) => console.log(er));
      if (responseDetail && responseDetail.data.success) {
        formPrice.append(
          "reservationDetailId",
          responseDetail.data.result.reservationDetailId
        );
        await axiosPrivate
          .post("reservation-detail/update_price_History_ver_time", formPrice)
          .catch((e) => console.log(e));
      }
      return redirect("/editReservation/" + response.data.result);
    } else {
      return { success: false };
    }
  }
}
