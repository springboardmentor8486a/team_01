import React from 'react';
import Header from '../components/Header';
import './DashboardPage.css'; // Import the same CSS for consistent look
import BackButton from '../components/BackButton';
import '../components/BackButton.css';
import Footer from '../components/Footer';
import VolunteerForm from '../components/VolunteerForm';

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
                            <VolunteerForm />
                        </section>
                    </main>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default VolunteerPage;
