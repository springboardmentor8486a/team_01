import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LocationSelectionPage = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState([13.082700, 80.270700]);
  const [manualLat, setManualLat] = useState("13.0827");
  const [manualLng, setManualLng] = useState("80.2707");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    address: "Raja Muthiah Road, CMWSSB Division 58, Ward 58, Royapuram, Chennai, Tamil Nadu, 600001, India",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India"
  });

  // Function to get address details from coordinates
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        setAddressDetails({
          address: data.display_name || "Address not available",
          city: addr.city || addr.town || addr.village || addr.county || "Not specified",
          state: addr.state || "Not specified",
          country: addr.country || "Not specified"
        });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddressDetails({
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        city: "Not available",
        state: "Not available",
        country: "Not available"
      });
    }
  };

  // Update position and address when manual coordinates change
  useEffect(() => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
      getAddressFromCoordinates(lat, lng);
    }
  }, [manualLat, manualLng]);

  // Get initial address details
  useEffect(() => {
    getAddressFromCoordinates(position[0], position[1]);
  }, []);

  const handleBack = () => navigate(-1);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);
          setManualLat(lat.toFixed(6));
          setManualLng(lng.toFixed(6));
          getAddressFromCoordinates(lat, lng);
          setLoading(false);
        },
        () => {
          alert("Unable to retrieve your location. Please enable location services.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleConfirmLocation = () => {
    navigate("/register-complaint", {
      state: { 
        latitude: position[0], 
        longitude: position[1], 
        address: addressDetails.address,
        city: addressDetails.city,
        state: addressDetails.state,
        country: addressDetails.country
      }
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name, address } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        
        setPosition([newLat, newLng]);
        setManualLat(newLat.toFixed(6));
        setManualLng(newLng.toFixed(6));
        
        // Update address details from search result
        if (address) {
          setAddressDetails({
            address: display_name,
            city: address.city || address.town || address.village || address.county || "Not specified",
            state: address.state || "Not specified",
            country: address.country || "Not specified"
          });
        } else {
          // If address details aren't in the search result, use reverse geocoding
          getAddressFromCoordinates(newLat, newLng);
        }
      } else {
        alert("Location not found!");
      }
    } catch (err) {
      alert("Error fetching location!");
    }

    setLoading(false);
  };

  return (
    <div className="location-page">
      {/* Header */}
      <div className="location-header">
        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>
        <h1>Select Location</h1>
        <p>Search for a location or use your current GPS position</p>
      </div>

      {/* Search */}
      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a location (e.g., Chennai, Tamil Nadu)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-btn" disabled={loading}>
          🔍
        </button>
      </form>

      {/* Map Section */}
      <div className="map-section">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${
            position[1] - 0.01
          }%2C${position[0] - 0.01}%2C${position[1] + 0.01}%2C${
            position[0] + 0.01
          }&layer=mapnik&marker=${position[0]}%2C${position[1]}`}
          frameBorder="0"
          title="OpenStreetMap"
        ></iframe>
      </div>

      {/* Location Details */}
      <div className="location-card">
        <h2>📍 Location Details</h2>
        <div className="location-info">
          <div className="info-row">
            <span className="label">Address</span>
            <span className="value">{addressDetails.address}</span>
          </div>
          <div className="info-row">
            <span className="label">City</span>
            <span className="value">{addressDetails.city}</span>
          </div>
          <div className="info-row">
            <span className="label">State</span>
            <span className="value">{addressDetails.state}</span>
          </div>
          <div className="info-row">
            <span className="label">Country</span>
            <span className="value">{addressDetails.country}</span>
          </div>
          <div className="info-row">
            <span className="label">Coordinates</span>
            <span className="value">
              {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="action-buttons">
        <button className="confirm-btn" onClick={handleConfirmLocation}>
          Confirm Location
        </button>
        <button className="cancel-btn" onClick={handleBack}>
          Cancel
        </button>
      </div>

      {/* Manual Entry */}
      <div className="manual-card">
        <h2>✍️ Manual Coordinate Entry</h2>
        <div className="manual-inputs">
          <input
            type="text"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            placeholder="Latitude"
          />
          <input
            type="text"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            placeholder="Longitude"
          />
        </div>
        <button className="gps-btn" onClick={handleUseCurrentLocation} disabled={loading}>
          {loading ? "Loading..." : "Use Current Location"}
        </button>
      </div>

      {/* Inline CSS */}
      <style>{`
        .location-page {
          background: #f4f9ff;
          font-family: "Segoe UI", Arial, sans-serif;
          color: #1d1d1f;
          min-height: 100vh;
          padding-bottom: 30px;
        }
        .location-header {
          background: #4a9dfc;
          color: white;
          padding: 30px 40px;
        }
        .location-header h1 {
          font-size: 24px;
          margin: 10px 0;
        }
        .location-header p {
          font-size: 14px;
          opacity: 0.9;
        }
        .back-btn {
          background: transparent;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }
        .search-box {
          display: flex;
          align-items: center;
          background: white;
          margin: 20px auto;
          width: 90%;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .search-box input {
          flex: 1;
          border: none;
          padding: 14px;
          font-size: 15px;
          outline: none;
        }
        .search-box .search-btn {
          background: #4a9dfc;
          color: white;
          padding: 14px 20px;
          border: none;
          cursor: pointer;
        }
        .map-section {
          width: 90%;
          margin: 0 auto;
          height: 320px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .map-section iframe {
          width: 100%;
          height: 100%;
        }
        .location-card, .manual-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          width: 90%;
          margin: 20px auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .location-card h2, .manual-card h2 {
          margin-bottom: 16px;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
        .location-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: #f9fbff;
          border-radius: 8px;
        }
        .info-row .label {
          font-weight: 500;
          color: #555;
        }
        .info-row .value {
          font-weight: 300;
          color: #222;
          text-align: right;
          max-width: 65%;
        }
        .action-buttons {
          display: flex;
          gap: 16px;
          width: 90%;
          margin: 20px auto;
        }
        .confirm-btn {
          flex: 1;
          padding: 14px;
          background: #4a9dfc;
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
        }
        .cancel-btn {
          flex: 1;
          padding: 14px;
          background: #f8f8f8;
          border: 1px solid #ccc;
          border-radius: 10px;
          font-size: 15px;
          cursor: pointer;
        }
        .manual-inputs {
          display: flex;
          gap: 12px;
        }
        .manual-inputs input {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
        .gps-btn {
          margin-top: 12px;
          padding: 14px;
          width: 100%;
          border: 1px solid #4a9dfc;
          background: #eaf3ff;
          color: #1d70f2;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default LocationSelectionPage;
