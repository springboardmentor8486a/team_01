import React from 'react';
import './Header.css';

const Header = ({ activePage }) => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <h2>Clean Street</h2>
                </div>
                <nav className="nav">
                    <a href="/" className={activePage === 'home' ? 'active' : ''}>Home</a>
                    <a href="/dashboard" className={activePage === 'dashboard' ? 'active' : ''}>Dashboard</a>
                    <a href="/profile" className={activePage === 'profile' ? 'active' : ''}>Profile</a>
                    <a href="/settings" className={activePage === 'settings' ? 'active' : ''}>Settings</a>
                </nav>
                <div className="user-actions">
                    <button className="logout-btn">Logout</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
