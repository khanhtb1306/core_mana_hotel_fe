import { NavLink } from "react-router-dom";

function ReservationNavigation(props) {
  return (
    <nav>
      <ul className="flex mt-5">
        {props.isActive ? (
          <>
            <li className="bg-green-500 text-white px-4 py-2 rounded-t">
              <NavLink to="/listReservation">
                Danh sách đặt phòng
              </NavLink>
            </li>
            <li className="bg-white px-4 py-2 rounded-t">
              <NavLink to="/listRoom">Danh sách phòng</NavLink>
            </li>
          </>
        ) : (
          <>
            <li className="bg-white px-4 py-2 rounded-t">
              <NavLink to="/listReservation">
                Danh sách đặt phòng
              </NavLink>
            </li>
            <li className="bg-green-500 text-white px-4 py-2 rounded-t">
              <NavLink to="/listRoom">Danh sách phòng</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default ReservationNavigation;
