import { Outlet } from "react-router-dom";
import ReceptionistNavigation from "../../components/Layout/ReceptionistNavigation";

function ReceptionistLayout() {
  return (
    <>
      <ReceptionistNavigation />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default ReceptionistLayout;