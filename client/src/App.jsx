import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import ScholarDashboard from "./pages/Scholar/scholarDashboard";
import AdminDashboard from "./pages/Admin/adminDashboard";
import SuperAdminDashboard from "./pages/superAdmin/superAdminDashboard";
import RulesPage from "./pages/superAdmin/rules";
import AdminsPage from "./pages/superAdmin/adminPage";
import ScholarsPage from "./pages/superAdmin/scholarPage";
import ActivityLogsPage from "./pages/superAdmin/activityLogPage";
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
      <SuperAdminDashboard user={user} setUser={setUser} />
    ) : (
      <Navigate to="/" replace />
    )
  }>

{/* Nested routes */}
          <Route path="admins" element={<AdminsPage />} />
          <Route path="scholars" element={<ScholarsPage />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="activity-logs" element={<ActivityLogsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
