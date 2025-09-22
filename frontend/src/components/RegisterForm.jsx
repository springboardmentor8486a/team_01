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
      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
        });
        setProfileImage(null);
        setProfileImagePreview(null);
        // Redirect to login page after successful registration
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
