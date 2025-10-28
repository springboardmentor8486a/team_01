import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ComplaintRegisterPage.css";
import { useNavigate } from "react-router-dom"; // ADD THIS IMPORT



const ComplaintRegistration = () => {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    issueType: '',
    issueTitle: '',
    priority: '',
    address: '',
    landmark: '',
    description: ''
  });

  // Restore form data from sessionStorage on component mount
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('complaintFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        // Clear the saved data after restoring
        sessionStorage.removeItem('complaintFormData');
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }

    // Restore photo preview if exists
    const savedPhotoPreview = sessionStorage.getItem('complaintPhotoPreview');
    if (savedPhotoPreview) {
      setPhotoPreview(savedPhotoPreview);
      sessionStorage.removeItem('complaintPhotoPreview');
    }
  }, []);

  // ... your existing code ...

  // Save form data and navigate to location selection
  const handleUpdateLocation = () => {
    // Save current form data to sessionStorage
    sessionStorage.setItem('complaintFormData', JSON.stringify(formData));
    
    // Save photo preview if exists
    if (photoPreview) {
      sessionStorage.setItem('complaintPhotoPreview', photoPreview);
    }
    
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

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Allow user to cancel and reset the form manually
  const handleCancel = () => {
    setFormData({
      issueType: '',
      issueTitle: '',
      priority: '',
      address: '',
      landmark: '',
      description: ''
    });
    setPhoto(null);
    setPhotoPreview(null);
    setSubmitting(false);
    // Also clear any saved form data
    sessionStorage.removeItem('complaintFormData');
    sessionStorage.removeItem('complaintPhotoPreview');
  };

  // New submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const submitData = new FormData();

    // Use state values instead of DOM querying
    const { issueType, issueTitle, priority, address, landmark, description } = formData;
    
    // Validate required fields
    if (!issueType || !issueTitle || !priority || !address || !description) {
      alert('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    // Capitalize first letter of priority to match backend enum
    const formattedPriority = priority.charAt(0).toUpperCase() + priority.slice(1);

    submitData.append("type", issueType);
    submitData.append("title", issueTitle);
    submitData.append("priority", formattedPriority);
    submitData.append("address", address);
    submitData.append("landmark", landmark);
    submitData.append("description", description);

    // Add location hardcoded for now (latitude and longitude)
    submitData.append("lat", "13.0827");
    submitData.append("lng", "80.2707");

    // Add photo if exists
    if (photo) {
      submitData.append("image", photo);
    }

    try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.post("http://localhost:3000/api/issues", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        const complaintId = data?.complaintId || data?.complaintID || '';
        if (complaintId) {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.setItem('lastComplaintId', complaintId);
          }
          alert(`Complaint registered successfully!\n\nYour Complaint ID: ${complaintId}\n\nUse this ID on the Track page to check status.`);
          navigate(`/track-complaint?cid=${encodeURIComponent(complaintId)}`);
        } else {
          alert("Complaint registered successfully!");
          navigate('/dashboard');
        }
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
      <form ref={formRef} className="complaint-form" onSubmit={handleSubmit} noValidate>
        <div className="form-section">
          <h2>📷 Issue Details</h2>
          <p>Provide detailed information about the issue you want to report</p>

          {/* Issue Type */}
          <label>
            Issue Type *
            <select 
              required 
              value={formData.issueType}
              onChange={(e) => handleInputChange('issueType', e.target.value)}
            >
              <option value="" disabled>
                Select issue type
              </option>
              <option value="Broken Streetlight">Broken Streetlight</option>
              <option value="Pothole">Pothole</option>
              <option value="Drainage Leakage">Drainage Leakage</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Vandalism">Vandalism</option>
              <option value="Traffic Signal">Traffic Signal</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Park Maintenance">Park Maintenance</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Noise Complaint">Noise Complaint</option>
              <option value="Other">Other</option>
            </select>
          </label>

          {/* Issue Title */}
          <label>
            Issue Title *
            <input
              type="text"
              placeholder="Brief summary of the issue"
              required
              value={formData.issueTitle}
              onChange={(e) => handleInputChange('issueTitle', e.target.value)}
            />
          </label>

          {/* Priority */}
          <label>
            Priority *
            <select 
              required 
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
            >
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
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </label>

          {/* Landmark */}
          <label>
            Landmark (Optional)
            <input
              type="text"
              placeholder="Nearby landmark for reference"
              value={formData.landmark}
              onChange={(e) => handleInputChange('landmark', e.target.value)}
            />
          </label>

          {/* Description */}
          <label>
            Description *
            <textarea
              placeholder="Describe the issue in detail (e.g., 'my area has the drainage leak')"
              required
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
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
