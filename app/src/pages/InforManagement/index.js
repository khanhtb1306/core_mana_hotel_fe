import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import { useLoaderData, redirect, defer, useNavigate } from "react-router-dom";
import InforForm from "../../components/UI/InforForm";
import { jwtDecode } from "jwt-decode";
import ChangePasswordForm from "../../components/Authen/ChangePasswordForm";
import Swal from "sweetalert2";
import ImageInput from "../../components/UI/ImageInput";

function InforManagementPage(props) {
  const { staffs } = useLoaderData();
  const [openButtonChangePassword, setButtonChangePassword] = useState(true);
  const [openChangePasswordForm, setChangePasswordForm] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    const isManagerUrlAccount = window.location.pathname.includes("/account");
    const isManagerUrlInfor = window.location.pathname.includes("/account");
    const userRole = staffs.role;

    if (isManagerUrlAccount && userRole === "ROLE_MANAGER") {
      history("/manager/inforManagement");
    }
    if (isManagerUrlInfor && userRole === "ROLE_RECEPTIONIST") {
      history("/account");
    }
  }, [history]);
  return (
    <div className="h-full w-10/12 mx-auto mt-10 bg-white">
      <div className="">
        {staffs && <InforForm method="post" staff={staffs} />}
        <div className="">
          <div className=" justify-content-between border border-dashed border-blue-500">
            <div className="my-2 flex justify-between">
              <div className="mt-2">
                <i className="fs-3 bi bi-lock-fill mx-2 "></i>
                <label className="me-4 text-lg font-bold"> Đổi mật khẩu </label>
              </div>
              {openButtonChangePassword && (
                <button
                  className="pt-2 float-right  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    setChangePasswordForm(true);
                    setButtonChangePassword(false);
                  }}
                >
                  Chỉnh sửa
                </button>
              )}
              {openChangePasswordForm && <ChangePasswordForm staff={staffs} />}
              {!openButtonChangePassword && (
                <button
                  className="text h-10 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    setChangePasswordForm(false);
                    setButtonChangePassword(true);
                  }}
                >
                  Bỏ qua
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function loadStaffs() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  const decoded = jwtDecode(token);
  const response = await axiosPrivate.get("account/" + decoded.staff_id);
  return response.data.result;
}
async function start(boolean) {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  return boolean;
}

export async function loader() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  return defer({
    staffs: await loadStaffs(),
    openChangePasswordForm: await start(false),
    openButtonChangePassword: await start(true),
  });
}
export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const formData = new FormData();
  const staffId = data.get("staffId");
  const oldPassword = data.get("oldPassword");
  const newPassword = data.get("newPassword");
  const confirmPassword = data.get("confirm-password");
  const role = data.get("role");

  formData.append("staffId", data.get("staffId"));
  formData.append("staffName", data.get("staffName"));
  formData.append("username", data.get("userName"));
  formData.append("phoneNumber", data.get("phoneNumber"));
  formData.append("dob", new Date(data.get("dob")).toISOString());
  formData.append("email", data.get("email"));
  formData.append("address", data.get("address"));
  formData.append("identity", data.get("identity"));
  formData.append("gender", data.get("gender"));
  formData.append("image", data.get("image"));
  formData.append("role", "ROLE_MANAGER");

  if (method === "POST") {
    const response = await axiosPrivate
      .post("account", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.data.displayMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: response.data.displayMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data.result,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    if (role === "ROLE_MANAGER") {
      return redirect("/manager/inforManagement");
    } else {
      return redirect("/account");
    }
  }

  if (method === "PUT") {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Mật khẩu không khớp với mật khẩu xác nhận",
        showConfirmButton: false,
        timer: 1500,
      });
      return null;
    }

    const passwordData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    const response = await axiosPrivate
      .put("staff/" + staffId, passwordData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.data.displayMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: response.data.displayMessage,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          position: "center",
          icon: "error",
          title: e.response.data.result,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    if (role === "ROLE_MANAGER") {
      return redirect("/manager/inforManagement");
    } else {
      return redirect("/account");
    }
  }
}
export default InforManagementPage;
