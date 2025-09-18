// src/components/ResetPasswordForm.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ResetPasswordForm.css";
import logo from "../assets/logo.png";
import padlock from "../assets/padlock.png";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // No backend yet — simulate success:
    // In real app, call your API (POST /auth/reset-password) here.
    alert("Password changed successfully (UI simulation)");
    // redirect to login
    navigate("/login");
  };

  return (
    <div className="resetpassword-box">
      <div className="resetpassword-header">
        <div className="reset-logo">
                    <img src={logo} alt="CleanStreet Logo" className="reset-img" />
                  </div>
      </div>

      <h1 className="reset-title">Change Password</h1>

     <form className="reset-form" onSubmit={handleSubmit}>
  <div className="reset-input-box">
    <img src={padlock} alt="lock" className="reset-icon" />
    <input
      type="password"
      className="reset-input"
      placeholder="Enter your new Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      aria-label="new-password"
    />
  </div>

  <div className="reset-input-box">
    <img src={padlock} alt="lock" className="reset-icon" />
    <input
      type="password"
      className="reset-input"
      placeholder="Re-enter your Password"
      value={confirm}
      onChange={(e) => setConfirm(e.target.value)}
      required
      aria-label="confirm-password"
    />
  </div>

  {error && <div className="reset-error">{error}</div>}

  <button type="submit" className="reset-submit">Submit</button>
</form>


      <div className="reset-footer">
        <small>Back to</small>
        <Link to="/login" className="reset-back-link"> Login</Link>
      </div>
    </div>
  );
}
