// src/components/LoginForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "./LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";

import logo from "../assets/logo.png";
import maillogo from "../assets/maillogo.png";
import padlock from "../assets/padlock.png";

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
      }
      alert("Login successful!");
      console.log("Login success:", response.data);

      try {
        const profileResponse = await axios.get("http://localhost:3000/api/auth/profile");
        if (profileResponse.data.success && profileResponse.data.user) {
          dispatch(setUser(profileResponse.data.user));
          if (profileResponse.data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          navigate("/dashboard");
        }
      } catch (profileError) {
        console.error("Failed to fetch user profile:", profileError);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.message) {
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
        {/* Email Field */}
        <label className="input-label">
          Email <span className="required">*</span>
        </label>
        <div className="input-box">
          <span className="icon">
            <img src={maillogo} alt="email" />
          </span>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <label className="input-label">
          Password <span className="required">*</span>
        </label>
        <div className="input-box">
          <span className="icon">
            <img src={padlock} alt="password" />
          </span>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
