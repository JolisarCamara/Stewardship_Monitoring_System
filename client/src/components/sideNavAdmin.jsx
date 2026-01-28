import React from "react";
import { NavLink } from 'react-router-dom';

const SideBar_Admin = ({user, setUser}) =>{
     return (
    <div className="bg-[#e6e6e6] min-h-screen flex"> 
      {/* SIDEBAR */}
      <div className="w-[260px] h-screen bg-navy-dark flex flex-col fixed left-0 top-0 font-inter">
        <div className="p-6">
          <div className="w-full h-[178px] bg-navy-dark rounded-lg flex items-center justify-center mb-8">
            <img src="/logo.png" alt="Logo" />
        </div>
            </div>

        </div>
    </div>
 );
}

export default SideBar_Admin;