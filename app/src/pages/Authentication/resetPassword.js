import { json, redirect } from "react-router-dom";
import { axiosConfig } from "../../utils/axiosConfig";
import ResetPasswordForm from "../../components/Authen/ResetPasswordForm";

function ResetPasswordPage() {
  return <ResetPasswordForm />;
}

export default ResetPasswordPage;

export async function action({ request }) {
  const data = await request.formData();
  const password = data.get("password");
  const confirmPassword = data.get("confirm-password");
  if (password !== confirmPassword) {
    return "Mật khẩu không khớp với mật khẩu xác nhận";
  }
  const emailData = {
    newPassword: password,
  };
  const token = localStorage.getItem("token");
  const response = await axiosConfig
    .post("auth/reset-password?token=" + token, emailData)
    .catch((error) => {
      console.error(error);
    });
  if (response) {
    if (response.data.response !== "Mã thay đổi không hợp lệ") {
      return redirect("/login");
    } else {
      return response.data.response;
    }
  } else {
    return "Đang có lỗi bên phia máy chủ";
  }
}
