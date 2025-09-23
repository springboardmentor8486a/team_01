import React, { useRef, useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(null);

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result); // Set uploaded image as avatar
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="sidebar">
      <div className="user-info">
        <div className="avatar-container">
          <div className="avatar">
            {avatar ? (
              <img src={avatar} alt="User Avatar" className="avatar-image" />
            ) : (
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Camera Button */}
          <button className="camera-button" onClick={handleCameraClick} title="Change Profile Picture">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </button>
        </div>

        <h2 className="user-name">User</h2>
        <p className="username">@demo_user</p>

        <button className="role-button">Citizen</button>

        <p className="bio">
          Active citizen helping to improve our community through CleanStreet
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;


