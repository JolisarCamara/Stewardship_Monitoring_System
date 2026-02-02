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
    <div className="w-full mt-auto p-3 shrink-0 border-t border-white/10 bg-[#24324D]">
    <button
      onClick={handleLogout}
      className="w-full text-center py-3 text-white rounded-lg transition-colors text-sm font-bold border border-white/20 
                 bg-[#24324D] hover:bg-[#3d4a66]"
    >
      LOGOUT
    </button>
    </div>
  );
};

export default LogoutButton;