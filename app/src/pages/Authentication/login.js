import { json, redirect } from "react-router-dom";
import LoginForm from "../../components/LoginForm";
import { axiosConfig } from "../../utils/axiosConfig";

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
    console.log(response);
  if (response) {
    if (response.data.response !== 'Username or password is wrong') {
      const token = response.data.token;
      localStorage.setItem("token", token);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      localStorage.setItem("expiration", expiration.toISOString());
      // axiosPrivate.interceptors.request.use(
      //   (config) => {
      //     if (token) {
      //       config.headers.Authorization = `Bearer ${token}`;
      //     }
      //     return config;
      //   },
      //   (error) => {
      //     return Promise.reject(error);
      //   }
      // );
      return redirect("/manager");
    } else {
      return response.data.response;
    }
  } else {
    return "Your email or password is wrong!";
  }
}
