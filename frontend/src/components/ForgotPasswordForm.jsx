// src/components/ForgotPasswordForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setEmail } from "../store/authSlice";
import "./ForgotPasswordForm.css";
import logo from "../assets/logo.png";
import maillogo from "../assets/maillogo.png";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordForm() {
  const [email, setEmailLocal] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const validateEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      if (response.data && response.data.success) {
        dispatch(setEmail(email));
        alert("OTP sent to your email");
        navigate("/verify-otp", { state: { email } });
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      alert("Error sending OTP. Please try again.");
      console.error("Forgot password error:", error);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <div className="forgot-header">
          <div className="forgot-logo">
            <img src={logo} alt="CleanStreet Logo" className="logo-img" />
          </div>
        </div>

        <h1 className="forgot-title">Forgot Password?</h1>
        <p className="forgot-sub">
          No worries — enter your registered email. We will send you an OTP to
          reset your access.
        </p>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="input-box">
            <span className="icon">
              <img src={maillogo} alt="email" />
            </span>
            <input
              type="email"
              placeholder="Enter your Mail Address"
              value={email}
              onChange={(e) => setEmailLocal(e.target.value)}
              aria-label="email"
            />
          </div>

          {error && <div className="forgot-error">{error}</div>}

          <button type="submit" className="forgot-button">
            Send otp
          </button>
        </form>

        <div className="forgot-footer">
          <small>Back to </small>
          <a href="/login" className="back-link">Login</a>
        </div>
      </div>
    </div>
  );
}
