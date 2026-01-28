import React from "react";
import LogoutButton from "../../components/LogoutButton";

const AdminDashboard = ({ user, setUser}) =>{
    return (
    <div>
      <header>
        <h1>Welcome, {user.name}</h1>
      </header>
     <div>Admin Dashboard</div>
     <LogoutButton setUser={setUser} />
    </div>
    );
}

export default AdminDashboard;


