import React, { useState } from "react";
import { Form, Link, NavLink } from "react-router-dom";
import ButtonHeader from "../UI/ButtonHeader";
import { useLocation } from "react-router-dom";
import logo from "../../assets/images/logohotel.png";
import user from "../../assets/images/user.jpeg";
import { jwtDecode } from "jwt-decode";

function ReceptionistNavigation() {
  const [showAction, setShowAction] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  return (
    <nav className="pl-5 h-12 bg-green-500 print:hidden">
      <ul className="flex">
        <div className="my-auto mr-5">
          <img src={logo} alt="Logo" className="w-10" />
        </div>
        <div>
          <li className="py-3 px-2">
            <Link
              to="/listReservation"
              className={`rounded-2xl bg-green-500 py-2 px-4 ${
                location.pathname === "/" ||
                location.pathname === "/listReservation" ||
                location.pathname === "/listRoom"
                  ? "text-green-500 bg-white"
                  : "text-white hover:bg-white hover:text-green-500"
              }`}
            >
              <i className="fa-solid fa-calendar-days pr-2"></i>
              Lịch đặt phòng
            </Link>
          </li>
        </div>
        <div>
          <li className="py-3 px-2">
            <Link
              to="/addReservation"
              className={`rounded-2xl bg-green-500 py-2 px-4 ${
                location.pathname === "/addReservation"
                  ? "text-green-500 bg-white"
                  : "text-white hover:bg-white hover:text-green-500"
              }`}
            >
              <i className="fa-solid fa-circle-plus pr-2"></i>
              Đặt phòng mới
            </Link>
          </li>
        </div>
        <div>
          <li className="py-3 px-2">
            <Link
              to="/addInvoice"
              className={`rounded-2xl bg-green-500 py-2 px-4 ${
                location.pathname === "/addInvoice"
                  ? "text-green-500 bg-white"
                  : "text-white hover:bg-white hover:text-green-500"
              }`}
            >
              <i className="fa-solid fa-file-circle-plus pr-2"></i>
              Hoá đơn bán lẻ
            </Link>
          </li>
        </div>
        <div className="ml-auto my-auto mr-5 flex">
          <p className="w-10 my-auto mr-5 text-white">Tien</p>
          {/* <img src={user} className="w-10 mr-5 h-10" /> */}
          <div
            className="ml-auto relative"
            onMouseMove={() => setShowAction(true)}
            onMouseOut={() => setShowAction(false)}
          >
            <button className="text-white py-2 px-4 rounded hover:bg-white hover:text-green-700">
              <i className="fa-solid fa-bars"></i>
            </button>
            {showAction ? (
              <>
                <div className="absolute right-0 bg-white ml-auto w-40 py-3 z-10">
                  {decodedToken.role === "ROLE_MANAGER" && (
                    <NavLink to="/manager">
                      <div className="flex hover:bg-gray-200">
                        <div className="py-2 px-4 mx-auto">
                          <i className="fa-solid fa-user-tie mr-4"></i>
                          Quản lý
                        </div>
                      </div>
                    </NavLink>
                  )}
                  <NavLink to="/account">
                    <div className="flex hover:bg-gray-200">
                      <div className="py-2 px-4 mx-auto">
                        <i className="fa-solid fa-circle-user pr-4"></i>
                        Tài khoản
                      </div>
                    </div>
                  </NavLink>
                  <Form action="/logout" method="post">
                    <button className="w-40 py-2 hover:bg-gray-200">
                      <i className="fa-solid fa-right-from-bracket pr-4"></i>
                      Logout
                    </button>
                  </Form>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </ul>
    </nav>
  );
}

export default ReceptionistNavigation;
