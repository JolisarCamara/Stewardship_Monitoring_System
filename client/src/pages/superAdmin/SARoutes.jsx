import { Outlet } from "react-router-dom";
import SideBar_superAdmin from "../../components/sideNavSuperAdmin";

const SARoutes = ({ setUser}) => {
  return (
    <SideBar_superAdmin setUser={setUser}>
      <Outlet />
    </SideBar_superAdmin>
  );
};

export default SARoutes;
