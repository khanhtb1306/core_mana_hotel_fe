import { defer, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import { useState } from "react";
import SurCharge from "../../components/Policy/SurChange";
import TimeUsing from "../../components/Policy/TimeUsing";
import OtherFee from "../../components/Policy/OtherFee";

function PolicyManagementPage() {
  const { priceBooks } = useLoaderData();
  const [surcharge, setSurcharge] = useState(true);
  const [timeUsing, setTimeUsing] = useState(false);
  const [otherFee, setOtherFee] = useState(false);
  const [exchangeRoom, setExchange] = useState(false);
  const [promotion, setPromotion] = useState(false);

  return (
    <div className="flex m-4">
      <div className="w-2/12 my-4">
        <div className="flex flex-col">
          <button
            className={`bg-white px-4 py-2 rounded-t text-left flex ${
              surcharge && "border-l-2 border-blue-500 text-blue-500"
            }`}
            onClick={() => {
              setSurcharge(true);
              setTimeUsing(false);
              setOtherFee(false);
              setExchange(false);
              setPromotion(false);
            }}
          >
            <i className="fa-solid fa-hand-holding-dollar mr-4 my-auto"></i>
            <p>Phụ thu</p>
            <i className="ml-auto my-auto fa-solid fa-chevron-right"></i>
          </button>
          <button
            className={`bg-white px-4 py-2 rounded-t text-left flex ${
              timeUsing && "border-l-2 border-blue-500 text-blue-500"
            }`}
            onClick={() => {
              setSurcharge(false);
              setTimeUsing(true);
              setOtherFee(false);
              setExchange(false);
              setPromotion(false);
            }}
          >
            <i className="fa-regular fa-clock mr-4 my-auto"></i>
            <p>Thời gian sử dụng</p>
            <i className="ml-auto my-auto fa-solid fa-chevron-right"></i>
          </button>
          <button
            className={`bg-white px-4 py-2 rounded-t text-left flex ${
              otherFee && "border-l-2 border-blue-500 text-blue-500"
            }`}
            onClick={() => {
              setSurcharge(false);
              setTimeUsing(false);
              setOtherFee(true);
              setExchange(false);
              setPromotion(false);
            }}
          >
            <i className="fa-regular fa-money-bill-1 mr-4 my-auto"></i>
            <p>Phí thu khác</p>
            <i className="ml-auto my-auto fa-solid fa-chevron-right"></i>
          </button>
          <button
            className={`bg-white px-4 py-2 rounded-t text-left flex ${
              exchangeRoom && "border-l-2 border-blue-500 text-blue-500"
            }`}
            onClick={() => {
              setSurcharge(false);
              setTimeUsing(false);
              setOtherFee(false);
              setExchange(true);
              setPromotion(false);
            }}
          >
            <i className="fa-solid fa-arrow-right-arrow-left mr-4 my-auto"></i>
            <p>Đổi, huỷ phòng</p>
            <i className="ml-auto my-auto fa-solid fa-chevron-right"></i>
          </button>
          <button
            className={`bg-white px-4 py-2 rounded-t text-left flex ${
              promotion && "border-l-2 border-blue-500 text-blue-500"
            }`}
            onClick={() => {
              setSurcharge(false);
              setTimeUsing(false);
              setOtherFee(false);
              setExchange(false);
              setPromotion(true);
            }}
          >
            <i className="fa-solid fa-tag mr-4 my-auto"></i>
            <p>Khuyến mãi</p>
            <i className="ml-auto my-auto fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <div className="w-10/12">
        {surcharge && <SurCharge />}
        {timeUsing && <TimeUsing />}
        {otherFee && <OtherFee />}
      </div>
    </div>
  );
}

export default PolicyManagementPage;

async function loadSoonCheckinSurcharge() {
    const response = await axiosPrivate
      .get("policy/EARLIER_OVERTIME_SURCHARGE")
      .catch((e) => {
        return redirect("/login");
      });
    if (response.data.success) {
      return response.data.result;
    } else {
      return redirect("/login");
    }
  }

async function loadLateCheckoutSurcharge() {
  const response = await axiosPrivate
    .get("policy/LATER_OVERTIME_SURCHARGE")
    .catch((e) => {
      return redirect("/login");
    });
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("/login");
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

export async function loader() {
  return defer({
    listCheckin: await loadSoonCheckinSurcharge(),
    listCheckout: await loadLateCheckoutSurcharge(),
    categories: await loadCategories(),
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
}
