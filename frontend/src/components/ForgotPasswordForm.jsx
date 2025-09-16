// src/components/ForgotPasswordForm.jsx
import React, { useState } from "react";
import "./ForgotPasswordForm.css";
import logo from "../assets/logo.png";
import maillogo from "../assets/maillogo.png";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    // No API for now — show a confirmation toast / message
    alert(`(UI only) OTP will be sent to ${email}`);
    // Later: navigate to /otp and pass the email
    // navigate("/otp", { state: { email } });
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
              onChange={(e) => setEmail(e.target.value)}
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
