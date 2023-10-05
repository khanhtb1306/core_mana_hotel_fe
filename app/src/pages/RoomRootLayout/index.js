import { Outlet } from "react-router-dom";
import RoomNavigation from "../../components/RoomNavigation";

function RoomRootLayout(props) {
  return (
    <>
      <RoomNavigation isActive={props.isActive} />
      <Outlet />
    </>
  );
}

export default RoomRootLayout;
