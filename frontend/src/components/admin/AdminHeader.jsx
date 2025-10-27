import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';

export default function AdminHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      console.error('Admin logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      if (axios?.defaults?.headers?.common?.Authorization) { delete axios.defaults.headers.common.Authorization; }
      dispatch(setUser(null));
      navigate('/login');
    }
  };

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <Link to="/admin/dashboard" className="admin-logo-link">
          <div className="admin-logo-icon-bg">
            <span className="admin-logo-icon-text">CS</span>
          </div>
          <span className="admin-logo-text">CleanStreet</span>
        </Link>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-nav-link active">Dashboard</Link>
          <Link to="/admin/profile" className="admin-nav-link">Profile</Link>
          <a
            href="#"
            className="admin-nav-link"
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
            title="Logout"
          >
            Logout
          </a>
        </nav>
      </div>
    </header>
  );
}