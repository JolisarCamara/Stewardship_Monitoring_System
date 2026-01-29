import React from "react";
import LogoutButton from "../../components/LogoutButton";
import SettingsIcon from '@mui/icons-material/Settings';


const AdminPage = () =>{
    return (
    <div>
     <h1 className="text-4xl md:text-4xl font-bold text-[#3D5A80] mb-6">ADMIN ACCOUNTS</h1>

      <div className="flex items-center gap-2 mb-4">
        <p className="text-l text-gray-600">MANAGE ADMIN ACCOUNTS</p>
        <SettingsIcon className="w-4 h-4 text-gray-400" />

        
      </div>

    </div>
    );
}

export default AdminPage;
