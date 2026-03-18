import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = (props) => {
  const isAuthenticated = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear(); // Clears token, role, userId, and userName
    window.location.href = "/login"; // Force refresh to reset app state
  };

  return (
    <div className="navbar bg-white text-black shadow-sm px-4 lg:px-10">
      <div className="navbar-start">
        
        <img 
           src="/gatekeeperlogo.png" 
           alt="Logo" 
           className="w-15 h-9  object-cover mr-2" 
        />
        <Link to="/" className="brand-logo text-3xl font-extrabold tracking-tighter"> Gatekeeper</Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-semibold gap-4">
          <li><Link to={props.link1}>{props.opt1}</Link></li>
          <li><Link to={props.link2}>{props.opt2}</Link></li>
          <li><Link to={props.link3}>{props.opt3}</Link></li>
        </ul>
      </div>

      <div className="navbar-end">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="btn btn-error btn-outline rounded-xl px-6">
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary rounded-xl px-8">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;