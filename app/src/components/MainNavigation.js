import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logohotel.png";
import ButtonHeader from "./UI/ButtonHeader";

function MainNavigation() {
  return (
    <>
      <div className="pl-20 bg-white p-1">
        <img src={logo} alt="Logo" className="w-10" />
      </div>
      <nav className="pl-20 bg-blue-500">
        <ul className="flex">
          <li className="text-white p-4 hover:bg-blue-800">
            <Link to="/overview" className="">
              <i className="fa-solid fa-eye pr-3"></i>
              Tổng quan
            </Link>
          </li>
          <li className="text-white p-4 hover:bg-blue-800">
            <Link to="/categoryRoomManagement">
              <i className="fa-solid fa-table pr-3"></i>
              Phòng
            </Link>
          </li>
          <ButtonHeader name="Hàng hoá" icon="fa-solid fa-box" list={[{name: "Danh mục", icon: "fa-solid fa-table-cells"}, {name: "Kiểm kho", icon: "fa-solid fa-warehouse"}]} />
          <ButtonHeader name="Đối tác" icon="fa-solid fa-user-tie" list={[{name: "Khách hàng", icon: "fa-solid fa-user"}, {name: "Nhà cung cấp", icon: "fa-solid fa-users"}]} />
          <li className="text-white p-4 hover:bg-blue-800">
            <Link to="/">
              <i className="fa-solid fa-users pr-3"></i>
              Nhân viên
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default MainNavigation;
