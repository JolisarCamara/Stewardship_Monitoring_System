import React from "react";
import LogoutButton from "../../components/LogoutButton";

const ScholarDashboard = ({user, setUser}) =>{
     return (
    <div>
      <header>
        <h1>Welcome, {user.name}</h1>
        <LogoutButton setUser={setUser} />
      </header>
     <div>Scholar Dashboard</div>
    </div>
    );
}

export default ScholarDashboard;


