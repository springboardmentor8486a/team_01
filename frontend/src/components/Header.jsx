import React from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/authSlice';
 
const Header = ({ activePage }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const isLoggedIn = !!token || !!user;
 
  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(
        'http://localhost:3000/api/auth/logout',
        null,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        }
      );
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      if (axios?.defaults?.headers?.common?.Authorization) {
        delete axios.defaults.headers.common.Authorization;
      }
      dispatch(setUser(null));
      navigate('/login');
    }
  };
 
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/home" className="logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">CS</div>
          <span className="logo-text">CleanStreet</span>
        </Link>
      </div>
 
      <div className="header-center"></div>
 
      <div className="header-right">
        <nav className="nav-links">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-link dashboard${activePage === 'dashboard' ? ' active' : ''}`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={`nav-link profile${activePage === 'profile' ? ' active' : ''}`}
              >
                Profile
              </Link>
              <a
                href="#"
                className="nav-link logout"
                onClick={(e) => { e.preventDefault(); handleLogout(); }}
                title="Logout"
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link profile">Login</Link>
              <Link to="/register" className="nav-link dashboard">Get Started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
 
export default Header;