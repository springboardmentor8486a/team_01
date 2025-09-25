import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');

      if (!token) {
        console.log('No access token found in localStorage');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Profile API response:', response.data);

      if (response.data.success) {
        setUser(response.data.user);
        console.log('User data set:', response.data.user);
      } else {
        console.log('API response not successful:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await axios.post('http://localhost:3000/api/auth/upload-profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        // Refresh user data to show new image
        fetchUserProfile();
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Failed to upload profile image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <aside className="sidebar">
        <div className="user-info">
          <div className="loading-spinner">Loading...</div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="user-info">
        <div className="avatar-container">
          <div className="avatar">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIzMCIgZmlsbD0iI2YwZjBmMCIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMjIiIHI9IjEwIiBmaWxsPSIjY2NjIi8+PHBhdGggZD0iTTEwIDUwQzEwIDQwIDIwIDM1IDMwIDM1QzQwIDM1IDUwIDQwIDUwIDUwIiBmaWxsPSIjY2NjIi8+PC9zdmc+';
                }}
              />
            ) : (
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </div>
          <label className="camera-button">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <h2 className="user-name">{user?.fullName || user?.name || 'User'}</h2>
        <p className="username">@{user?.name || 'demo_user'}</p>

        <button className="role-button">Citizen</button>

        <p className="bio">
          {user?.bio || 'Active citizen helping to improve our community through CleanStreet'}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
