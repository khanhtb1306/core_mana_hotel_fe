import React from "react";
import { Link } from "react-router-dom";
import ButtonHeader from "../UI/ButtonHeader";
import { useLocation } from "react-router-dom";

function ReceptionistNavigation() {
  const location = useLocation();

  return (
    <nav className="pl-20 h-12 bg-green-500">
      <ul className="flex">
        <div>
          <li className="py-3 px-2">
            <Link
              to="/reservation"
              className={`rounded-2xl bg-green-500 py-2 px-4 ${
                location.pathname === "/" || 
                location.pathname === "/reservation"
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
      </ul>
    </nav>
  );
}

export default ReceptionistNavigation;
