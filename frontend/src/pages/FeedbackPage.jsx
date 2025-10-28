import React, { useState } from 'react';
import Header from '../components/Header';
import './DashboardPage.css';
import BackButton from '../components/BackButton';
import '../components/BackButton.css';
import Footer from '../components/Footer';

const FeedbackPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend API
        console.log('Feedback Submitted!'); 
        setIsSubmitted(true);
        // Clear form fields if necessary
    };

    return (
        <div className="page-container">
            <div className="content-wrap">
                <div className="user-dashboard-container">
                    <Header activePage="feedback" />
                    <main className="user-main-content">
                        <BackButton />
                        <div className="user-welcome-banner" style={{ textAlign: 'left', padding: '2rem 3rem' }}>
                            <h1>Share Your **Feedback**</h1>
                            <p>Your input helps us improve service quality and efficiency.</p>
                        </div>
                        
                        <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
                            <h2>Service Feedback Form</h2>
                            {isSubmitted ? (
                                <div style={{ padding: '2rem', textAlign: 'center', background: '#dcfce7', color: '#15803d', borderRadius: '10px' }}>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Thank you for your valuable feedback!</p>
                                    <p>We appreciate you taking the time to help us improve.</p>
                                    <button 
                                        className="save-btn" 
                                        style={{ marginTop: '1rem', background: '#3b82f6' }}
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Submit Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                                    <div className="form-row">
                                        <label htmlFor="service">Related Service/Issue (Optional)</label>
                                        <input type="text" id="service" placeholder="e.g., Pothole repair, response time" />
                                    </div>
                                    <div className="form-row">
                                        <label htmlFor="rating">Overall Satisfaction Rating</label>
                                        <select id="rating" required>
                                            <option value="">Select a rating</option>
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="3">3 - Good</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="1">1 - Poor</option>
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <label htmlFor="comments">Comments / Suggestions</label>
                                        <textarea id="comments" rows="5" placeholder="Please provide details about your experience..." required></textarea>
                                    </div>
                                    <button type="submit" className="save-btn" style={{ marginTop: '1rem', background: '#2563eb', width: '200px' }}>
                                        Post Feedback
                                    </button>
                                </form>
                            )}
                        </section>
                    </main>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default FeedbackPage;