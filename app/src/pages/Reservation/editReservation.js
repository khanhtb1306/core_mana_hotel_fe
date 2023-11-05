import { defer, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import SearchProduct from "../../components/Search/SearchProduct";
import SearchCustomer from "../../components/Search/SearchCustomer";
import NewCustomer from "../../components/Customer/NewCustomer";
import SelectRoom from "../../components/Reservation/SelectRoom";
import { useState } from "react";
import ReservationForm from "../../components/UI/ReservationForm";

function EditReservationPage() {
  const { reservation } = useLoaderData();
//   console.log(reservation);

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
  const response = await axiosPrivate.get("reservation/{id}?id=" + id);
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("login");
  }
}

export async function loader({ request, params }) {
  const id = params.reservationId;

  return defer({
    categories: await loadCategories(),
    prices: await loadPriceList(),
    customers: await loadCustomers(),
    reservation: await loadReservationById(id),
  });
}
