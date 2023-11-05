import React from "react";
import { Link, NavLink } from "react-router-dom";
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
          <li className="pt-4">
            <NavLink to="/manager/overview" className="text-white p-4">
              <i className="fa-solid fa-eye pr-3"></i>
              Tổng quan
            </NavLink>
          </li>
        </div>
        <ButtonHeader
          name="Phòng"
          icon="fa-solid fa-table"
          isActive={
            location.pathname === "/manager/categoryRoomManagement" ||
            location.pathname === "/manager/priceBook"
          }
          list={[
            {
              name: "Hạng phòng & Phòng",
              icon: "fa-solid fa-bed",
              link: "/manager/categoryRoomManagement",
              isActive: location.pathname === "/manager/categoryRoomManagement",
            },
            {
              name: "Thiết lập giá",
              icon: "fa-solid fa-tags",
              link: "/manager/priceBook",
              isActive: location.pathname === "/manager/priceBook",
            },
          ]}
        />
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
