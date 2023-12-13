import {
  defer,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import { useState } from "react";
import SurCharge from "../../components/Policy/SurChange";
import TimeUsing from "../../components/Policy/TimeUsing";
import OtherFee from "../../components/Policy/OtherFee";
import Swal from "sweetalert2";
import ExchangeRoom from "../../components/Policy/ExchangeRoom";
import Promotion from "../../components/Policy/Promotion";

function PolicyManagementPage() {
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
            <p>Cọc, huỷ phòng</p>
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
        {exchangeRoom && <ExchangeRoom />}
        {promotion && <Promotion />}
      </div>
    </div>
  );
}

export default PolicyManagementPage;

async function loadSoonCheckinSurcharge() {
  const response = await axiosPrivate
    .get("policy/EARLIER_OVERTIME_SURCHARGE")
    .catch((e) => {
      console.log(e);
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
      console.log(e);
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
      console.log(e);
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
      console.log(e);
    });
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("/login");
  }
}

async function loadOtherRevenue() {
  const response = await axiosPrivate.get("policy/OTHER_REVENUE").catch((e) => {
    return redirect("/login");
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

async function loadDeposit() {
  const response = await axiosPrivate.get("policy/SETUP_DEPOSIT").catch((e) => {
    console.log(e);
  });
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("/login");
  }
}

async function loadCancelRoom() {
  const response = await axiosPrivate
    .get("policy/CHANGE_CANCEL_ROOM_SURCHARGE")
    .catch((e) => {
      console.log(e);
    });
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("/login");
  }
}

async function loadPoints() {
  const response = await axiosPrivate
    .get("policy/SETUP_POINT_SYSTEM")
    .catch((e) => {
      console.log(e);
    });
  if (response.data.success) {
    return response.data.result;
  } else {
    return redirect("/login");
  }
}

async function loadPromotion() {
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
    timeUsing: await loadTimeUsing(),
    listRevenue: await loadOtherRevenue(),
    listDeposit: await loadDeposit(),
    cancelRoom: await loadCancelRoom(),
    points: await loadPoints(),
    promotion: await loadPromotion(),
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
          `policyDetailDTO[${countCheckin}].CustomerGroupId`,
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
    return { success: true };
  }

  //Setup policy surcharge person fee
  if (data.get("isPersonFee")) {
    // console.log(data.get("adultPolicyId"));
    // console.log(data.get("childrenPolicyId"));
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
        if (numberAdult !== null && priceAdult !== null) {
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
        if (numberChildren !== null && priceChildren !== null) {
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
    }
    const response1 = await axiosPrivate
      .post("policy", formDataAdult)
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Cập nhật giá phụ thu thêm người thất bại",
          showConfirmButton: false,
          timer: 2000,
        });
      });
    const response2 = await axiosPrivate
      .post("policy", formDataChildren)
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Cập nhật giá phụ thu thêm người thất bại",
          showConfirmButton: false,
          timer: 2000,
        });
      });
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
    return { success: true };
  }

  //Setup policy time using
  if (data.get("isTimeUsing")) {
    const formData = new FormData();
    formData.append("timeUseId", data.get("timeUseId"));
    formData.append("timeBonusHour", data.get("overTimeHour"));
    formData.append("startTimeNight", data.get("fromTimeNight"));
    formData.append("endTimeNight", data.get("toTimeNight"));
    formData.append("startTimeDay", data.get("fromTimeDay"));
    formData.append("endTimeDay", data.get("toTimeDay"));
    formData.append("timeBonusDay", data.get("overTimeDay"));
    const response = await axiosPrivate
      .put("policy/time_use", formData)
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Cập nhật thời gian sử dụng thất bại",
          showConfirmButton: false,
          timer: 2000,
        });
      });
    if (response) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cập nhật thời gian sử dụng thành công",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Cập nhật thời gian sử dụng thất bại",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    return { success: true };
  }

  //Setup policy other fee
  if (data.get("isOtherFee")) {
    //Add other fee
    if (method === "POST") {
      const formData = new FormData();
      formData.append("policyDetailDTO.policyId", data.get("policyId"));
      formData.append("policyDetailDTO.customerGroupId", "NK000000");
      formData.append("policyDetailDTO.roomCategoryId", "HP000000");
      formData.append("policyDetailDTO.type", data.get("type"));
      formData.append(
        "policyDetailDTO.typeValue",
        data.get("isVND") === "true" ? "VND" : "%"
      );
      formData.append("policyDetailDTO.policyValue", data.get("typeValue"));
      formData.append("policyDetailDTO.autoAddToInvoice", data.get("isAuto"));
      const response = await axiosPrivate
        .post("policy/other", formData)
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Thêm phí thu khác thất bại",
            showConfirmButton: false,
            timer: 2000,
          });
        });
      if (response.data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Thêm phí thu khác thành công",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Thêm phí thu khác thất bại",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      return { success: true };
    }
    //Update other fee
    if (method === "PUT") {
      //Update status of other fee
      if (data.get("isStatus")) {
        const formData = new FormData();
        formData.append("policyDetailDTO.policyId", data.get("policyId"));
        formData.append(
          "policyDetailDTO.policyDetailId",
          data.get("policyDetailId")
        );
        formData.append("policyDetailDTO.customerGroupId", "NK000000");
        formData.append("policyDetailDTO.roomCategoryId", "HP000000");
        formData.append("policyDetailDTO.status", data.get("status"));
        const response = await axiosPrivate
          .post("policy/other", formData)
          .catch((e) => {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Cập nhật trạng thái phí thu khác thất bại",
              showConfirmButton: false,
              timer: 2000,
            });
          });
        if (response.data.success) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Cập nhật trạng thái phí thu khác thành công",
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Cập nhật trạng thái phí thu khác thất bại",
            showConfirmButton: false,
            timer: 2000,
          });
        }
        return { success: true };
      }
      const formData = new FormData();
      formData.append("policyDetailDTO.policyId", data.get("policyId"));
      formData.append(
        "policyDetailDTO.policyDetailId",
        data.get("policyDetailId")
      );
      formData.append("policyDetailDTO.customerGroupId", "NK000000");
      formData.append("policyDetailDTO.roomCategoryId", "HP000000");
      formData.append("policyDetailDTO.type", data.get("type"));
      formData.append(
        "policyDetailDTO.typeValue",
        data.get("isVND") === "true" ? "VND" : "%"
      );
      formData.append("policyDetailDTO.policyValue", data.get("typeValue"));
      formData.append("policyDetailDTO.autoAddToInvoice", data.get("isAuto"));
      const response = await axiosPrivate
        .post("policy/other", formData)
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Cập nhật phí thu khác thất bại",
            showConfirmButton: false,
            timer: 2000,
          });
        });
      if (response.data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cập nhật phí thu khác thành công",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Cập nhật phí thu khác thất bại",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      return { success: true };
    }
    //Delete other fee
    if (method === "DELETE") {
      const formData = new FormData();
      formData.append("policyDetailDTO.policyId", data.get("policyId"));
      formData.append(
        "policyDetailDTO.policyDetailId",
        data.get("policyDetailId")
      );
      formData.append("policyDetailDTO.customerGroupId", "NK000000");
      formData.append("policyDetailDTO.roomCategoryId", "HP000000");
      formData.append("policyDetailDTO.status", 6);
      const response = await axiosPrivate
        .post("policy/other", formData)
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Xoá phí thu khác thất bại",
            showConfirmButton: false,
            timer: 2000,
          });
          return;
        });
      if (response.data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Xoá phí thu khác thành công",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Xoá phí thu khác thất bại",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      return { success: true };
    }
    return { success: true };
  }

  if (data.get("isDeposit")) {
    const formData = new FormData();
    const policyId = data.get("policyId");
    formData.append(`policyDetailDTO[0].policyId`, policyId);
    if (data.get(`policyDetailId`)) {
      formData.append(
        `policyDetailDTO[0].policyDetailId`,
        data.get(`policyDetailId`)
      );
    }
    formData.append(`policyDetailDTO[0].customerGroupId`, "NK000000");
    formData.append(`policyDetailDTO[0].roomCategoryId`, "HP000000");
    formData.append(`policyDetailDTO[0].policyValue`, data.get(`policyValue`));
    const response = await axiosPrivate.post("policy", formData).catch((e) => {
      console.log(e);
    });
    if (response && response.data.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cập nhật giá tiền cọc thành công",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Cập nhật giá tiền cọc thất bại",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    return { success: true };
  }

  if (data.get("isCancelRoom")) {
    const formData = new FormData();
    const policyId = data.get("policyId");
    const numberCancel = data.get("numberCancel");
    for (let i = 0; i < numberCancel; i++) {
      formData.append(`policyDetailDTO[${i}].policyId`, policyId);
      if (data.get(`policyDetailId${i}`)) {
        formData.append(
          `policyDetailDTO[${i}].policyDetailId`,
          data.get(`policyDetailId${i}`)
        );
      }
      formData.append(`policyDetailDTO[${i}].roomCategoryId`, "HP000000");
      formData.append(`policyDetailDTO[${i}].customerGroupId`, "NK000000");
      formData.append(
        `policyDetailDTO[${i}].limitValue`,
        data.get(`limitValue${i}`)
      );
      formData.append(
        `policyDetailDTO[${i}].policyValue`,
        data.get(`policyValue${i}`)
      );
    }
    const response = await axiosPrivate.post("policy", formData).catch((e) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Cập nhật giá huỷ phòng thất bại",
        showConfirmButton: false,
        timer: 2000,
      });
    });
    if (response.data.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cập nhật giá huỷ phòng thành công",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Cập nhật giá huỷ phòng thất bại",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    return { success: true };
  }

  if (data.get("isPromotion")) {
    const formData = new FormData();
    formData.append(`policyDetailDTO[0].policyId`, data.get("policyId"));
    if (data.get("policyDetailId")) {
      formData.append(
        "policyDetailDTO[0].policyDetailId",
        data.get("policyDetailId")
      );
    }
    formData.append("policyDetailDTO[0].roomCategoryId", "HP000000");
    formData.append("policyDetailDTO[0].customerGroupId", "NK000000");
    formData.append("policyDetailDTO[0].limitValue", data.get("limitValue"));
    formData.append("policyDetailDTO[0].policyValue", data.get("policyValue"));
    const response = await axiosPrivate.post("policy", formData).catch((e) => {
      console.log(e);
    });
    if (response && response.data.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cập nhật khuyến mãi thành công",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Cập nhật khuyến mãi thất bại",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    return { success: true };
  }

  if (data.get("isPoint")) {
    const formData = new FormData();
    formData.append(`policyDetailDTO[0].policyId`, data.get("policyId"));
    if (data.get("policyDetailId")) {
      formData.append(
        "policyDetailDTO[0].policyDetailId",
        data.get("policyDetailId")
      );
    }
    formData.append("policyDetailDTO[0].roomCategoryId", "HP000000");
    formData.append("policyDetailDTO[0].customerGroupId", "NK000000");
    formData.append("policyDetailDTO[0].limitValue", data.get("limitValue"));
    formData.append("policyDetailDTO[0].policyValue", data.get("policyValue"));
    const response = await axiosPrivate.post("policy", formData).catch((e) => {
      console.log(e);
    });
    if (response.data.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cập nhật tích điểm thành công",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Cập nhật tích điểm thất bại",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    return { success: true };
  }
}
