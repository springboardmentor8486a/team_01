import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminHeader() {
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
        </nav>
      </div>
    </header>
  );
}