import { Form, Link } from "react-router-dom";
import logo from "../assets/images/logohotel.png";
import background from "../assets/images/background-login.jpg";

function LoginForm() {
  return (
    <>
      <div
        style={{ backgroundImage: `url(${background})` }}
        className="w-screen h-screen blur-lg"
      ></div>
      <div className="absolute w-10/12 h-4/5 bg-white m-auto left-0 right-0 top-0 bottom-0 flex">
        <div
          style={{ backgroundImage: `url(${background})` }}
          className="w-6/12 h-full"
        ></div>
        <div className="flex-auto p-10">
          <img src={logo} alt="Logo" className="w-20 m-auto " />
          <h2 className="text-center text-gray-500 text-2xl font-mono p-10">
            Welcome to ManaHotel
          </h2>
          <Form method="post" class="bg-white px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
              <label
                class="block text-gray-400 text-sm font-bold mb-2"
                for="username"
              >
                Username or email
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
              />
            </div>
            <div class="mb-6">
              <label
                class="block text-gray-400 text-sm font-bold mb-2"
                for="password"
              >
                Password
              </label>
              <input
                class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
              />
              <p class="text-red-500 text-xs italic">
                Please choose a password.
              </p>
            </div>
            <div class="flex items-center justify-between">
              <Link
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                to="/"
              >
                Sign In
              </Link>
              <Link
                class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                to="/"
              >
                Forgot Password?
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
