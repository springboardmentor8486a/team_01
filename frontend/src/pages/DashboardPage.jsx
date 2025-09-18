import React from 'react';
import './DashboardPage.css';
import Header from '../components/Header';

// --- IMPORTANT ---
// The icons in the new design are different.
// You will need to replace your old icon files with these new ones.
// I am using the same variable names for convenience.
import totalIssuesIcon from '../assets/totalissues.png';
import pendingIcon from '../assets/pending.png';
import inProgressIcon from '../assets/inprogress.png';
import resolvedIcon from '../assets/resolved.png';
import potholeImg from '../assets/pothole.png';
import streetlightImg from '../assets/streetlight.png';
import garbageImg from '../assets/garbage.png';
import postIcon from '../assets/post.png';
import volunteerIcon from '../assets/volunteer.png';
import trackIcon from '../assets/track.png';
import feedbackIcon from '../assets/pofeedback.png';
import issueMapIcon from '../assets/issuemap.png';

const HomePage = () => {
    const handleActionClick = (action) => {
        alert(`${action} button clicked!`);
    };

    return (
        <div className="dashboard-container">
            <Header activePage="dashboard" />

            <main className="main-content">
                <div className="welcome-banner">
                    <h1>Hello, welcome to <strong>Clean Street!</strong></h1>
                    <p>Here are some actions for you</p>
                </div>

                <section className="stats-container">
                    <div className="stat-card">
                        <div className="card-header blue-header"></div>
                        <div className="card-body">
                            <p>Total Issues</p>
                            <span>4</span>
                        </div>
                        <img src={totalIssuesIcon} alt="Total Issues" className="stat-icon" />
                    </div>
                    <div className="stat-card">
                        <div className="card-header blue-header"></div>
                        <div className="card-body">
                            <p>pending</p>
                            <span>1</span>
                        </div>
                        <img src={pendingIcon} alt="Pending" className="stat-icon" />
                    </div>
                    <div className="stat-card">
                        <div className="card-header blue-header"></div>
                        <div className="card-body">
                            <p>In Progress</p>
                            <span>3</span>
                        </div>
                        <img src={inProgressIcon} alt="In Progress" className="stat-icon" />
                    </div>
                    <div className="stat-card">
                        <div className="card-header blue-header"></div>
                        <div className="card-body">
                            <p>Resolved</p>
                            <span>2</span>
                        </div>
                        <img src={resolvedIcon} alt="Resolved" className="stat-icon" />
                    </div>
                </section>

                <div className="dashboard-body">
                    <section className="recent-activity-section">
                        <h2>Recent Activity</h2>
                        <div className="activity-list">
                            <button className="activity-item" onClick={() => handleActionClick('Pothole activity')}>
                                <img src={potholeImg} alt="Pothole" />
                                <div className="activity-details">
                                    <span className="activity-title">Pothole on Main Street Resolved</span>
                                    <span className="activity-time">2 hours ago</span>
                                </div>
                            </button>
                            <button className="activity-item" onClick={() => handleActionClick('Streetlight activity')}>
                                <img src={streetlightImg} alt="Streetlight" />
                                <div className="activity-details">
                                    <span className="activity-title">New streetlight issue reported</span>
                                    <span className="activity-time">16 hours ago</span>
                                </div>
                            </button>
                            <button className="activity-item" onClick={() => handleActionClick('Garbage activity')}>
                                <img src={garbageImg} alt="Garbage" />
                                <div className="activity-details">
                                    <span className="activity-title">Garbage dump complaint updated</span>
                                    <span className="activity-time">19 hours ago</span>
                                </div>
                            </button>
                        </div>
                    </section>

                    <section className="quick-actions-section">
                        <h2>Quick Actions</h2>
                        <div className="actions-list">
                            <button className="action-button" onClick={() => handleActionClick('Post a complaint')}>
                                <span className="action-icon-wrapper"><img src={postIcon} alt="" className="action-icon" /></span>
                                Post a complaint
                            </button>
                            <button className="action-button" onClick={() => handleActionClick('Volunteer')}>
                                <span className="action-icon-wrapper"><img src={volunteerIcon} alt="" className="action-icon" /></span>
                                volunteer
                            </button>
                            <button className="action-button" onClick={() => handleActionClick('Track your complaint')}>
                                <span className="action-icon-wrapper"><img src={trackIcon} alt="" className="action-icon" /></span>
                                Track your complaint
                            </button>
                            <button className="action-button" onClick={() => handleActionClick('Post your Feedback')}>
                                <span className="action-icon-wrapper"><img src={feedbackIcon} alt="" className="action-icon" /></span>
                                Post your FeedBack
                            </button>
                        </div>
                        <button className="issue-map-button" onClick={() => handleActionClick('Issue Map')}>
                            <span className="action-icon-wrapper"><img src={issueMapIcon} alt="" className="action-icon" /></span>
                            Issue Map
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default HomePage;