import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProfileForm from '../components/ProfileForm';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <Header />
      <div className="profile-content">
        <Sidebar />
        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;
