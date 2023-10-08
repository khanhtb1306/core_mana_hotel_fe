import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logohotel.png";
import ButtonHeader from "./UI/ButtonHeader";
import { useLocation } from "react-router-dom";

function MainNavigation() {
  const location = useLocation();
  return (
    <>
      <div className="pl-20 bg-white p-1">
        <img src={logo} alt="Logo" className="w-10" />
      </div>
      <nav className="pl-20 bg-blue-500">
        <ul className="flex">
          <div
            className={`${
              location.pathname === "/overview"
                ? "bg-blue-800"
                : "hover:bg-blue-800"
            }`}
          >
            <li className="text-white p-4">
              <Link to="/overview" className="">
                <i className="fa-solid fa-eye pr-3"></i>
                Tổng quan
              </Link>
            </li>
          </div>
          <div
            className={`${
              location.pathname === "/categoryRoomManagement" ||
              location.pathname === "/roomManagement"
                ? "bg-blue-800"
                : "hover:bg-blue-800"
            }`}
          >
            <li className="text-white p-4">
              <Link to="/categoryRoomManagement">
                <i className="fa-solid fa-table pr-3"></i>
                Phòng
              </Link>
            </li>
          </div>
          <ButtonHeader
            name="Hàng hoá"
            icon="fa-solid fa-box"
            isActive={
              location.pathname === "/productManagement" ||
              location.pathname === "/stocktakeManagement"
            }
            list={[
              {
                name: "Danh mục",
                icon: "fa-solid fa-table-cells",
                link: "/productManagement",
                isActive: location.pathname === "/productManagement",
              },
              {
                name: "Kiểm kho",
                icon: "fa-solid fa-warehouse",
                link: "/stocktakeManagement",
                isActive: location.pathname === "/stocktakeManagement",
              },
            ]}
          />
          <ButtonHeader
            name="Đối tác"
            icon="fa-solid fa-user-tie"
            isActive={
              location.pathname === "/customers" ||
              location.pathname === "/suppliers"
            }
            list={[
              {
                name: "Khách hàng",
                icon: "fa-solid fa-user",
                link: "/customers",
                isActive: location.pathname === "/customers",
              },
              {
                name: "Nhà cung cấp",
                icon: "fa-solid fa-users",
                link: "/suppliers",
                isActive: location.pathname === "/suppliers",
              },
            ]}
          />
        </ul>
      </nav>
    </>
  );
}

export default MainNavigation;
