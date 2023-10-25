import { Form, Link, useActionData, useNavigate, useNavigation } from "react-router-dom";
import logo from "../../assets/images/logohotel.png";
import background from "../../assets/images/background-login.jpg";

function ResetPasswordForm() {
  let data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
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
            Thay đổi mật khẩu
          </h2>
          <Form method="post" className="bg-white px-8 pt-6 pb-8 mb-4">
            {data && <div className="text-center mb-5"><p className="text-red-500 text-base italic">{data}</p></div>}
            <div className="mb-4">
              <label
                className="block text-gray-400 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-400 text-sm font-bold mb-2"
                htmlFor="confirm-password"
              >
                Xác nhận mật khẩu
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang kiểm tra" : "Thay đổi mật khẩu"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default ResetPasswordForm;