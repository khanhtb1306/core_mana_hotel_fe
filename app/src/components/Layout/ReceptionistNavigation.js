import React from "react";
import { Link } from "react-router-dom";
import ButtonHeader from "../UI/ButtonHeader";
import { useLocation } from "react-router-dom";

function ReceptionistNavigation() {
  const location = useLocation();
  return (
    <nav className="pl-20 bg-blue-500">
      <ul className="flex">
        <div
          className={`${
            location.pathname === "/manager/overview"
              ? "bg-blue-800"
              : "hover:bg-blue-800"
          }`}
        >
          <li className="text-white p-4">
            <Link to="/manager/overview" className="">
              <i className="fa-solid fa-eye pr-3"></i>
              Tổng quan
            </Link>
          </li>
        </div>
        <div
          className={`${
            location.pathname === "/manager/categoryRoomManagement" ||
            location.pathname === "/manager/roomManagement"
              ? "bg-blue-800"
              : "hover:bg-blue-800"
          }`}
        >
          <li className="text-white p-4">
            <Link to="/manager/categoryRoomManagement">
              <i className="fa-solid fa-table pr-3"></i>
              Phòng
            </Link>
          </li>
        </div>
        <ButtonHeader
          name="Danh mục"
          icon="fa-solid fa-box"
          isActive={
            location.pathname === "/manager/productManagement" ||
            location.pathname === "/manager/stocktakeManagement"
          }
          list={[
            {
              name: "Hàng hoá",
              icon: "fa-solid fa-table-cells",
              link: "/manager/productManagement",
              isActive: location.pathname === "/manager/productManagement",
            },
            {
              name: "Kiểm kho",
              icon: "fa-solid fa-warehouse",
              link: "/manager/stocktakeManagement",
              isActive: location.pathname === "/manager/stocktakeManagement",
            },
          ]}
        />
      </ul>
    </nav>
  );
}

export default ReceptionistNavigation;