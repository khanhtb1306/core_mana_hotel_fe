import React, { useState } from "react";
import { Form, Link, NavLink } from "react-router-dom";
import ButtonHeader from "../UI/ButtonHeader";
import { useLocation } from "react-router-dom";
import logo from "../../assets/images/logohotel.png";
import user from "../../assets/images/user.jpeg";
import { jwtDecode } from "jwt-decode";

function ManagerNavigation() {
  const [showAction, setShowAction] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  // console.log(decodedToken);
  return (
    <nav className="px-5 bg-blue-500 h-10">
      <ul className="flex h-10">
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
          <li className="pt-2">
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
          name="Giao dịch"
          icon="fa-solid fa-box"
          isActive={
            location.pathname === "/manager/transactionManagement" ||
            location.pathname === "/manager/stocktakeManagement"
          }
          list={[
            {
              name: "Hóa đơn",
              icon: "fas fa-money-check pr-3",
              link: "/manager/transactionManagement",
              isActive: location.pathname === "/manager/productManagement",
            },
            {
              name: "Nhập hàng",
              icon: "fa-solid fa-warehouse",
              link: "/manager/importManagement",
              isActive: location.pathname === "/manager/stocktakeManagement",
            },
          ]}

        />

        <div
          className={`${location.pathname === "/manager/fundBookManagement"
              ? "bg-blue-800"
              : "hover:bg-blue-800"
            }`}
        >
          <li className="pt-2">
            <NavLink to="/manager/fundBookManagement" className="text-white p-4">
              <i className="fas fa-money-check pr-3"></i>
              Sổ quỹ
            </NavLink>
          </li>
        </div>
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
            location.pathname === "/manager/staffManagement" 
              ? "bg-blue-800"
              : "hover:bg-blue-800"
          }`}
        >
          <li className="pt-2">
            <NavLink to="/manager/staffManagement" className="text-white p-4">
              <i className="fa-solid fa-user-group pr-3"></i>
              Nhân viên
            </NavLink>
          </li>
        </div>

        <div
          className={`${
            location.pathname === "/manager/policy"
              ? "bg-blue-800"
              : "hover:bg-blue-800"
          }`}
        >
          <li className="pt-2">
            <NavLink to="/manager/policy" className="text-white p-4">
              <i className="fa-solid fa-file-shield pr-2"></i>
              Chính sách
            </NavLink>
          </li>
        </div>
        <div className="ml-auto my-auto flex">
          <p className="w-10 my-auto mr-5 text-white">{decodedToken.sub}</p>
          {/* <img src={user} className="w-10 mr-5 h-10" /> */}
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
                  <NavLink to="/">
                    <div className="flex hover:bg-gray-200">
                      <div className="py-2 px-4 mx-auto">
                        <i className="fa-solid fa-spa mr-4"></i>
                        Lễ tân
                      </div>
                    </div>
                  </NavLink>
                  <NavLink to="/manager/inforManagement"  >
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

export default ManagerNavigation;
