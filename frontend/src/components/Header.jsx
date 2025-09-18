import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import cleanStreetLogo from '../assets/logo.png';
import userIcon from '../assets/Usericon.png';
import settingsIcon from '../assets/setting.png';
import logoutIcon from '../assets/logout.png';   

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
                            <img src={settingsIcon} alt="Settings" className="icon" />
                            Profile settings
                        </button>
                        <button className="dropdown-item" onClick={handleLogout}>
                            <img src={logoutIcon} alt="Logout" className="dropdown-icon" />
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;