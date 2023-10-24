import { defer, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import SearchProduct from "../../components/Search/SearchProduct";
import SearchCustomer from "../../components/Search/SearchCustomer";
import NewCustomer from "../../components/Customer/NewCustomer";
import SelectRoom from "../../components/Reservation/SelectRoom";
import { useState } from "react";

function AddReservationPage() {
  const { products, customers } = useLoaderData();

  return (
    <div className="h-[45.5rem] px-5">
      <div className="w-full py-2 h-1/6">
        <SearchCustomer customers={customers} />
        <div className="flex my-auto rounded-lg py-2">
          <div className="px-2 py-1 mr-2 rounded-lg bg-white">
            <button
              type="button"
              className="px-2 py-1 rounded text-green-500 hover:bg-green-200"
            >
              P.402
              <i className="fa-solid fa-xmark pl-2"></i>
            </button>
            <button
              type="button"
              className="px-2 py-1 rounded text-orange-500 hover:bg-orange-200"
            >
              P.502
              <i className="fa-solid fa-xmark pl-2"></i>
            </button>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-green-500 hover:bg-green-100"
          >
            <i className="fa-solid fa-circle-plus pr-2"></i>
            Phòng
          </button>
          <button
            type="button"
            className="px-4 py-2 ml-auto rounded-lg text-white bg-blue-500 hover:bg-blue-600"
          >
            Trả phòng
          </button>
          <button
            type="button"
            className="px-4 py-2 ml-2 rounded-lg border-black border"
          >
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>
      </div>
      <div className="w-full py-2 h-4/6">
        <SelectRoom />
      </div>
      <div className="w-full py-2 h-1/6">3</div>
    </div>
  );
}

export default AddReservationPage;

async function loadProducts() {
  const response = await axiosPrivate.get("goods");
  return response.data;
}

async function loadCustomers() {
  const response = await axiosPrivate.get("customer");
  return response.data;
}

export async function loader() {
  return defer({
    products: await loadProducts(),
    customers: await loadCustomers(),
  });
}
