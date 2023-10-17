import { Outlet } from "react-router-dom";
import ManagerNavigation from "../../components/Layout/ManagerNavigation";

function ManagerLayout() {
  return (
    <>
      <ManagerNavigation />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default ManagerLayout;