import React from "react";
import { Link } from "react-router-dom";
import ButtonHeader from "../UI/ButtonHeader";
import { useLocation } from "react-router-dom";

function ManagerNavigation() {
  const location = useLocation();
  return (
    <nav className="pl-20 bg-blue-500">
      <ul className="flex">
        <div
          className={`${
            location.pathname === "/manager/overview" ||
             location.pathname === "/manager"
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
        <ButtonHeader
          name="Đối tác"
          icon="fa-solid fa-user-tie"
          isActive={
            location.pathname === "/manager/customerManagement" ||
            location.pathname === "/manager/supplierManagement"
          }
          list={[
            {
              name: "Khách hàng",
              icon: "fa-solid fa-user",
              link: "/manager/customerManagement",
              isActive: location.pathname === "/manager/customerManagement",
            },
            {
              name: "Nhà cung cấp",
              icon: "fa-solid fa-users",
              link: "/manager/supplierManagement",
              isActive: location.pathname === "/manager/supplierManagement",
            },
          ]}
        />
      </ul>
    </nav>
  );
}

export default ManagerNavigation;
