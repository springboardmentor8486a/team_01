import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import HomePage from "./pages/HomePage";
import ResetPassword from "./pages/ResetPassword";
import LandingPage from './pages/LandingPage/LandingPage'; // Added from main
import Dashboard from './pages/Dashboard/Dashboard'; // Added from main
import './App.css'; // Added from main

function App() {
  return (
    <Router>
      <div className="App"> {/* Keep this div from main */}
        <Routes>
          {/* Login and related routes from your branch */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* LandingPage and Dashboard routes from main */}
          <Route path="/landing" element={<LandingPage />} /> {/* Changed from "/" to avoid conflict */}
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;