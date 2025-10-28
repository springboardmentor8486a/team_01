import React from 'react';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import './DashboardPage.css';
import Footer from '../components/Footer';

const IssueMapPage = () => {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <div className="user-dashboard-container">
                    <Header activePage="issuemap" />
                    <main className="user-main-content">
                        <BackButton />
                        <div className="user-welcome-banner" style={{ textAlign: 'left', padding: '2rem 3rem' }}>
                            <h1>Live Issue Map</h1>
                            <p>View all reported issues across the city in real-time.</p>
                        </div>
                        
                        <section style={{ padding: '0', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
                            {/* Placeholder for a Map component (e.g., Google Maps or Leaflet) */}
                            <div style={{ height: '70vh', width: '100%', borderRadius: '15px', overflow: 'hidden' }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2799160891!2d-74.25986613524472!3d40.69767006338158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1629885786851!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </section>
                    </main>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default IssueMapPage;