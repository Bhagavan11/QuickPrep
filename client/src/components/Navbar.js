import React from "react";
import { Link } from "react-router-dom"; // ✅ import useNavigate
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ toggleProfile }) => {
 

 
  

  

  return (
    <nav className="navbar">
      <div className="logo">QUICK<span>PREP</span></div>
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/ProblemList">Problems</Link></li>
        <li><Link to="/chatbot">ChatBot</Link></li>
       
        <li>
          <FaUserCircle size={30} className="profile-icon" onClick={toggleProfile} />
        </li>
      </ul>

      
    </nav>
  );
};

export default Navbar;
