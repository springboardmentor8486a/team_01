import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardPage.css';
import Header from '../components/Header';
import totalIssuesIcon from '../assets/dashboardAssets/totalissues.png';
import pendingIcon from '../assets/dashboardAssets/pending.png';
import inProgressIcon from '../assets/dashboardAssets/inprogress.png';
import resolvedIcon from '../assets/dashboardAssets/resolved.png';
import potholeImg from '../assets/dashboardAssets/pothole.png';
import streetlightImg from '../assets/dashboardAssets/streetlight.png';
import garbageImg from '../assets/dashboardAssets/garbage.png';
import postIcon from '../assets/dashboardAssets/post.png';
import volunteerIcon from '../assets/dashboardAssets/volunteer.png';
import trackIcon from '../assets/dashboardAssets/track.png';
import feedbackIcon from '../assets/dashboardAssets/pofeedback.png';
import issueMapIcon from '../assets/dashboardAssets/issuemap.png';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/issues/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
            // Keep default values on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

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
                            <span>{loading ? '...' : stats.total}</span>
                        </div>
                        <img src={totalIssuesIcon} alt="Total Issues" className="stat-icon" />
                    </div>
                    <div className="stat-card">
                        <div className="card-header blue-header"></div>
                        <div className="card-body">
                            <p>pending</p>
                            <span>{loading ? '...' : stats.pending}</span>
                        </div>
                        <img src={pendingIcon} alt="Pending" className="stat-icon" />
                    </div>
                    <div className="stat-card">
                        <div className="card-header blue-header"></div>
                        <div className="card-body">
                            <p>In Progress</p>
                            <span>{loading ? '...' : stats.inProgress}</span>
                        </div>
                        <img src={inProgressIcon} alt="In Progress" className="stat-icon" />
                    </div>
                    <div className="stat-card">
                        <div className="card-header blue-header"></div>
                        <div className="card-body">
                            <p>Resolved</p>
                            <span>{loading ? '...' : stats.resolved}</span>
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

export default DashboardPage;
