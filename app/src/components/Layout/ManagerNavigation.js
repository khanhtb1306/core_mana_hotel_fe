import React, { useState } from "react";
import { Form, Link, NavLink } from "react-router-dom";
import ButtonHeader from "../UI/ButtonHeader";
import { useLocation } from "react-router-dom";
import logo from "../../assets/images/logohotel.png";
import user from "../../assets/images/user.jpeg";

function ManagerNavigation() {
  const [showAction, setShowAction] = useState(false);
  const location = useLocation();
  return (
    <nav className="px-5 bg-blue-500">
      <ul className="flex">
        <div className="my-auto mr-5">
          <img src={logo} alt="Logo" className="w-10" />
        </div>
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
        <div
          className={`${
            location.pathname === "/manager/policy"
              ? "bg-blue-800"
              : "hover:bg-blue-800"
          }`}
        >
          <li className="pt-4">
            <NavLink to="/manager/policy" className="text-white p-4">
              <i className="fa-solid fa-file-shield pr-2"></i>
              Chính sách
            </NavLink>
          </li>
        </div>
        <div className="ml-auto my-auto flex">
          <p className="w-10 my-auto">Tien</p>
          <img src={user} className="w-10 mr-5 h-10" />
          <div
            className="ml-auto relative"
            onMouseMove={() => setShowAction(true)}
            onMouseOut={() => setShowAction(false)}
          >
            <button className="text-white py-2 px-4 rounded hover:bg-blue-700">
              <i className="fa-solid fa-bars"></i>
            </button>
            {showAction ? (
              <>
                <div className="absolute right-0 bg-white ml-auto w-40 py-3 z-10">
                  <div className="py-2 px-4 hover:bg-gray-200">
                    <Link to="/account">
                      <i className="fa-solid fa-circle-user pr-4"></i>
                      Tài khoản
                    </Link>
                    <br />
                  </div>
                  <div className="py-2 px-4 hover:bg-gray-200 flex">
                    <Form action="/logout" method="post">
                      <button>
                        <i className="fa-solid fa-right-from-bracket pr-4 my-auto"></i>
                        Logout
                      </button>
                    </Form>
                    <br />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </ul>
    </nav>
  );
}

export default ManagerNavigation;
