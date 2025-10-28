import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Clean Street. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/about-us">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;