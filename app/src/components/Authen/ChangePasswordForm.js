import { Form, useActionData, useNavigation } from "react-router-dom";
import logo from "../../assets/images/logohotel.png";
import background from "../../assets/images/background-login.jpg";
import { json, redirect } from "react-router-dom";
import { axiosConfig } from "../../utils/axiosConfig";
function ChangePasswordForm(staff) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <Form method="put" className="bg-white "  >
          <div className="flex flex-row ">
            <div className="basis-3/4 me-8">
              <input name="staffId" hidden readOnly
                defaultValue={staff.staff.staffId}
              />
              <div className="mb-4 flex flex-row">
                <h2
                  className="basis-2/5 text-gray-400 text-sm font-bold mb-2"
                  htmlFor="oldPassword"
                >
                  Mật khẩu cũ
                </h2>
                <input
                  className="basis-3/5 shadow appearance-none border rounded  py-2  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  required
                />
              </div>
              <div className="mb-4 flex flex-row">
                <h2
                  className="basis-2/5 text-gray-400 text-sm font-bold mb-2"
                  htmlFor="newPassword"
                >
                  Mật khẩu mới
                </h2>
                <input
                  className="basis-3/5 shadow appearance-none border rounded  py-2  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                />
              </div>
              <div className="mb-4 flex flex-row">
                <h2
                  className="basis-2/5 text-gray-400 text-sm font-bold mb-2"
                  htmlFor="confirm-password"
                >
                  Xác nhận mật khẩu
                </h2>
                <input
                  className="basis-3/5 shadow appearance-none border rounded  py-2  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                />
              </div>
            </div>
            <div className="basis-1/4">
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isSubmitting}
                  type="submit"
                >

                  {isSubmitting ? "Đang kiểm tra" : "Thay đổi mật khẩu"}
                </button>
              </div>
            </div>
          </div>
        </Form>
  );
}

export default ChangePasswordForm;