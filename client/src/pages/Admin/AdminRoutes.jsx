import { Outlet } from "react-router-dom";
import SideBar_Admin from "../../components/sideNavAdmin";

const AdminRoutes = ({ setUser}) => {
  return (
    <SideBar_Admin setUser={setUser}>
      <Outlet />
    </SideBar_Admin>
  );
};

export default AdminRoutes;