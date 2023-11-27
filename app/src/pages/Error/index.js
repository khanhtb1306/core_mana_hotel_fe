import { Link, NavLink } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="pt-10">
      <div className="flex">
        <h1 className="mx-auto">Thông báo có lỗi xuất hiện!</h1>
      </div>
      <div className="flex mt-10">
        <div className="mx-auto">
          <NavLink
            to="/login"
            className="rounded bg-green-500 text-white px-4 py-2"
          >
            Go Login Page
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
