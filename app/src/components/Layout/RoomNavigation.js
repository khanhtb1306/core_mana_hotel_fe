import { NavLink } from "react-router-dom";

function RoomNavigation(props) {
  return (
    <nav>
      <ul className="flex mt-5">
        {props.isActive ? (
          <>
            <li className="mb-2 mr-2">
              <NavLink
                className="bg-blue-500 text-white px-4 py-3 rounded-t"
                to="/manager/categoryRoomManagement"
              >
                Hạng phòng
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                className="bg-gray-300 px-4 py-3 rounded-t"
                to="/manager/roomManagement"
              >
                Danh sách phòng
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li className="mb-2 mr-2">
              <NavLink
                className="bg-gray-300 px-4 py-3 rounded-t"
                to="/manager/categoryRoomManagement"
              >
                Hạng phòng
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                className="bg-blue-500 text-white px-4 py-3 rounded-t"
                to="/manager/roomManagement"
              >
                Danh sách phòng
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default RoomNavigation;
