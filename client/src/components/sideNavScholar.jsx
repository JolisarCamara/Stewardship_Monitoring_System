import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import MobileDrawer from "../components/ui/mobileDrawer";

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HistoryIcon from '@mui/icons-material/History';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

const SideBar_Scholar = ({ children, setUser }) => {
  const navItems = [
    { label: "DASHBOARD", path: "/scholar-dashboard", icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
    { label: "STEWARDSHIP TASK", path: "/scholar-dashboard/stewardship-tasks", icon: <AssignmentTurnedInIcon sx={{ fontSize: 20 }} /> },
    { label: "BIOMETRICS TIME IN/OUT", path: "/scholar-dashboard/biometrics-time-in-out", icon: <FingerprintIcon sx={{ fontSize: 20 }} /> },
    { label: "RULES", path: "/scholar-dashboard/rules", icon: <GavelIcon sx={{ fontSize: 20 }} /> },
    { label: "ACTIVITY LOGS", path: "/scholar-dashboard/activity-logs", icon: <HistoryIcon sx={{ fontSize: 20 }} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#e6e6e6]">
      {/* MOBILE VERSION */}
      <MobileDrawer 
        navItems={navItems} 
        logoutComponent={<LogoutButton setUser={setUser} />} 
      />

      {/* DESKTOP VERSION */}
      <aside className="hidden md:flex w-[240px] h-screen bg-[#24324D] fixed left-0 top-0 flex flex-col font-inter">
        <div className="p-6">
          <div className="w-full h-[100px] flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="max-h-full" />
          </div>
        </div>

        <nav className="flex flex-col px-3 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/scholar-dashboard"}
              className={({ isActive }) =>
                `h-12 flex items-center gap-4 text-white font-bold tracking-wide rounded-lg px-4 transition
                ${isActive ? "bg-[#3d4a66]" : "hover:bg-[#3d4a66]/50"}`
              }
            >
              <span className="flex items-center justify-center opacity-80">
                {item.icon}
              </span>
              <span className="text-[13px]">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-auto p-4 flex justify-center border-t border-white/10">
          <LogoutButton setUser={setUser} />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 md:ml-[240px]">
        <div className="mt-12 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SideBar_Scholar;