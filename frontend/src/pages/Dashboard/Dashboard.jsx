import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="avatar">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="User avatar"
              className="avatar-img"
            />
            <div className="camera-icon">📷</div>
          </div>
          <h2>User</h2>
          <p className="username">@demo_user</p>
          <button className="role-btn">Citizen</button>
          <p className="sidebar-bio">
            Active citizen helping to improve our community through CleanStreet
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Navbar */}
        <header className="navbar">
          <div className="logo">CleanStreet</div>
          <input type="text" placeholder="Search" className="search-bar" />
          <nav className="nav-links">
            <a href="/dashboard" className="active">
              Dashboard
            </a>
            <a href="/profile">Profile</a>
          </nav>
        </header>

        {/* Dashboard Section */}
        <section className="dashboard-section">
          <h1>Profile</h1>
          <p className="subtitle">
            Manage your account information and preferences
          </p>

          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-header-left">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Account avatar"
                />
                <div>
                  <h2>Account information</h2>
                  <p>Update your profile details</p>
                </div>
              </div>
              <button className="edit-btn">✏️ Edit</button>
            </div>

            <div className="card-body">
              <div className="field">
                <label>Username</label>
                <input type="text" value="@demo_user" disabled />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" value="demouser@gmail.com" disabled />
              </div>
              <div className="field">
                <label>Full Name</label>
                <input type="text" value="Demo User" disabled />
              </div>
              <div className="field">
                <label>Phone Number</label>
                <input type="text" value="+91 90437-55555" disabled />
              </div>
              <div className="field">
                <label>Location</label>
                <input type="text" value="Downtown street" disabled />
              </div>
              <div className="field bio-field">
                <label>Bio</label>
                <textarea
                  disabled
                  value="Active citizen helping to improve our community through CleanStreet"
                ></textarea>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
