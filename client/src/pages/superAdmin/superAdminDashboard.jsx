import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar_superAdmin from "../../components/sideNavSuperAdmin";

const SuperAdminDashboard = () => {

  
  return (
    <SideBar_superAdmin>
       <div className="ml-[260px] flex-1 p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#3D5A80] mb-6">
          SUPER ADMIN DASHBOARD
        </h1>
        <Outlet />
      </div>
        
    </SideBar_superAdmin>
  );
}

export default SuperAdminDashboard;
