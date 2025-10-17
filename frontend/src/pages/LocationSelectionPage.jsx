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
    address:
      "Raja Muthiah Road, CMWSSB Division 58, Ward 58, Royapuram, Chennai, Tamil Nadu, 600001, India",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
  });

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
          country: addr.country || "Not specified",
        });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddressDetails({
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        city: "Not available",
        state: "Not available",
        country: "Not available",
      });
    }
  };

  useEffect(() => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
      getAddressFromCoordinates(lat, lng);
    }
  }, [manualLat, manualLng]);

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
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to retrieve your location.");
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
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
        country: addressDetails.country,
      },
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        setPosition([newLat, newLng]);
        setManualLat(newLat.toFixed(6));
        setManualLng(newLng.toFixed(6));
        getAddressFromCoordinates(newLat, newLng);
      } else {
        alert("Location not found! Try a different search term.");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Error fetching location! Check your connection and try again.");
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch(e);
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
          onKeyPress={handleKeyPress}
        />
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? "..." : "🔍"}
        </button>
      </form>

      {/* Map */}
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
        <button
          className="gps-button"
          onClick={handleUseCurrentLocation}
          disabled={loading}
          title="Use Current Location"
        >
          {loading ? "⌛ Detecting..." : "Use Current Location"}
        </button>
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

          {/* Coordinates */}
          <div className="info-row coordinates-row">
            <span className="label">Coordinates</span>
            <span className="value">
              <div className="coord-boxes">
                <div className="coord-box">
                  <div className="coord-number">{position[0].toFixed(6)}</div>
                  <div className="coord-label">Latitude</div>
                </div>
                <div className="coord-box">
                  <div className="coord-number">{position[1].toFixed(6)}</div>
                  <div className="coord-label">Longitude</div>
                </div>
              </div>
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
        <h2>Manual Coordinate Entry</h2>
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
      </div>

      {/* Footer */}
      <div className="footer-links">
        <span className="footer-link">Report a problem</span>
        <span className="footer-separator">|</span>
        <span className="footer-link">© OpenStreetMap contributors</span>
      </div>

      <div className="tip-box">
        <strong>Tip:</strong> Use the search bar to find a location, click "Use Current
        Location" on the map, or manually enter coordinates.
      </div>

      {/* Inline CSS */}
      <style>{`
        .location-page { background: #e2ecfbff; font-family: "Segoe UI", Arial, sans-serif; color: #1d1d1f; min-height: 100vh; padding-bottom: 30px; }
        .location-header { background: #4a9dfc; color: white; padding: 30px 40px; }
        .location-header h1 { font-size: 24px; margin: 10px 0; }
        .location-header p { font-size: 14px; opacity: 0.9; }
        .back-btn { background: transparent; border: none; color: white; font-size: 18px; cursor: pointer; }
        .search-box { display: flex; align-items: center; background: white; margin: 20px auto; width: 90%; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden; }
        .search-box input { flex: 1; border: none; padding: 14px; font-size: 15px; outline: none; }
        .search-box .search-btn { background: #4a9dfc; color: white; padding: 14px 20px; border: none; cursor: pointer; min-width: 60px; }
        .map-section { width: 90%; margin: 0 auto; height: 320px; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: relative; }
        .map-section iframe { width: 100%; height: 100%; }
        .gps-button { position: absolute; bottom: 12px; right: 12px; background: #007AFF; color: white; border: none; border-radius: 20px; padding: 10px 16px; font-size: 14px; font-weight: 500; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.3); z-index: 1000; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
        .gps-button:hover { background: #0056CC; }
        .gps-button:disabled { opacity: 0.7; cursor: not-allowed; background: #666; }
        .location-card, .manual-card { background: white; border-radius: 12px; padding: 20px; width: 90%; margin: 20px auto; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .location-card h2, .manual-card h2 { margin-bottom: 16px; font-size: 18px; font-weight: 600; color: #333; }
        .location-info { display: flex; flex-direction: column; gap: 12px; }
        .info-row { display: flex; justify-content: space-between; padding: 12px; background: #f9fbff; border-radius: 8px; }
        .info-row .label { font-weight: 500; color: #555; }
        .info-row .value { font-weight: 300; color: #222; text-align: right; max-width: 65%; }
        .coordinates-row .value { display: flex; gap: 12px; justify-content: flex-end; }
        .coord-boxes { display: flex; gap: 12px; }
        .coord-box { background: #e8f0ff; border-radius: 6px; padding: 6px 10px; text-align: center; min-width: 80px; }
        .coord-number { font-weight: 500; }
        .coord-label { font-size: 12px; color: #555; margin-top: 2px; }
        .action-buttons { display: flex; gap: 16px; width: 90%; margin: 20px auto; }
        .confirm-btn { flex: 1; padding: 14px; background: #4a9dfc; border: none; border-radius: 10px; color: white; font-size: 15px; font-weight: bold; cursor: pointer; }
        .cancel-btn { flex: 1; padding: 14px; background: #f8f8f8; border: 1px solid #ccc; border-radius: 10px; font-size: 15px; cursor: pointer; }
        .manual-inputs { display: flex; gap: 12px; }
        .manual-inputs input { flex: 1; font-size:13px; font-weight:100; padding: 12px; border-radius: 8px; border: 1px solid #ccc; }
        .footer-links { display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 14px; color: #666; margin: 20px auto; width: 90%; }
        .tip-box { padding: 16px; background: #f0f8ff; border-left: 4px solid #007AFF; font-size: 14px; line-height: 1.5; color: #333; width: 90%; margin: 0 auto; border-radius: 8px; }
      `}</style>
    </div>
  );
};

export default LocationSelectionPage;
