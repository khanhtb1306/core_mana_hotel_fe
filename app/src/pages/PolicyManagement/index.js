import { defer, redirect, useLoaderData } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import { useState } from "react";
import SurCharge from "../../components/Policy/SurChange";
import TimeUsing from "../../components/Policy/TimeUsing";
import OtherFee from "../../components/Policy/OtherFee";
import Swal from "sweetalert2";

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

async function loadAdultSurcharge() {
  const response = await axiosPrivate
    .get("policy/ADDITIONAL_ADULT_SURCHARGE")
    .catch((e) => {
      return redirect("/login");
    });
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("/login");
  }
}

async function loadChildrenSurcharge() {
  const response = await axiosPrivate
    .get("policy/ADDITIONAL_CHILDREN_SURCHARGE")
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
    listAdult: await loadAdultSurcharge(),
    listChildren: await loadChildrenSurcharge(),
    categories: await loadCategories(),
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  //Setup policy surcharge hour fee
  if (data.get("isHourFee")) {
    const numberCategories = data.get("numberCategories");
    const formDataCheckin = new FormData();
    const formDataCheckout = new FormData();
    let countCheckin = 0;
    let countCheckout = 0;
    for (let i = 0; i < numberCategories; i++) {
      const numberCheckin = data.get(`numberCheckin[${i}]`);
      const numberCheckout = data.get(`numberCheckout[${i}]`);
      const roomCategoryId = data.get(`roomCategoryId[${i}]`);
      for (let j = 0; j < numberCheckin; j++) {
        const hourCheckin = data.get(`hourCheckin[${i}][${j}]`);
        const priceCheckin = data.get(`priceCheckin[${i}][${j}]`);
        if (data.get(`policyDetailIdCheckin[${i}][${j}]`)) {
          formDataCheckin.append(
            `policyDetailDTO[${countCheckin}].policyDetailId`,
            data.get(`policyDetailIdCheckin[${i}][${j}]`)
          );
        }
        formDataCheckin.append(
          `policyDetailDTO[${countCheckin}].policyId`,
          data.get("checkinPolicyId")
        );
        formDataCheckin.append(
          `policyDetailDTO[${countCheckin}].roomCategoryId`,
          roomCategoryId
        );
        formDataCheckin.append(
          `policyDetailDTO[${countCheckin}].customerGroupId`,
          "NK000000"
        );
        formDataCheckin.append(
          `policyDetailDTO[${countCheckin}].limitValue`,
          hourCheckin
        );
        formDataCheckin.append(
          `policyDetailDTO[${countCheckin}].policyValue`,
          priceCheckin
        );
        countCheckin++;
      }
      for (let j = 0; j < numberCheckout; j++) {
        const hourCheckout = data.get(`hourCheckout[${i}][${j}]`);
        const priceCheckout = data.get(`priceCheckout[${i}][${j}]`);
        if (data.get(`policyDetailIdCheckout[${i}][${j}]`)) {
          formDataCheckout.append(
            `policyDetailDTO[${countCheckout}].policyDetailId`,
            data.get(`policyDetailIdCheckout[${i}][${j}]`)
          );
        }
        formDataCheckout.append(
          `policyDetailDTO[${countCheckout}].policyId`,
          data.get("checkoutPolicyId")
        );
        formDataCheckout.append(
          `policyDetailDTO[${countCheckout}].roomCategoryId`,
          roomCategoryId
        );
        formDataCheckout.append(
          `policyDetailDTO[${countCheckout}].customerGroupId`,
          "NK000000"
        );
        formDataCheckout.append(
          `policyDetailDTO[${countCheckout}].limitValue`,
          hourCheckout
        );
        formDataCheckout.append(
          `policyDetailDTO[${countCheckout}].policyValue`,
          priceCheckout
        );
        countCheckout++;
      }
    }
    const response1 = await axiosPrivate.post("policy", formDataCheckin);
    const response2 = await axiosPrivate.post("policy", formDataCheckout);
    if (response1.data.success && response2.data.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cập nhật giá phụ thu thêm giờ thành công",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Cập nhật giá phụ thu thêm giờ thất bại",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    return redirect("/manager/policy");
  }

  //Setup policy surcharge person fee
  if (data.get("isPersonFee")) {
    // console.log(data.get("adultPolicyId"));
    // console.log(data.get("childrenPolicyId"));
    // return redirect("/manager/policy");
    const numberCategories = data.get("numberCategories");
    const formDataAdult = new FormData();
    const formDataChildren = new FormData();
    let countAdult = 0;
    let countChildren = 0;
    for (let i = 0; i < numberCategories; i++) {
      const numberAdult = data.get(`numberAdult[${i}]`);
      const numberChildren = data.get(`numberChildren[${i}]`);
      const roomCategoryId = data.get(`roomCategoryId[${i}]`);
      for (let j = 0; j < numberAdult; j++) {
        const numberAdult = data.get(`numberAdult[${i}][${j}]`);
        const priceAdult = data.get(`priceAdult[${i}][${j}]`);
        if (data.get(`policyDetailIdAdult[${i}][${j}]`)) {
          formDataAdult.append(
            `policyDetailDTO[${countAdult}].policyDetailId`,
            data.get(`policyDetailIdAdult[${i}][${j}]`)
          );
        }
        formDataAdult.append(
          `policyDetailDTO[${countAdult}].policyId`,
          data.get("adultPolicyId")
        );
        formDataAdult.append(
          `policyDetailDTO[${countAdult}].roomCategoryId`,
          roomCategoryId
        );
        formDataAdult.append(
          `policyDetailDTO[${countAdult}].customerGroupId`,
          "NK000000"
        );
        formDataAdult.append(
          `policyDetailDTO[${countAdult}].limitValue`,
          numberAdult
        );
        formDataAdult.append(
          `policyDetailDTO[${countAdult}].policyValue`,
          priceAdult
        );
        countAdult++;
      }
      for (let j = 0; j < numberChildren; j++) {
        const numberChildren = data.get(`numberChildren[${i}][${j}]`);
        const priceChildren = data.get(`priceChildren[${i}][${j}]`);
        if (data.get(`policyDetailIdChildren[${i}][${j}]`)) {
          formDataChildren.append(
            `policyDetailDTO[${countChildren}].policyDetailId`,
            data.get(`policyDetailIdChildren[${i}][${j}]`)
          );
        }
        formDataChildren.append(
          `policyDetailDTO[${countChildren}].policyId`,
          data.get("childrenPolicyId")
        );
        formDataChildren.append(
          `policyDetailDTO[${countChildren}].roomCategoryId`,
          roomCategoryId
        );
        formDataChildren.append(
          `policyDetailDTO[${countChildren}].customerGroupId`,
          "NK000000"
        );
        formDataChildren.append(
          `policyDetailDTO[${countChildren}].limitValue`,
          numberChildren
        );
        formDataChildren.append(
          `policyDetailDTO[${countChildren}].policyValue`,
          priceChildren
        );
        countChildren++;
      }
    }
    const response1 = await axiosPrivate.post("policy", formDataAdult);
    const response2 = await axiosPrivate.post("policy", formDataChildren);
    if (response1.data.success && response2.data.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cập nhật giá phụ thu thêm người thành công",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Cập nhật giá phụ thu thêm người thất bại",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    return redirect("/manager/policy");
  }
}
