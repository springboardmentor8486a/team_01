import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationSelectionPage = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState([13.082700, 80.270700]);
  const [manualLat, setManualLat] = useState("13.0827");
  const [manualLng, setManualLng] = useState("80.2707");
  const [address, setAddress] = useState("Raja Muthiah Road, CMWSSB Division 58, Ward 58, Zaris S Royapuram, Chennai, Tamil Nadu, 600001, India");

  // Update coordinates when manual inputs change
  useEffect(() => {
    setPosition([parseFloat(manualLat) || 13.082700, parseFloat(manualLng) || 80.270700]);
  }, [manualLat, manualLng]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPosition([lat, lng]);
          setManualLat(lat.toFixed(6));
          setManualLng(lng.toFixed(6));
          
          // Reverse geocoding to get address (simulated)
          setTimeout(() => {
            setAddress("Current Location - GPS Coordinates");
          }, 500);
        },
        (error) => {
          alert('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleConfirmLocation = () => {
    navigate('/register-complaint', {
      state: {
        latitude: position[0],
        longitude: position[1],
        address: address
      }
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Map click handler component
  function MapClickHandler({ setPosition, setManualLat, setManualLng }) {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        setManualLat(lat.toFixed(6));
        setManualLng(lng.toFixed(6));
        
        // Simulate reverse geocoding
        setTimeout(() => {
          setAddress(`Selected Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }, 300);
      },
    });
    return null;
  }

  return (
    <div style={styles.container}>
      {/* Brand Header */}
      <div style={styles.brandHeader}>
        <div style={styles.brandName}>VEDETY</div>
      </div>

      {/* Location List */}
      <div style={styles.locationList}>
        <div style={styles.locationItem}>
          <div style={styles.locationName}>Maineer</div>
          <div style={styles.locationAddress}>Cobory</div>
        </div>
        <div style={styles.locationItem}>
          <div style={styles.locationName}>Central Medical Depot</div>
          <div style={styles.locationAddress}>SHU86</div>
        </div>
        <div style={styles.locationItem}>
          <div style={styles.locationName}>Primary</div>
        </div>
        <div style={styles.locationItem}>
          <div style={styles.locationName}>Chemical Suburban Terminal (Moore Alkacker Complex)</div>
          <div style={styles.locationAddress}>Chamal</div>
          <div style={styles.locationAddress}>Shennai</div>
          <div style={styles.locationAddress}>Kreming Bazaar</div>
        </div>
        <div style={styles.locationItem}>
          <div style={styles.locationName}>Chemical Short-Terms</div>
          <div style={styles.locationAddress}>Murturwamy</div>
          <div style={styles.locationAddress}>Fort St. George</div>
        </div>
        <div style={styles.locationItem}>
          <div style={styles.locationName}>Chemical Unit, Town Bound Ground Road</div>
          <div style={styles.locationAddress}>SHU88</div>
        </div>
        <div style={styles.locationItem}>
          <div style={styles.locationName}>Shared Grounds</div>
          <div style={styles.locationAddress}>Island Group</div>
        </div>
        <div style={styles.currentLocationItem} onClick={handleUseCurrentLocation}>
          Use Current Location
        </div>
      </div>

      {/* Footer Links */}
      <div style={styles.footerLinks}>
        <span style={styles.footerLink}>Report a problem</span>
        <span style={styles.footerSeparator}>|</span>
        <span style={styles.footerLink}>OpenStreetMap contributors</span>
      </div>

      <div style={styles.separator}></div>

      {/* Coordinates Section */}
      <div style={styles.coordinatesSection}>
        <h2 style={styles.sectionTitle}>Coordinates</h2>
        <div style={styles.coordinateItem}>
          <span style={styles.coordinateLabel}>Latitude</span>
          <span style={styles.coordinateValue}>{position[0].toFixed(6)}</span>
        </div>
        <div style={styles.coordinateItem}>
          <span style={styles.coordinateLabel}>Longitude</span>
          <span style={styles.coordinateValue}>{position[1].toFixed(6)}</span>
        </div>
      </div>

      <div style={styles.separator}></div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button style={styles.confirmButton} onClick={handleConfirmLocation}>
          Confirm Location
        </button>
        <button style={styles.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
      </div>

      {/* Tip Box */}
      <div style={styles.tipBox}>
        <strong>Tip:</strong> Use the search bar to find a location, click "Use Current Location" to detect your GPS position, or manually enter coordinates. The map will update automatically.
      </div>

      <div style={styles.separator}></div>

      {/* Manual Coordinate Entry */}
      <div style={styles.manualCoordinates}>
        <h2 style={styles.sectionTitle}>Manual Coordinate Entry</h2>
        <div style={styles.coordinateInputs}>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Latitude</label>
            <input
              type="text"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              style={styles.coordinateInput}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Longitude</label>
            <input
              type="text"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              style={styles.coordinateInput}
            />
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={handleBack}>
          <span style={styles.backArrow}>←</span>
        </button>
        <h1 style={styles.headerTitle}>Select Location</h1>
      </div>

      {/* Search Section */}
      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="Search for a location or use your current GPS position"
          style={styles.searchInput}
        />
        <input
          type="text"
          placeholder="Search for a location (e.g., Chennai, Tamil Nadu)"
          style={styles.searchInput}
        />
      </div>

      {/* Map Section */}
      <div style={styles.mapContainer}>
        <MapContainer 
          center={position} 
          zoom={13} 
          style={styles.leafletMap}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              Selected Location <br /> 
              Lat: {position[0].toFixed(6)} <br />
              Lng: {position[1].toFixed(6)}
            </Popup>
          </Marker>
          <MapClickHandler 
            setPosition={setPosition} 
            setManualLat={setManualLat}
            setManualLng={setManualLng}
          />
        </MapContainer>
      </div>

      {/* Weather Info */}
      <div style={styles.weatherInfo}>
        <span style={styles.temperature}>32°C</span>
        <span style={styles.weatherDesc}>Mostly clear</span>
      </div>

      {/* Location Details */}
      <div style={styles.locationDetails}>
        <h2 style={styles.sectionTitle}>Location Details</h2>
        
        <div style={styles.detailItem}>
          <label style={styles.detailLabel}>Address</label>
          <div style={styles.detailValue}>
            {address}
          </div>
        </div>
        
        <div style={styles.detailRow}>
          <div style={styles.detailItem}>
            <label style={styles.detailLabel}>City</label>
            <div style={styles.detailValue}>Chennai</div>
          </div>
          <div style={styles.detailItem}>
            <label style={styles.detailLabel}>State</label>
            <div style={styles.detailValue}>Tamil Nadu</div>
          </div>
        </div>
        
        <div style={styles.detailItem}>
          <label style={styles.detailLabel}>Country</label>
          <div style={styles.detailValue}>India</div>
        </div>
        
        <div style={styles.detailItem}>
          <label style={styles.detailLabel}>Coordinates</label>
          <div style={styles.coordinateDetails}>
            <div style={styles.coordinateLine}>Latitude: {position[0].toFixed(6)}</div>
            <div style={styles.coordinateLine}>Longitude: {position[1].toFixed(6)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#1d1d1f',
    lineHeight: 1.4,
    paddingBottom: '20px',
  },
  brandHeader: {
    padding: '20px 20px 16px 20px',
    borderBottom: '1px solid #e5e5e7',
    backgroundColor: '#ffffff',
  },
  brandName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1d1d1f',
    textAlign: 'left',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e5e7',
    backgroundColor: '#ffffff',
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#007AFF',
    cursor: 'pointer',
    padding: '8px',
    marginRight: '12px',
  },
  backArrow: {
    display: 'block',
    width: '24px',
    height: '24px',
    textAlign: 'center',
    lineHeight: '24px',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1d1d1f',
    margin: 0,
  },
  searchSection: {
    padding: '20px',
    borderBottom: '1px solid #e5e5e7',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e5e5e7',
    borderRadius: '10px',
    fontSize: '16px',
    marginBottom: '12px',
    backgroundColor: '#f8f9fa',
  },
  mapContainer: {
    height: '250px',
    position: 'relative',
    borderBottom: '1px solid #e5e5e7',
  },
  leafletMap: {
    height: '100%',
    width: '100%',
  },
  weatherInfo: {
    padding: '12px 20px',
    borderBottom: '1px solid #e5e5e7',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  temperature: {
    fontSize: '16px',
    fontWeight: '600',
  },
  weatherDesc: {
    fontSize: '16px',
    color: '#666666',
  },
  locationList: {
    padding: '0 20px',
    borderBottom: '1px solid #e5e5e7',
  },
  locationItem: {
    padding: '16px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  locationName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  locationAddress: {
    fontSize: '14px',
    color: '#666666',
  },
  currentLocationItem: {
    padding: '16px 0',
    color: '#007AFF',
    fontWeight: '500',
    cursor: 'pointer',
  },
  footerLinks: {
    padding: '16px 20px',
    borderBottom: '1px solid #e5e5e7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666666',
  },
  footerLink: {
    cursor: 'pointer',
  },
  footerSeparator: {
    color: '#cccccc',
  },
  separator: {
    height: '1px',
    backgroundColor: '#e5e5e7',
    margin: '0 20px',
  },
  coordinatesSection: {
    padding: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1d1d1f',
  },
  coordinateItem: {
    marginBottom: '12px',
    display: 'flex',
    flexDirection: 'column',
  },
  coordinateLabel: {
    fontSize: '14px',
    color: '#666666',
    marginBottom: '4px',
  },
  coordinateValue: {
    fontSize: '16px',
    color: '#1d1d1f',
  },
  actionButtons: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    color: '#ffffff',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#007AFF',
    border: '1px solid #e5e5e7',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tipBox: {
    padding: '16px 20px',
    backgroundColor: '#f0f8ff',
    borderLeft: '4px solid #007AFF',
    margin: '0 20px',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  manualCoordinates: {
    padding: '20px',
  },
  coordinateInputs: {
    display: 'flex',
    gap: '16px',
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#666666',
    marginBottom: '8px',
  },
  coordinateInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e5e5e7',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#f8f9fa',
  },
  locationDetails: {
    padding: '20px',
  },
  detailItem: {
    marginBottom: '16px',
  },
  detailRow: {
    display: 'flex',
    gap: '20px',
  },
  detailLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#666666',
    marginBottom: '4px',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '16px',
    color: '#1d1d1f',
  },
  coordinateDetails: {
    marginTop: '4px',
  },
  coordinateLine: {
    fontSize: '16px',
    color: '#1d1d1f',
    marginBottom: '2px',
  },
};

export default LocationSelectionPage;
