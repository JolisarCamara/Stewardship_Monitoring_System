import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";
 
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
      <aside className="w-[200px] h-screen bg-navy-dark fixed left-0 top-0 flex flex-col font-inter">
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
      </aside>

      <main className="ml-[200px] flex-1 p-10">
        {children}
      </main>
          <LogoutButton setUser={setUser}/>
    </div>
  );
};

export default SideBar_superAdmin;