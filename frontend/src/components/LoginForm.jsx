// src/components/LoginForm.jsx
import React, { useState } from "react";
import axios from "axios"; // Added axios import
import "./LoginForm.css";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import maillogo from "../assets/maillogo.png";
import padlock from "../assets/padlock.png";



function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });
      // You can store token, redirect, or show a success message here
      if (response.data && response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        // Set axios default Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
      }
      alert("Login successful!");
      console.log("Login success:", response.data);
      // Redirect to dashboard page after successful login
      navigate("/dashboard");
    } catch (error) {
      // Handle error (show message to user)
      if (error.response && error.response.data && error.response.data.message) {
        alert("Login failed: " + error.response.data.message);
      } else {
        alert("Login failed. Please try again.");
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
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
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="register">
          New user? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
