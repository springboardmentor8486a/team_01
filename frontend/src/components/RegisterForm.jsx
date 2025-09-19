import React, { useState } from "react";
import "./RegisterForm.css";

import userIcon from "../assets/user.png";
import emailIcon from "../assets/email.png";
import locationIcon from "../assets/location.png";
import roleIcon from "../assets/role.png";
import passwordIcon from "../assets/password.png";
import confirmIcon from "../assets/confirm.png";

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="register-box">
      <h2>Create your Account</h2>
      <p className="subtitle">
        Join our Community to help and keep our streets clean
      </p>

      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <img src={userIcon} alt="user" />
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box">
          <img src={emailIcon} alt="email" />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box">
          <img src={locationIcon} alt="location" />
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

       <div className="input-box">
  <img src={roleIcon} alt="role" />
  <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    required
  >
    <option value="">Select Role</option>
    <option value="user">User</option>
    <option value="admin">Admin</option>
    <option value="volunteer">Volunteer</option>
  </select>
</div>


        <div className="input-box">
          <img src={passwordIcon} alt="password" />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box">
          <img src={confirmIcon} alt="confirm" />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="register-btn">
          Register
        </button>
      </form>

      <p className="login-text">
        Already Have an account ? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default RegisterForm;
