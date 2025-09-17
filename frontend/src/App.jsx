// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import HomePage from "./pages/HomePage";

function App() {
 return (
    <Router>
      <Routes>
        {/* default -> login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* home page */}
        <Route path="/home" element={<HomePage />} />

        {/* forgot password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/*otp*/}
        <Route path="/verify-otp" element={<VerifyOtp />} />
      </Routes>
    </Router>
  );
}

export default App;
