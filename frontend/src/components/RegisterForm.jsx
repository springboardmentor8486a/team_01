import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

import userIcon from "../assets/user.png";
import emailIcon from "../assets/email.png";
import locationIcon from "../assets/location.png";
import roleIcon from "../assets/role.png";
import passwordIcon from "../assets/password.png";
import confirmIcon from "../assets/confirm.png";

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    role: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      const file = files[0];
      setProfileImage(file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setProfileImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("location", formData.location);
      data.append("role", formData.role);
      data.append("password", formData.password);
      data.append("fullName", formData.fullName);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("bio", formData.bio);
      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        setSuccess("Registration successful!");
        setFormData({
          name: "",
          email: "",
          location: "",
          role: "",
          password: "",
          confirmPassword: "",
          fullName: "",
          phoneNumber: "",
          bio: "",
        });
        setProfileImage(null);
        setProfileImagePreview(null);
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-box">
      <h2>Create your Account</h2>
      <p className="subtitle">
        Join our Community to help and keep our streets clean
      </p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div
          className="profile-image-upload"
          onClick={handleProfileImageClick}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: "#ddd",
            backgroundImage: profileImagePreview
              ? `url(${profileImagePreview})`
              : `url(${userIcon})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            margin: "0 auto 20px",
            cursor: "pointer",
            border: "2px solid #aaa",
          }}
          title="Click to upload profile image"
        ></div>
        <input
          type="file"
          name="profileImage"
          id="profileImage"
          accept="image/*"
          onChange={handleChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        {/* Name */}
        <label htmlFor="name">Username *</label>
        <div className="input-box">
          <img src={userIcon} alt="user" />
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Full Name */}
        <label htmlFor="fullName">Full Name *</label>
        <div className="input-box">
          <img src={userIcon} alt="user" />
          <input
            type="text"
            id="fullName"
            placeholder="Enter Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <label htmlFor="email">Email *</label>
        <div className="input-box">
          <img src={emailIcon} alt="email" />
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Location */}
        <label htmlFor="location">Location</label>
        <div className="input-box">
          <img src={locationIcon} alt="location" />
          <input
            type="text"
            id="location"
            placeholder="Enter your location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        {/* Role */}
        <label htmlFor="role">Role *</label>
        <div className="input-box">
          <img src={roleIcon} alt="role" />
          <select
            id="role"
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

        {/* Password */}
        <label htmlFor="password">Password *</label>
        <div className="input-box">
          <img src={passwordIcon} alt="password" />
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Confirm Password */}
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <div className="input-box">
          <img src={confirmIcon} alt="confirm" />
          <input
            type="password"
            id="confirmPassword"
            placeholder="Re-enter your password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <label htmlFor="phoneNumber">Phone Number</label>
        <div className="input-box">
          <img src={userIcon} alt="phone" />
          <input
            type="tel"
            id="phoneNumber"
            placeholder="Enter your phonenumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        {/* Bio */}
        <label htmlFor="bio">Bio</label>
        <div className="input-box">
          <img src={userIcon} alt="bio" />
          <textarea
            id="bio"
            placeholder="Bio (Tell us about yourself)"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

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
