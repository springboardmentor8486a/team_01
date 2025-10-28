import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import HomePage from "./pages/HomePage";
import ResetPassword from "./pages/ResetPassword";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ComplaintRegisterPage from './pages/ComplaintRegisterPage';
import LocationSelectionPage from './pages/LocationSelectionPage';
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProfilePage from "./pages/AdminProfilePage";
import VolunteerPage from "./pages/VolunteerPage";
import TrackComplaintPage from "./pages/TrackComplaintPage";
import FeedbackPage from "./pages/FeedbackPage";
import IssueMapPage from "./pages/IssueMapPage";
import AboutUsPage from "./pages/AboutUsPage";
import './App.css';

import IssueDetailpage from "./pages/IssueDetailPage";
function App() {
  return (
    <Router>
      <Routes>
        {/* Remove the duplicate ComplaintRegisterPage route */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register-complaint" element={<ComplaintRegisterPage />} />
        <Route path="/location-selection" element={<LocationSelectionPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route path="/viewissue/:id" element={<IssueDetailpage/>}/>
        {/* Fallback for any /viewissue/* path to avoid "No routes matched" during HMR or direct loads */}
        <Route path="/viewissue/*" element={<IssueDetailpage/>}/>
        <Route path="/location-selection" element={<LocationSelectionPage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/track-complaint" element={<TrackComplaintPage />} />
        <Route path="/post-feedback" element={<FeedbackPage />} />
        <Route path="/issue-map" element={<IssueMapPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
      </Routes>

        {/* <Routes>
         
           <Route path="/" element={<Navigate to="/home" replace />} />
           <Route path="/login" element={<LoginPage />} />
           <Route path="/home" element={<HomePage />} />
           <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route path="/verify-otp" element={<VerifyOtp />} />
           <Route path="/reset-password" element={<ResetPassword />} />           <Route path="/register" element={<RegisterPage />} />
           <Route path="/dashboard" element={<DashboardPage />} />
           <Route path="/profile" element={<ProfilePage />} />
        

        </Routes>  */}


    </Router>
  );
}

export default App;
