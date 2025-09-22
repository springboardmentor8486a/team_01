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
        <div className="search-bar">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder="Search" className="search-input" />
        </div>
      </div>
      
      <div className="header-right">
        <nav className="nav-links">
          <a href="#" className="nav-link dashboard">Dashboard</a>
          <a href="#" className="nav-link profile active">Profile</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
