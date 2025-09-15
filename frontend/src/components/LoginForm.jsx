// src/components/LoginForm.jsx
import React, { useState } from "react";
import "./LoginForm.css";

import logo from "../assets/logo.png";
import maillogo from "../assets/maillogo.png";
import padlock from "../assets/padlock.png";



function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login clicked:", { email, password });
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
          <span className="icon">
     <img src={maillogo} alt="email" />
      </span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-box">
          <span className="icon">
    <img src={padlock} alt="password" />
  </span>
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
