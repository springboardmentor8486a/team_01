import React, { useState } from 'react';
import Header from '../components/Header';
import './DashboardPage.css';
import BackButton from '../components/BackButton';
import '../components/BackButton.css';
import Footer from '../components/Footer';

const TrackComplaintPage = () => {
    const [complaintId, setComplaintId] = useState('');
    const [trackingStatus, setTrackingStatus] = useState(null);

    const handleTrack = (e) => {
        e.preventDefault();
        setTrackingStatus(null);
        if (complaintId.trim() === '') {
            alert('Please enter a Complaint ID.');
            return;
        }

        // --- Mock API Call ---
        // Replace this with a real API call to your backend
        setTimeout(() => {
            if (complaintId.startsWith('PEND')) {
                setTrackingStatus({ id: complaintId, status: 'Pending Review', details: 'Awaiting assignment to a field officer.' });
            } else if (complaintId.startsWith('INP')) {
                setTrackingStatus({ id: complaintId, status: 'In Progress', details: 'Assigned to Officer ID #45. Scheduled for repair tomorrow.' });
            } else if (complaintId.startsWith('RES')) {
                setTrackingStatus({ id: complaintId, status: 'Resolved', details: 'Work completed and verified. Closed on 10/25/2025.' });
            } else {
                setTrackingStatus({ id: complaintId, status: 'Not Found', details: 'The entered complaint ID could not be found.' });
            }
        }, 1000);
    };

    return (
        <div className="page-container">
            <div className="content-wrap">
                <div className="user-dashboard-container">
                    <Header activePage="track" />
                    <main className="user-main-content">
                        <BackButton />
                        <div className="user-welcome-banner" style={{ textAlign: 'left', padding: '2rem 3rem' }}>
                            <h1>Track Your Complaint Status</h1>
                            <p>Enter your unique complaint ID to see the latest updates on its resolution.</p>
                        </div>
                        
                        <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
                            <h2>Complaint Tracker</h2>
                            <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                                <div className="form-row">
                                    <label htmlFor="complaintId">Complaint ID</label>
                                    <input 
                                        type="text" 
                                        id="complaintId" 
                                        value={complaintId}
                                        onChange={(e) => setComplaintId(e.target.value)}
                                        placeholder="e.g., PEND-12345" 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="save-btn" style={{ marginTop: '1rem', background: '#f59e0b', width: '200px' }}>
                                    Track Status
                                </button>
                            </form>

                            {trackingStatus && (
                                <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #dbeafe', borderRadius: '10px', background: '#eff6ff' }}>
                                    <h3>Status for ID: {trackingStatus.id}</h3>
                                    <p style={{ fontWeight: 'bold', color: '#1e40af' }}>Current Status: {trackingStatus.status}</p>
                                    <p>{trackingStatus.details}</p>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TrackComplaintPage;