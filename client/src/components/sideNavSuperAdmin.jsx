import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import MobileDrawer from "../components/ui/mobileDrawer"; // Import the new file

const SideBar_superAdmin = ({ children, setUser }) => {
  const navItems = [
    { label: "DASHBOARD", path: "/superadmin-dashboard" },
    { label: "SUPER ADMIN", path: "/superadmin-dashboard/super-admins" },
    { label: "ADMINS", path: "/superadmin-dashboard/admins" },
    { label: "SCHOLARS", path: "/superadmin-dashboard/scholars" },
    { label: "RULES", path: "/superadmin-dashboard/rules" },
    { label: "ACTIVITY LOGS", path: "/superadmin-dashboard/activity-logs" },
  ];

  return (
    <div className="flex min-h-screen bg-[#e6e6e6]">
      {/* MOBILE VERSION */}
      <MobileDrawer 
        navItems={navItems} 
        logoutComponent={<LogoutButton setUser={setUser} />} 
      />

      {/* DESKTOP VERSION (Hidden on mobile) */}
      <aside className="hidden md:flex w-[200px] h-screen bg-[#24324D] fixed left-0 top-0 flex flex-col font-inter">
        <div className="p-6">
          <div className="w-full h-[100px] flex items-center justify-center">
            <img src="/logo.png" alt="Logo" />
          </div>
        </div>

        <nav className="flex flex-col px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
        
        <div className="mt-auto p-4 flex justify-center border-t border-white/10">
          <LogoutButton setUser={setUser} />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 md:ml-[200px]">
        {/* Adds space at the top on mobile so the burger icon doesn't overlap text */}
        <div className="mt-12 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SideBar_superAdmin;