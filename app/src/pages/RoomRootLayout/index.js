import { Outlet } from "react-router-dom";
import RoomNavigation from "../../components/RoomNavigation";

function RoomRootLayout() {
  return (
    <>
      <RoomNavigation />
      <Outlet />
    </>
  );
}

export default RoomRootLayout;
