import React from 'react';
import Header from '../components/Header';
import './DashboardPage.css'; // Import the same CSS for consistent look
import BackButton from '../components/BackButton';
import '../components/BackButton.css';
import Footer from '../components/Footer';

const VolunteerPage = () => {
    return (
        // The overall page container is typically used for full-page layout (Header, Content, Footer)
        <div className="page-container">
            <div className="content-wrap">
                <div className="user-dashboard-container">
                    <Header activePage="volunteer" />
                    <main className="user-main-content">
                        {/* 🌟 PLACEMENT: The BackButton is now directly before the title banner. 🌟 */}
                        <BackButton /> 
                        
                        <div className="user-welcome-banner" style={{ textAlign: 'left', padding: '2rem 3rem' }}>
                            <h1>Become a Clean Street Volunteer</h1>
                            <p>Help your community by dedicating some time to local clean-up and awareness efforts.</p>
                        </div>
                        
                        <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
                            <h2>Volunteer Registration</h2>
                            <p>Please fill out the form below to register your interest in volunteering. We'll contact you with upcoming opportunities.</p>
                            {/* Simplified Volunteer Form Placeholder */}
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                                <div className="form-row">
                                    <label htmlFor="name">Full Name</label>
                                    <input type="text" id="name" placeholder="John Doe" required />
                                </div>
                                <div className="form-row">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="john@example.com" required />
                                </div>
                                <div className="form-row">
                                    <label htmlFor="area">Preferred Area / Locality</label>
                                    <input type="text" id="area" placeholder="Central City Ward 5" />
                                </div>
                                <div className="form-row">
                                    <label htmlFor="skills">Relevant Skills (Optional)</label>
                                    <textarea id="skills" rows="3" placeholder="e.g., First Aid, Event Organization, Public Speaking"></textarea>
                                </div>
                                <button type="submit" className="save-btn" style={{ marginTop: '1rem', background: '#22c55e', width: '200px' }}>
                                    Submit Volunteer Form
                                </button>
                            </form>
                        </section>
                    </main>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default VolunteerPage;
