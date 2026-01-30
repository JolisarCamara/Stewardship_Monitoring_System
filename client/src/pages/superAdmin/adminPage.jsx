import React, { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import SearchInput from '../../components/ui/SearchInput';
import AccountListItem from "../../components/ui/AdminAccountListItem";


const AdminPage = () =>{
    return (
    <div>
     <h1 className="text-4xl md:text-4xl font-bold text-[#3D5A80] mb-6">ADMIN ACCOUNTS</h1>

      <div className="flex items-center gap-2 mb-4">
        <p className="text-l text-gray-600">MANAGE ADMIN ACCOUNTS</p>
        <SettingsIcon className="w-4 h-4 text-gray-400" />
      </div>

    <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchInput/>
            </div>
          </div>
           <h2 className="text-lg font-bold text-gray-800 mb-4">ADMIN ACCOUNTS</h2>
           <AccountListItem/>
      </div>
    );
}

export default AdminPage;
