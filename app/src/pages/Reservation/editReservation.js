import { defer, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import ReservationForm from "../../components/UI/ReservationForm";
import { useState } from "react";

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
    return redirect("login");
  }
}

async function loadCategories() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("room-class");
  return response.data;
}

async function loadReservationById(id) {
  const response = await axiosPrivate.get("reservation/" + id);
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("login");
  }
}

async function loadGoodsUnit() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const response = await axiosPrivate.get("goods-unit");
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

export async function loader({ request, params }) {
  const id = params.reservationId;

  return defer({
    customerGroups: await loadCustomerGroup(),
    goodsUnit: await loadGoodsUnit(),
    categories: await loadCategories(),
    prices: await loadPriceList(),
    customers: await loadCustomers(),
    reservation: await loadReservationById(id),
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const reservationId = data.get("reservationId");
  const isAddRoom = data.get("addRoom");
  if (isAddRoom) {
    //Add Room in reservation
    if (method === "POST") {
      const categories = data.get("categories");
      for (let i = 0; i < categories; i++) {
        const listCateRoomId = data.get("listCateRoomId" + i).split("|");
        const numberRoom = data.get("numberRoom" + i);
        for (let j = 0; j < numberRoom; j++) {
          const formData = new FormData();
          formData.append("customerIds", []);
          formData.append("reservationDetailDTO.reservationId", reservationId);
          formData.append(
            "reservationDetailDTO.checkInEstimate",
            data.get("fromTime")
          );
          formData.append(
            "reservationDetailDTO.checkOutEstimate",
            data.get("toTime")
          );
          formData.append(
            "reservationDetailDTO.reservationType",
            data.get("reservationType")
          );
          formData.append("reservationDetailDTO.status", "BOOKING");
          formData.append("reservationDetailDTO.price", data.get("price" + i));

          formData.append("reservationDetailDTO.roomId", listCateRoomId[j]);
          await axiosPrivate
            .post("reservation-detail", formData)
            .then((res) => console.log(res))
            .catch((er) => console.log(er));
        }
      }
    }
    return redirect("/editReservation/" + reservationId);
  }
  const isRemoveRoom = data.get("removeRoom");
  if (isRemoveRoom) {
    //Remove room in reservation
    if (method === "DELETE") {
      await axiosPrivate
        .delete("reservation-detail/" + data.get("reservationDetailsId"))
        .then((res) => console.log(res))
        .catch((er) => console.log(er));
    }
    return redirect("/editReservation/" + reservationId);
  }

  return redirect("/editReservation/" + reservationId);
}
