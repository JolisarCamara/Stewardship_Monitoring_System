import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar_superAdmin from "../../components/sideNavSuperAdmin";

const SuperAdminDashboard = () => {

  
  return (
    <SideBar_superAdmin>
      <div className="ml-[260px] flex-1 p-8">
        <Outlet />

        {/* Stats, cards, lists go here */}
      </div>
    </SideBar_superAdmin>
  );
}

export default SuperAdminDashboard;
