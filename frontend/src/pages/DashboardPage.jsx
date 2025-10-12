import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardPage.css';
import Header from '../components/Header';
import { Plus, Calendar, Eye, AlertTriangle as AlertTriangleIcon, FileClock, BarChart3, CheckCircle } from 'lucide-react';

// Your original icon imports
import totalIssuesIcon from '../assets/dashboardAssets/totalissues.png';
import pendingIcon from '../assets/dashboardAssets/pending.png';
import inProgressIcon from '../assets/dashboardAssets/inprogress.png';
import resolvedIcon from '../assets/dashboardAssets/resolved.png';
import postIcon from '../assets/dashboardAssets/post.png';
import volunteerIcon from '../assets/dashboardAssets/volunteer.png';
import trackIcon from '../assets/dashboardAssets/track.png';
import feedbackIcon from '../assets/dashboardAssets/pofeedback.png';
import issueMapIcon from '../assets/dashboardAssets/issuemap.png';

// Your original images for recent activity
import potholeImgOld from '../assets/dashboardAssets/pothole.png';
import streetlightImgOld from '../assets/dashboardAssets/streetlight.png';
import garbageImgOld from '../assets/dashboardAssets/garbage.png';

// NEW: Import images for the new issue cards
import potholeImgCard from '../assets/dashboardAssets/pothole-card.jpeg'; // Ensure you have these images
import streetlightImgCard from '../assets/dashboardAssets/streetlight-card.jpeg';
import garbageImgCard from '../assets/dashboardAssets/garbage-card.jpg';


const DashboardPage = () => {
    const [stats, setStats] = useState({ total: 3, pending: 1, inReview: 1, resolved: 1 });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // NEW MOCK DATA for the "My Reported Issues" section
    const mockReportedIssues = [
        { id: 1, title: 'Large Pothole on Main Street', description: 'There is a significant pothole on Main Street near the intersection with Oak Avenue. It\'s approximately 2 feet...', image: potholeImgCard, status: 'in review', category: 'pothole', date: '3/10/2025' },
        { id: 2, title: 'Broken Streetlight on Park Avenue', description: 'The streetlight at the corner of Park Avenue and 5th Street has been non-functional for over two weeks. Thi...', image: streetlightImgCard, status: 'received', category: 'streetlight', date: '24/9/2025' },
        { id: 3, title: 'Illegal Garbage Dumping at River Park', description: 'Multiple bags of household waste and construction debris have been illegally dumped at the entrance of...', image: garbageImgCard, status: 'resolved', category: 'garbage', date: '8/9/2025' }
    ];

    useEffect(() => {
        // Your existing fetchStats can remain here if you use it
    }, []);

    const handleActionClick = (action) => {
        if (action === 'Post a complaint') {
            navigate('/register-complaint');
        } else {
            alert(`${action} button clicked!`);
        }
    };

    // NEW HANDLER for clicking on an issue card
    const handleViewDetails = (issueId) => {
        navigate(`/complaint/${issueId}`);
    };

    // NEW HELPER FUNCTIONS for styling the issue cards
    const getIssueCardClass = (status) => {
        switch(status) {
            case 'in review': return 'issue-card in-review';
            case 'received': return 'issue-card received';
            case 'resolved': return 'issue-card resolved';
            default: return 'issue-card';
        }
    };
    
    const getStatusTag = (status) => {
        switch(status) {
            case 'in review': return { class: 'tag status-in-review', icon: <AlertTriangleIcon className="icon" /> };
            case 'received': return { class: 'tag status-received', icon: <FileClock className="icon" /> };
            case 'resolved': return { class: 'tag status-resolved', icon: <CheckCircle className="icon" /> };
            default: return { class: 'tag', icon: null };
        }
    };

    return (
        <div className="user-dashboard-container">
            <Header activePage="dashboard" />

            <main className="main-content">
                {/* --- YOUR EXISTING WELCOME BANNER (UNCHANGED) --- */}
                <div className="welcome-banner">
                    <h1>Hello, welcome to <strong>Clean Street!</strong></h1>
                    <p>Here are some actions for you</p>
                </div>

                {/* --- YOUR EXISTING STATS CARDS (MODIFIED TO USE LUCIDE ICONS) --- */}
                <section className="stats-container">
                    <div className="stat-card">
                        <div className="card-header blue-header"></div>
                        <div className="card-body">
                            <p>Total Issues</p>
                            <span>{loading ? '...' : stats.total}</span>
                        </div>
                        <AlertTriangleIcon className="stat-icon" />
                    </div>
                    <div className="stat-card">
                        <div className="card-header blue-header"></div>
                        <div className="card-body">
                            <p>Pending</p>
                            <span>{loading ? '...' : stats.pending}</span>
                        </div>
                        <FileClock className="stat-icon" />
                    </div>
                    <div className="stat-card">
                        <div className="card-header blue-header"></div>
                        <div className="card-body">
                            <p>In Review</p>
                            <span>{loading ? '...' : stats.inReview}</span>
                        </div>
                        <BarChart3 className="stat-icon" />
                    </div>
                    <div className="stat-card">
                        <div className="card-header blue-header"></div>
                        <div className="card-body">
                            <p>Resolved</p>
                            <span>{loading ? '...' : stats.resolved}</span>
                        </div>
                        <CheckCircle className="stat-icon" />
                    </div>
                </section>

                {/* 
                ================================================================
                  NEW "MY REPORTED ISSUES" SECTION (INTEGRATED)
                ================================================================
                */}
                <section className="issues-section">
                    <div className="issues-header">
                        <h2>Reported Issues</h2>
                        <button className="report-new-issue-btn" onClick={() => navigate('/register-complaint')}>
                            <Plus className="icon" />
                            Report New Issue
                        </button>
                    </div>
                    <div className="issues-grid">
                        {mockReportedIssues.map(issue => {
                            const statusTag = getStatusTag(issue.status);
                            return (
                                <div key={issue.id} className={getIssueCardClass(issue.status)} onClick={() => handleViewDetails(issue.id)}>
                                    <img src={issue.image} alt={issue.title} className="issue-image" />
                                    <div className="issue-card-content">
                                        <h3>{issue.title}</h3>
                                        <p className="description">{issue.description}</p>
                                        <div className="issue-card-tags">
                                            <span className={statusTag.class}>
                                                {statusTag.icon}
                                                {issue.status}
                                            </span>
                                            <span className="tag category">{issue.category}</span>
                                        </div>
                                        <div className="issue-card-footer">
                                            <div className="date-info">
                                                <Calendar className="icon" />
                                                <span>{issue.date}</span>
                                            </div>
                                            <div className="view-details-link">
                                                <Eye className="icon" />
                                                <span>View Details</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* --- YOUR EXISTING TWO-COLUMN BODY (UNCHANGED) --- */}
                <div className="dashboard-body">
                    <section className="recent-activity-section">
                        <h2>Recent Activity</h2>
                        <div className="activity-list">
                            <button className="activity-item" onClick={() => handleActionClick('Pothole activity')}>
                                <img src={potholeImgOld} alt="Pothole" />
                                <div className="activity-details">
                                    <span className="activity-title">Pothole on Main Street Resolved</span>
                                    <span className="activity-time">2 hours ago</span>
                                </div>
                            </button>
                            <button className="activity-item" onClick={() => handleActionClick('Streetlight activity')}>
                                <img src={streetlightImgOld} alt="Streetlight" />
                                <div className="activity-details">
                                    <span className="activity-title">New streetlight issue reported</span>
                                    <span className="activity-time">16 hours ago</span>
                                </div>
                            </button>
                            <button className="activity-item" onClick={() => handleActionClick('Garbage activity')}>
                                <img src={garbageImgOld} alt="Garbage" />
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
                            <button className="complaint-button" onClick={() => handleActionClick('Post a complaint')}>
                                <span className="action-icon-wrapper"><img src={postIcon} alt="" className="action-icon" /></span>
                                Post a complaint
                            </button>
                            <button className="volunteer-button" onClick={() => handleActionClick('Volunteer')}>
                                <span className="action-icon-wrapper"><img src={volunteerIcon} alt="" className="action-icon" /></span>
                                volunteer
                            </button>
                            <button className="track-button" onClick={() => handleActionClick('Track your complaint')}>
                                <span className="action-icon-wrapper"><img src={trackIcon} alt="" className="action-icon" /></span>
                                Track your complaint
                            </button>
                            <button className="feedback-button" onClick={() => handleActionClick('Post your Feedback')}>
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