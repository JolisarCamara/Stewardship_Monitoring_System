import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";

import ScholarDashboard from "./pages/Scholar/scholarDashboard";

//Admin
import AdminDashboard from "./pages/Admin/adminDashboard";
import AdminRoutes from "./pages/Admin/AdminRoutes";
import AdminRulesPage from "./pages/Admin/rules";
import AdminStewardshipTask from "./pages/Admin/stewardshipTask";
import AdminValidationTask from "./pages/Admin/taskValidation";
import AdminScholarAccounts from "./pages/Admin/scholarAccounts";


//Super Admin
import SuperAdminDashboard from "./pages/superAdmin/super-admin-dashboard";
import SARoutes from "./pages/superAdmin/SARoutes";
import SuperAdminRulesPage from "./pages/superAdmin/rules";
import AdminsAccounts from "./pages/superAdmin/adminAccounts";
import ScholarsAccounts from "./pages/superAdmin/scholarAccounts";
import ActivityLogsPage from "./pages/superAdmin/activityLogPage";
import SuperAdminAccounts from "./pages/superAdmin/super-adminAccounts";
import SAstewardshipTasks from "./pages/superAdmin/SAstewardshipTask";
import SAvalidationTasks from "./pages/superAdmin/SAvalidationTask";

//login
import Login from "./pages/Login";

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-light-bg">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-navy-dark"></div>
      </div>
    );
  }

  return (
<Router>
      <Routes>
        {/* Auth Logic Redirection */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "user" ? <Navigate to="/scholar-dashboard" replace /> :
              user.role === "admin" ? <Navigate to="/admin-dashboard" replace /> :
              user.role === "super-admin" ? <Navigate to="/superadmin-dashboard" replace /> :
              <Login setUser={setUser} />
            ) : <Login setUser={setUser} />
          }
        />

        {/* Scholar Route */}
        <Route
          path="/scholar-dashboard"
          element={user?.role === "user" ? <ScholarDashboard user={user} setUser={setUser} /> : <Navigate to="/" replace />}
        />

        {/* Admin Dashboard Group */}
        <Route
          path="/admin-dashboard"
          element={user?.role === "admin" ? <AdminRoutes user={user} setUser={setUser} /> : <Navigate to="/" replace />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="scholars" element={<AdminScholarAccounts/>} />
          <Route path="stewardship-tasks" element={<AdminStewardshipTask />} />
          <Route path="validation-tasks" element={<AdminValidationTask />} />
          <Route path="rules" element={<AdminRulesPage />} />
        </Route>

        {/* Super Admin Dashboard Group */}
        <Route
          path="/superadmin-dashboard"
          element={user?.role === "super-admin" ? <SARoutes user={user} setUser={setUser} /> : <Navigate to="/" replace />}
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="super-admins" element={<SuperAdminAccounts />} />
          <Route path="admins" element={<AdminsAccounts />} />
          <Route path="scholars" element={<ScholarsAccounts />} />
          <Route path="stewardship-tasks" element={<SAstewardshipTasks />} />
          <Route path="validation-tasks" element={<SAvalidationTasks />} />
          <Route path="rules" element={<SuperAdminRulesPage />} />
          <Route path="activity-logs" element={<ActivityLogsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;