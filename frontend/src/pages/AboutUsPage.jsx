import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './DashboardPage.css'; // Reusing styles for consistency

const AboutUsPage = () => {
    return (
        <div className="page-container">
            <div className="content-wrap">
                <div className="user-dashboard-container">
                    <Header activePage="about-us" />
                    <main className="user-main-content">
                        <div className="user-welcome-banner" style={{ textAlign: 'left', padding: '2rem 3rem' }}>
                            <h1>About **Clean Street**</h1>
                            <p>Learn more about our mission to create cleaner, safer, and more beautiful communities.</p>
                        </div>

                        <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
                            <h2>Our Mission</h2>
                            <p style={{ lineHeight: '1.6' }}>
                                At Clean Street, our mission is to empower citizens to take an active role in maintaining and improving their local environment. We provide a simple and effective platform for reporting civic issues, tracking their resolution, and fostering a sense of community ownership and pride.
                            </p>
                        </section>

                        <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
                            <h2>Our Vision</h2>
                            <p style={{ lineHeight: '1.6' }}>
                                We envision a future where every street is clean, every public space is well-maintained, and every citizen feels connected to their community. By bridging the gap between residents and local authorities, we aim to make our cities more responsive, transparent, and livable for everyone.
                            </p>
                        </section>

                        <section style={{ padding: '2rem 0', marginBottom: '2rem' }}>
                            <h2>How It Works</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                                {/* Card 1 */}
                                <div className="how-it-works-card">
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3B82F6', marginBottom: '0.5rem' }}>1.</div>
                                    <h3 style={{ marginTop: '0', marginBottom: '0.5rem', fontSize: '1.2rem', color: '#1e3a8a' }}>Report an Issue</h3>
                                    <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.5' }}>
                                        See a pothole, broken streetlight, or overflowing garbage? Snap a photo and report it in seconds through our app.
                                    </p>
                                </div>

                                {/* Card 2 */}
                                <div className="how-it-works-card">
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3B82F6', marginBottom: '0.5rem' }}>2.</div>
                                    <h3 style={{ marginTop: '0', marginBottom: '0.5rem', fontSize: '1.2rem', color: '#1e3a8a' }}>Track Progress</h3>
                                    <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.5' }}>
                                        Receive real-time updates as your report is reviewed, assigned, and resolved by the concerned authorities.
                                    </p>
                                </div>

                                {/* Card 3 */}
                                <div className="how-it-works-card">
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3B82F6', marginBottom: '0.5rem' }}>3.</div>
                                    <h3 style={{ marginTop: '0', marginBottom: '0.5rem', fontSize: '1.2rem', color: '#1e3a8a' }}>Engage with Community</h3>
                                    <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.5' }}>
                                        Upvote existing issues to highlight their urgency and see what others in your area are reporting.
                                    </p>
                                </div>

                                {/* Card 4 */}
                                <div className="how-it-works-card">
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3B82F6', marginBottom: '0.5rem' }}>4.</div>
                                    <h3 style={{ marginTop: '0', marginBottom: '0.5rem', fontSize: '1.2rem', color: '#1e3a8a' }}>Volunteer</h3>
                                    <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.5' }}>
                                        Join local clean-up drives and community events to make a hands-on difference.
                                    </p>
                                </div>
                            </div>
                        </section>

                        
                    </main>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default AboutUsPage;