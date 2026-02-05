import { Outlet } from "react-router-dom";
import SideBar_Scholar from "../../components/sideNavScholar";

const ScholarRoutes = ({ setUser}) => {
  return (
    <SideBar_Scholar setUser={setUser}>
      <Outlet />
    </SideBar_Scholar>
  );
};

export default ScholarRoutes;
