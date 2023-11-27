import { Outlet } from "react-router-dom";
import ReservationNavigation from "../../components/Layout/ReservaionNavigation";

function ReservationLayout(props) {
  return (
    <>
      <ReservationNavigation isActive={props.isActive} />
      <Outlet />
    </>
  );
}

export default ReservationLayout;