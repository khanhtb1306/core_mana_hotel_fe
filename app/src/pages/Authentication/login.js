import { json, redirect } from "react-router-dom";
import LoginForm from "../../components/Authen/LoginForm";
import { axiosConfig } from "../../utils/axiosConfig";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  return <LoginForm />;
}

export default LoginPage;

export async function action({ request }) {
  const data = await request.formData();
  const authData = {
    username: data.get("username"),
    password: data.get("password"),
  };

  const response = await axiosConfig
    .post("auth/login", authData)
    .catch((error) => {
      console.error(error);
    });
  if (response) {
    if (response.data.response !== "Tên người dùng hoặc mật khẩu sai") {
      const token = response.data.response;
      localStorage.setItem("token", token);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 24);
      localStorage.setItem("expiration", expiration.toISOString());
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === "ROLE_MANAGER") {
        return redirect("/manager");
      } else {
        return redirect("/");
      }
    } else {
      return response.data.response;
    }
  } else {
    return "Đang có lỗi bên phia máy chủ";
  }
}
