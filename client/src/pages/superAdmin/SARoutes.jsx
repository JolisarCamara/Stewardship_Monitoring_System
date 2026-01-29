import { Outlet } from "react-router-dom";
import SideBar_superAdmin from "../../components/sideNavSuperAdmin";

const SARoutes = () => {
  return (
    <SideBar_superAdmin>
      <Outlet />
    </SideBar_superAdmin>
  );
};

export default SARoutes;
