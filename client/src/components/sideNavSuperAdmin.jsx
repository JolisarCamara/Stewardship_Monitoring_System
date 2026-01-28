import { Link, useLocation } from "react-router-dom";

export default function SideBar_superAdmin() {
  const navItems = [
    { label: "DASHBOARD", path: "/superadmin-dashboard" },
    { label: "ADMINS", path: "/superadmin-dashboard/admins" },
    { label: "SCHOLARS", path: "/superadmin-dashboard/scholars" },
    { label: "RULES", path: "/superadmin-dashboard/rules" },
    { label: "ACTIVITY LOGS", path: "/superadmin-dashboard/activity-logs" },
  ];

  const location = useLocation();

  return (
    <div className="bg-[#e6e6e6] min-h-screen flex">
      <div className="w-[260px] h-screen bg-navy-dark fixed left-0 top-0 flex flex-col font-inter">
        <div className="p-6">
          <div className="w-full h-[178px] flex items-center justify-center">
            <img src="/logo.png" alt="Logo" />
          </div>
        </div>

        <nav className="flex-1 pt-8">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (location.pathname === "/" &&
                item.path === "/superadmin-dashboard");

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block w-full px-10 py-3 text-white text-[16px] font-bold tracking-[-0.32px] 
                  transition-colors rounded
                  ${isActive ? "bg-blue-600" : "hover:bg-blue-500"}
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
