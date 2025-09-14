// src/components/LoginForm.jsx
import React, { useState } from "react";
import "./LoginForm.css";

import logo from "../assets/logo.png";

<div className="login-logo">
  <img src={logo} alt="CleanStreet Logo" className="logo-img" />
  <span className="logo-text">CleanStreet</span>
</div>


function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login clicked:", { username, password });
    // later we’ll send this to backend
  };

  return (
    <div className="login-box">
      <div className="login-logo">
        <img src={logo} alt="CleanStreet Logo" className="logo-img" />
      </div>
      <p className="subtitle">Sign in to your account</p>

      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="forgot">
          <a href="#">Forgot Password?</a>
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>

        <p className="register">
          New user? <a href="#">Register</a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
