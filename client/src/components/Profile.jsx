import React, { useState } from 'react';
import {  FiLogOut } from 'react-icons/fi'; 
import './Profile.css';

import { useNavigate } from 'react-router-dom';

function Profile() {
  const [showMenu, setShowMenu] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };  // ✅ Added missing closing bracket for the function
const handleDashBoardNavigation = () => {
    navigate('/DashBoard' );
  };
  return (
    <div className="profile-container">
      <div className="profile-icon" onClick={() => setShowMenu(!showMenu)}>
        {/* <FiUser size={30} /> */}
      </div>

      {showMenu && (
        <div className="profile-menu">
            <button className="logout-btn" onClick={handleDashBoardNavigation}>
          Dashboard 
        </button>
        
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
