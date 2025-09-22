import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="CleanStreet" className="navbar-brand" />
      </div>

      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      {/* Right section */}
      <div className={`navbar-right ${isOpen ? "open" : ""}`}>
        <span className="navbar-new">New here?</span>
        <Link to="/login">
          <button className="navbar-button">Get Started</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
