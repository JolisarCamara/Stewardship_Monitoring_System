import React from "react";
import TotalAccounts from "../../components/ui/totalAccounts";
import SettingsIcon from "@mui/icons-material/Settings"; 


const DashboardPage = () =>{
    return (
    <div>
         <h1 className="text-2xl md:text-3xl font-bold text-[#3D5A80] mb-6">SUPER ADMIN DASHBOARD</h1>
         <div className="flex items-center gap-2 mb-4">
                 <p className="text-gray-600">MANAGE ACCOUNTS</p>
                 <SettingsIcon className="text-gray-400" />
               </div>
         <TotalAccounts/>
    </div>
    );
}

export default DashboardPage;
