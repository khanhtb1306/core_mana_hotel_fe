import { NavLink } from "react-router-dom";

function RoomNavigation(props) {
  return (
    <nav>
      <ul className="flex mt-5">
        {props.isActive ? (
          <>
            <li className="bg-blue-500 text-white px-4 py-2 rounded-t mr-2">
              <NavLink to="/manager/categoryRoomManagement">Hạng phòng</NavLink>
            </li>
            <li className="bg-gray-300 px-4 py-2 rounded-t">
              <NavLink to="/manager/roomManagement">Danh sách phòng</NavLink>
            </li>
          </>
        ) : (
          <>
            <li className="bg-gray-300 px-4 py-2 rounded-t mr-2">
              <NavLink to="/manager/categoryRoomManagement">Hạng phòng</NavLink>
            </li>
            <li className="bg-blue-500 text-white px-4 py-2 rounded-t">
              <NavLink to="/manager/roomManagement">Danh sách phòng</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default RoomNavigation;
