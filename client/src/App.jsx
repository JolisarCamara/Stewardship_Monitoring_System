import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import ScholarDashboard from "./pages/Scholar/scholarDashboard";
import AdminDashboard from "./pages/Admin/adminDashboard";
import SARoutes from "./pages/superAdmin/SARoutes";
import RulesPage from "./pages/superAdmin/rules";
import AdminsAccounts from "./pages/superAdmin/adminAccounts";
import ScholarsAccounts from "./pages/superAdmin/scholarAccounts";
import ActivityLogsPage from "./pages/superAdmin/activityLogPage";
import SuperAdminDashboard from "./pages/superAdmin/super-admin-dashboard";
import SuperAdminAccounts from "./pages/superAdmin/super-adminAccounts";
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
        <Route
          path="/"
          element={
            user ? (
              user.role === "user" ? (
                <Navigate to="/scholar-dashboard" replace />
              ) : user.role === "admin" ? (
                <Navigate to="/admin-dashboard" replace />
              ) : user.role === "super-admin" ? (
                <Navigate to="/superadmin-dashboard" replace />
              ) : (
                <Login setUser={setUser} />
              )
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        <Route
          path="/scholar-dashboard"
          element={
            user && user.role === "user" ? (
              <ScholarDashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            user && user.role === "admin" ? (
              <AdminDashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />


        <Route
  path="/superadmin-dashboard"
  element={
    user && user.role === "super-admin" ? (
      <SARoutes user={user} setUser={setUser} />
    ) : (
      <Navigate to="/" replace />
    )
  }>

{/* Nested routes */}
          <Route index element={<SuperAdminDashboard />} />
          <Route path="super-admins" element={<SuperAdminAccounts />} />
          <Route path="admins" element={<AdminsAccounts />} />
          <Route path="scholars" element={<ScholarsAccounts />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="activity-logs" element={<ActivityLogsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
