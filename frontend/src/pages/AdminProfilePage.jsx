import React from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import Sidebar from '../components/Sidebar';
import ProfileForm from '../components/ProfileForm';
import './ProfilePage.css';

const AdminProfilePage = () => {
  return (
    <div className="profile-page">
      <AdminHeader />
      <div className="profile-content">
        <Sidebar />
        <ProfileForm />
      </div>
    </div>
  );
};

export default AdminProfilePage;