import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");
  try {
    const res = await axios.post("/api/auth/login", form, { withCredentials: true });
    setUser(res.data.user);

    if (res.data.user.role === "user") {
      navigate("/scholar-dashboard");
    } else if (res.data.user.role === "admin") {
      navigate("/admin-dashboard");
    } else if (res.data.user.role === "super-admin") {
      navigate("/superadmin-dashboard");
    }
  } catch (err) {
    setError("Invalid email or password");
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

        <h1 className="text-center text-3xl font-bold text-navy-dark mb-2">STEWARDSHIP MONITORING SYSTEM</h1>
        <p className="text-center text-lg text-gray-700 mb-6">Please insert your details to login</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-center">
            {error}
          </div>
        )}

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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[60px] rounded-lg bg-navy-dark text-white text-xl font-bold hover:bg-navy-darker transition-colors disabled:opacity-50"
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <div className="text-center pt-4">
          <a href="#" className="text-gray-800 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
