import React, { useState } from "react";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";

const MobileDrawer = ({ navItems, logoutComponent }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => () => setIsOpen(open);

  return (
    <>
      {/* TRIGGER BUTTON */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <IconButton 
          onClick={toggleDrawer(true)}
          sx={{ 
            bgcolor: '#24324D', 
            color: 'white', 
            boxShadow: 3,
            '&:hover': { bgcolor: '#3d4a66' } 
          }}
        >
          <MenuIcon />
        </IconButton>
      </div>

      {/* DRAWER MENU */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: 260, // Slightly wider to accommodate icons + text comfortably
            bgcolor: '#24324D', 
            border: 'none',
            backgroundImage: 'none' // Removes MUI default elevation overlay
          },
        }}
      >
        <div className="h-full flex flex-col font-inter overflow-hidden">
          
          {/* Logo Area */}
          <div className="p-6 shrink-0">
            <div className="w-full h-[80px] flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="max-h-full" />
            </div>
          </div>

          {/* Nav Area */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={toggleDrawer(false)}
                end={item.path === "/superadmin-dashboard"}
                className={({ isActive }) =>
                  `h-12 flex items-center gap-4 text-white font-bold tracking-wide rounded-lg px-4 transition
                  ${isActive ? "bg-[#3d4a66] shadow-md" : "hover:bg-[#3d4a66]/50"}`
                }
              >
                {/* Render the MUI Icon passed from parent */}
                <span className="flex items-center justify-center opacity-90">
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout Area */}
          <div className="p-6 mt-auto border-t border-white/10 shrink-0 bg-[#24324D]">
            <div className="flex justify-center w-full">
              {logoutComponent}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MobileDrawer;