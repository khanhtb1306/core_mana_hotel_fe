import { json, redirect } from "react-router-dom";
import { axiosConfig } from "../../utils/axiosConfig";
import ForgetPasswordForm from "../../components/Authen/ForgetPasswordForm";

function ForgetPasswordPage() {
  return <ForgetPasswordForm />;
}

export default ForgetPasswordPage;

export async function action({ request }) {
  const data = await request.formData();
  console.log(data);
  const emailData = {
    email: data.get("email"),
  };

  const response = await axiosConfig
    .post("auth/password-reset-request", emailData)
    .catch((error) => {
      console.error(error);
    });
  console.log(response);
  if (response) {
    if (response.data !== "Không tìm thấy email!") {
      const token = response.data;
      localStorage.setItem("token", token);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      localStorage.setItem("expiration", expiration.toISOString());
      return {
        isSuccess: true,
        data: "Kiểm tra email của bạn để tìm kiếm link đặt lại mật khẩu. Nếu nó không xuất hiện trong vòng vài phút, hãy kiểm tra thư mục thư rác của bạn.",
      };
    } else {
      return {
        isSuccess: false,
        data: response.data
      };
    }
  } else {
    return {
      isSuccess: false,
      data: "Đang có lỗi bên phia máy chủ",
    };
  }
}
