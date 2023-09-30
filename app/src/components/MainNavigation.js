import { Link } from "react-router-dom";
import logo from "../assets/images/logohotel.png";

function MainNavigation() {
  return (
    <>
      <div className="pl-20 bg-white p-1">
        <img src={logo} alt="Logo" className="w-10" />
      </div>
      <nav className="pl-20 bg-blue-500 p-3.5">
        <ul className="flex">
          <li>
            <Link to="/overview" className="text-white p-4 hover:bg-blue-800">
              <i className="fa-solid fa-eye pr-3"></i>
              Tổng quan
            </Link>
          </li>
          <li>
            <Link to="/categoryRoomManagement" className="text-white p-4 hover:bg-blue-800">
              <i className="fa-solid fa-table pr-3"></i>
              Phòng
            </Link>
          </li>
          <li>
            <Link to="/" className="text-white p-4 hover:bg-blue-800">
              <i className="fa-solid fa-box pr-3"></i>
              Hàng hoá
            </Link>
          </li>
          <li>
            <Link to="/" className="text-white p-4 hover:bg-blue-800">
              <i className="fa-solid fa-user pr-3"></i>
              Khách hàng
            </Link>
          </li>
          <li>
            <Link to="/" className="text-white p-4 hover:bg-blue-800">
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
