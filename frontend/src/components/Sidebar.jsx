
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';


import axios from 'axios';
import './Sidebar.css';

const Sidebar = () => {
  const fileInputRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('profileImage', file);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:3000/api/auth/upload-profile', formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        // Refetch profile to update user in Redux
        const profileResponse = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (profileResponse.data.success && profileResponse.data.user) {
          alert('Profile image updated successfully!');
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <aside className="sidebar">
      <div className="user-info">
        <div className="avatar-container">
          <div className="avatar">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="User Avatar" className="avatar-image" />

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

        <h2 className="user-name">{user?.fullName || 'User'}</h2>
        <p className="username">@{user?.name || 'demo_user'}</p>

        <button className="role-button">{user?.role || 'Citizen'}</button>

        <p className="bio">
          {user?.bio || 'Active citizen helping to improve our community through CleanStreet'}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
