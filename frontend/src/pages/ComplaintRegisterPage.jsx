import React, { useState, useRef } from "react";
import axios from "axios";
import "./ComplaintRegisterPage.css";
import { useNavigate } from "react-router-dom"; // ADD THIS IMPORT



const ComplaintRegistration = () => {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
    const navigate = useNavigate(); // ADD THIS HOOK
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  // ... your existing code ...

  // ADD THIS FUNCTION
  const handleUpdateLocation = () => {
    navigate('/location-selection');
  };

  // ... your existing code ...
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  // Allow user to cancel and reset the form manually
  const handleCancel = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setPhoto(null);
    setPhotoPreview(null);
    setSubmitting(false);
  };

  // New submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.target;
    const formData = new FormData();

    // Collect form values
    const issueType = form.querySelector('select[required]').value;
    const issueTitle = form.querySelector('input[type="text"][placeholder="Brief summary of the issue"]').value;
    let priority = form.querySelectorAll('select[required]')[1].value;
    // Capitalize first letter of priority to match backend enum
    priority = priority.charAt(0).toUpperCase() + priority.slice(1);
    const address = form.querySelector('input[type="text"][placeholder="Enter city or address"]').value;
    const landmark = form.querySelector('input[type="text"][placeholder="Nearby landmark for reference"]').value;
    const description = form.querySelector('textarea[placeholder^="Describe the issue"]').value;

    formData.append("type", issueType);
    formData.append("title", issueTitle);
    formData.append("priority", priority);
    formData.append("address", address);
    formData.append("landmark", landmark);
    formData.append("description", description);

    // Add location hardcoded for now (latitude and longitude)
    formData.append("lat", "13.0827");
    formData.append("lng", "80.2707");

    // Add photo if exists
    if (photo) {
      formData.append("image", photo);
    }

    try {
        const token = localStorage.getItem("accessToken");
        await axios.post("http://localhost:3000/api/issues", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Complaint registered successfully!");
        navigate('/dashboard');
      } catch (error) {
        alert("Failed to register complaint. Please try again.");
        console.error(error);
      } finally {
        setSubmitting(false);
      }
  };

  return (
    <div className="complaint-container">
      <header className="complaint-header">
            <div className="brand-group">
                <div className="logo">CS</div>
                <a href="/dashboard" className="brand-name">CleanStreet</a>
            </div>
            <nav className="header-nav">
                <a href="/dashboard">Dashboard</a>
                <a href="/profile">Profile</a>
            </nav>
        </header>

      {/* Banner */}
      <div className="complaint-banner">
        <nav className="back-btn"> <a href="/dashboard">←</a>
        </nav>
        <h1>Report an Issue</h1>
        <p>Help make your community cleaner and safer</p>
      </div>

      {/* Form */}
      <form ref={formRef} className="complaint-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>📷 Issue Details</h2>
          <p>Provide detailed information about the issue you want to report</p>

          {/* Issue Type */}
          <label>
            Issue Type *
            <select required defaultValue="">
              <option value="" disabled>
                Select issue type
              </option>
              <option>Broken Streetlight</option>
              <option>Pothole</option>
              <option>Drainage Leakage</option>
              <option>Waste Management</option>
              <option>Vandalism</option>
              <option>Traffic Signal</option>
              <option>Public Safety</option>
              <option>Park Maintenance</option>
              <option>Water Leakage</option>
              <option>Noise Complaint</option>
              <option>Other</option>
            </select>
          </label>

          {/* Issue Title */}
          <label>
            Issue Title *
            <input
              type="text"
              placeholder="Brief summary of the issue"
              required
            />
          </label>

          {/* Priority */}
          <label>
            Priority *
            <select required defaultValue="">
              <option value="" disabled>
                Select priority level
              </option>
              <option value="low">Low — Non-urgent issue</option>
              <option value="medium">Medium — Needs attention soon</option>
              <option value="high">High — Urgent safety concern</option>
            </select>
          </label>

          {/* Address */}
          <label>
            Address *
            <input
              type="text"
              placeholder="Enter city or address"
              required
            />
          </label>

          {/* Landmark */}
          <label>
            Landmark (Optional)
            <input
              type="text"
              placeholder="Nearby landmark for reference"
            />
          </label>

          {/* Description */}
          <label>
            Description *
            <textarea
              placeholder="Describe the issue in detail (e.g., 'my area has the drainage leak')"
              required
            />
          </label>
        </div>

{/* Location */}
<div className="form-section">
  <h2>📍 Location Details</h2>
  <div className="location-box">
    <div>
      <label>Latitude</label>
      <input type="text" value="13.0827" readOnly />
    </div>
    <div>
      <label>Longitude</label>
      <input type="text" value="80.2707" readOnly />
    </div>
    <button 
      type="button" 
      className="update-location"
      onClick={handleUpdateLocation} // ADD THIS LINE
    >
      Update Location
    </button>
  </div>
</div>

        {/* Upload Photo */}
        <div className="form-section">
          <h2>🖼️ Photo (Optional)</h2>
          <div className="photo-upload-container">
            <input
              type="file"
              id="photo-upload"
              accept="image/jpg,image/jpeg,image/png"
              onChange={handlePhotoChange}
              className="photo-input"
            />
            <label htmlFor="photo-upload" className="upload-box">
              {photoPreview ? (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Preview" className="preview-image" />
                  <div className="photo-info">
                    <span className="file-name">{photo.name}</span>
                    <span className="file-size">
                      {(photo.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="remove-photo-btn"
                    onClick={handleRemovePhoto}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">📷</div>
                  <p>Click to upload photo</p>
                  <p className="upload-subtext">Supports JPG, PNG up to 10MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button type="button" className="cancel-btn" disabled={submitting} onClick={handleCancel}>Cancel</button>
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
            aria-busy={submitting ? "true" : "false"}
          >
            {submitting ? (<><span className="btn-spinner"></span>Submitting...</>) : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintRegistration;
