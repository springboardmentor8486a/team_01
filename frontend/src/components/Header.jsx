import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">CS</div>
          <span className="logo-text">CleanStreet</span>
        </div>
      </div>

      <div className="header-center">
        
      </div>

      <div className="header-right">
        <nav className="nav-links">
          <a href="/dashboard" className="nav-link dashboard">Dashboard</a>
          <a href="/profile" className="nav-link profile active">Profile</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
