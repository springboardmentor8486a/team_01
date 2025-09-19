import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png"; 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="CleanStreet" className="navbar-brand" />
      </div>
      <div className="navbar-right">
        <span className="navbar-new">New here?</span>
        <Link to="/login">
          <button className="navbar-button">Get Started</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
