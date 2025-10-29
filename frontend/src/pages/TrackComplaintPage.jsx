import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import './DashboardPage.css';
import BackButton from '../components/BackButton';
import '../components/BackButton.css';
import Footer from '../components/Footer';

const TrackComplaintPage = () => {
    const [complaintId, setComplaintId] = useState('');
    const [trackingStatus, setTrackingStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    const getStatusDetails = useCallback((status) => {
        switch (status) {
            case 'Pending':
                return 'Your complaint has been received and is awaiting review by our team.';
            case 'In Progress':
                return 'Your complaint is currently being processed and worked on by our field team.';
            case 'Resolved':
                return 'Your complaint has been successfully resolved. Thank you for reporting!';
            default:
                return 'Status information is not available.';
        }
    }, []);

    const handleTrackById = useCallback(async (id) => {
        setLoading(true);
        setTrackingStatus(null);
        
        try {
            const response = await axios.get(`http://localhost:3000/api/issues/track/${id}`);
            const issue = response.data;
            
            setTrackingStatus({
                id: issue.complaintId,
                status: issue.status,
                title: issue.title,
                type: issue.type,
                address: issue.address,
                landmark: issue.landmark,
                createdAt: new Date(issue.createdAt).toLocaleDateString(),
                details: getStatusDetails(issue.status)
            });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setTrackingStatus({
                    id: id,
                    status: 'Not Found',
                    details: 'The entered complaint ID could not be found in our system.'
                });
            } else {
                alert('Error tracking complaint. Please try again.');
                console.error('Tracking error:', error);
            }
        } finally {
            setLoading(false);
        }
    }, [getStatusDetails]);

    useEffect(() => {
        const cidFromUrl = searchParams.get('cid');
        if (cidFromUrl) {
            setComplaintId(cidFromUrl);
            handleTrackById(cidFromUrl);
        }
    }, [searchParams, handleTrackById]);

    const handleTrack = (e) => {
        e.preventDefault();
        if (complaintId.trim() === '') {
            alert('Please enter a Complaint ID.');
            return;
        }
        handleTrackById(complaintId.trim());
    };

    return (
        <div className="page-container">
            <div className="content-wrap">
                <div className="user-dashboard-container">
                    <Header />
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

                            {loading && (
                                <div style={{ marginTop: '2rem', padding: '1.5rem', textAlign: 'center' }}>
                                    <p>Searching for complaint...</p>
                                </div>
                            )}

                            {trackingStatus && (
                                <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #dbeafe', borderRadius: '10px', background: '#eff6ff' }}>
                                    <h3>Complaint Details</h3>
                                    <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
                                        <p><strong>Complaint ID:</strong> {trackingStatus.id}</p>
                                        <p><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: trackingStatus.status === 'Resolved' ? '#059669' : trackingStatus.status === 'In Progress' ? '#d97706' : trackingStatus.status === 'Pending' ? '#dc2626' : '#6b7280' }}>{trackingStatus.status}</span></p>
                                        {trackingStatus.title && <p><strong>Title:</strong> {trackingStatus.title}</p>}
                                        {trackingStatus.type && <p><strong>Type:</strong> {trackingStatus.type}</p>}
                                        {trackingStatus.address && <p><strong>Address:</strong> {trackingStatus.address}</p>}
                                        {trackingStatus.landmark && <p><strong>Landmark:</strong> {trackingStatus.landmark}</p>}
                                        {trackingStatus.createdAt && <p><strong>Reported On:</strong> {trackingStatus.createdAt}</p>}
                                        <p><strong>Details:</strong> {trackingStatus.details}</p>
                                    </div>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TrackComplaintPage;