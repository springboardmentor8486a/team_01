import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import cleanStreetLogo from '../assets/logo.png';
import userIcon from '../assets/Usericon.png';
// We no longer import setting.png or logout.png

// --- SVG Icon Components ---
// This is the gear icon for "Profile settings"
const SettingsIcon = () => (
    <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);

// This is the icon for "Log Out"
const LogoutIcon = () => (
    <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const Header = ({ activePage }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleLogout = () => {
        console.log("User logged out");
        setDropdownOpen(false);
        navigate('/login');
    };

    return (
        <header className="dashboard-header">
            {/* Logo and Nav Links */}
            <div className="logo-area">
                <img src={cleanStreetLogo} alt="Clean Street Logo" className="header-logo" />
            </div>
            <nav className="nav-links">
                <Link to="/dashboard" className={activePage === 'dashboard' ? 'nav-link active' : 'nav-link'}>
                    Dashboard
                </Link>
                <Link to="/report" className={activePage === 'report' ? 'nav-link active' : 'nav-link'}>
                    Report Issue
                </Link>
                <Link to="/complaints" className={activePage === 'complaints' ? 'nav-link active' : 'nav-link'}>
                    View Complaints
                </Link>
            </nav>

            {/* User Profile Dropdown */}
            <div className="user-profile" ref={dropdownRef}>
                <div className="user-profile-clickable" onClick={() => setDropdownOpen(!isDropdownOpen)}>
                    <div className="user-icon-background">
                        <img src={userIcon} alt="User Profile" className="user-icon-image" />
                    </div>
                    <span>User</span>
                </div>

                {isDropdownOpen && (
                    <div className="profile-dropdown">
                        <button className="dropdown-item">
                            <SettingsIcon />
                            Profile settings
                        </button>
                        <button className="dropdown-item" onClick={handleLogout}>
                            <LogoutIcon />
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;