// components/LogoutButton.jsx
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="absolute bottom-5 left-1 right-1 mb-2 bg-navy-text rounded-lg ">
             <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-white rounded-lg flex hover:bg-white/10 transition-colors text-sm border-t border-white/10"
            >Logout</button>
    </div>
  )
};

export default LogoutButton;