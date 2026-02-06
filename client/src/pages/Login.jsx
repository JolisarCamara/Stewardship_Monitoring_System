import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  // Views: 'login', 'forgot', 'otp-reset'
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [otpData, setOtpData] = useState({ otp: "", newPassword: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // --- LOGIN LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", form, { withCredentials: true });
      setUser(res.data.user);
      
      const roleRedirects = {
        "user": "/scholar-dashboard",
        "admin": "/admin-dashboard",
        "super-admin": "/superadmin-dashboard"
      };
      navigate(roleRedirects[res.data.user.role] || "/");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FORGOT PASSWORD: SEND OTP ---
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await axios.post("/api/auth/forgot-password", { email: form.email });
      setMessage("OTP sent! Please check your email.");
      setView("otp-reset");
    } catch (err) {
      setError(err.response?.data?.message || "Email not found");
    } finally {
      setIsLoading(false);
    }
  };

  // --- RESET PASSWORD: VERIFY & REDIRECT ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/reset-password", { 
        email: form.email, 
        otp: otpData.otp, 
        newPassword: otpData.newPassword 
      });
      
      // After success, we can auto-login or redirect based on role_id
      alert("Password updated successfully!");
      window.location.reload(); // Simplest way to go back to login
    } catch (err) {
      setError("Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-[500px] bg-white rounded-[15px] shadow-lg p-8 relative">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-[150px] h-[120px] object-contain" />
        </div>

        <h1 className="text-center text-3xl font-bold text-navy-dark mb-2 uppercase">
          {view === 'login' ? 'Stewardship Monitoring System' : 'Reset Your Password'}
        </h1>
        
        {/* Error and Success Messages */}
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-center">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-600 text-center">{message}</div>}

        {/* --- VIEW 1: LOGIN --- */}
        {view === "login" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email Address"
              required
              className="w-full h-[60px] px-4 rounded-lg bg-gray-100 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-dark"
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              required
              className="w-full h-[60px] px-4 rounded-lg bg-gray-100 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-dark"
            />
            <button type="submit" disabled={isLoading} className="w-full h-[60px] rounded-lg bg-navy-dark text-white text-xl font-bold hover:opacity-90 disabled:opacity-50">
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </button>
            <div className="text-center">
              <button type="button" onClick={() => setView("forgot")} className="text-gray-800 hover:underline">Forgot Password?</button>
            </div>
          </form>
        )}

        {/* --- VIEW 2: REQUEST OTP --- */}
        {view === "forgot" && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <p className="text-center text-gray-600">Enter your email and we'll send you a 6-digit OTP code.</p>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email Address"
              required
              className="w-full h-[60px] px-4 rounded-lg bg-gray-100 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-dark"
            />
            <button type="submit" disabled={isLoading} className="w-full h-[60px] rounded-lg bg-navy-dark text-white text-xl font-bold">
              {isLoading ? "SENDING..." : "SEND OTP"}
            </button>
            <div className="text-center">
              <button type="button" onClick={() => setView("login")} className="text-gray-500 hover:underline">Back to Login</button>
            </div>
          </form>
        )}

        {/* --- VIEW 3: VERIFY OTP & RESET --- */}
        {view === "otp-reset" && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <input
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              required
              className="w-full h-[60px] px-4 rounded-lg bg-gray-100 text-lg text-center font-bold tracking-widest"
              onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
            />
            <input
              type="password"
              placeholder="New Password"
              required
              className="w-full h-[60px] px-4 rounded-lg bg-gray-100 text-lg"
              onChange={(e) => setOtpData({ ...otpData, newPassword: e.target.value })}
            />
            <button type="submit" disabled={isLoading} className="w-full h-[60px] rounded-lg bg-green-600 text-white text-xl font-bold">
              {isLoading ? "VERIFYING..." : "RESET PASSWORD"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;