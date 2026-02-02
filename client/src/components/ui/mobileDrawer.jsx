import React, { useState } from "react";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";

const MobileDrawer = ({ navItems, logoutComponent }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => () => setIsOpen(open);

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <IconButton 
          onClick={toggleDrawer(true)}
          sx={{ bgcolor: '#24324D', color: 'white', '&:hover': { bgcolor: '#3d4a66' } }}
        >
          <MenuIcon />
        </IconButton>
      </div>

      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 200, bgcolor: '#24324D', border: 'none' },
        }}
      >
        {/* Full height flex container */}
        <div className="h-full flex flex-col font-inter overflow-hidden">
          
          {/* Logo Area (Fixed top) */}
          <div className="p-6 shrink-0">
            <div className="w-full h-[100px] flex items-center justify-center">
              <img src="/logo.png" alt="Logo" />
            </div>
          </div>

          {/* Nav Area (This scrolls if content is too long) */}
          <nav className="flex-1 overflow-y-auto px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={toggleDrawer(false)}
                end={item.path === "/superadmin-dashboard"}
                className={({ isActive }) =>
                  `h-12 flex items-center text-white font-bold tracking-wide rounded-lg px-4 transition
                  ${isActive ? "bg-[#3d4a66]" : "hover:bg-[#3d4a66]"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Logout Area (Fixed bottom) */}
          <div className="p-4 mt-auto border-t border-white/10 shrink-0 bg-[#24324D]">
            {logoutComponent}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MobileDrawer;