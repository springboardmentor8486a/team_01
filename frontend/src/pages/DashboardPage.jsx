import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // ADD THIS IMPORT
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
import IssueCard from '../components/IssueCard.jsx';

// Helpers to adapt API -> UI (module scope to keep stable references)
const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
};

const statusBorder = (status) => {
    switch (status) {
        case 'Resolved':
            return 'border-green';
        case 'In Progress':
            return 'border-yellow';
        case 'Pending':
        default:
            return 'border-red';
    }
};

const imageForIssue = (issue) => {
    if (issue?.image) return issue.image;
    const t = (issue?.type || '').toLowerCase();
    if (t.includes('street')) return streetlightImg;
    if (t.includes('garbage') || t.includes('waste') || t.includes('dump')) return garbageImg;
    return potholeImg;
};

const DashboardPage = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // ADD THIS HOOK

    // Reported issues data and drawer state
    const [issues, setIssues] = useState([]);

    const handleOpen = (issue) => {
        // Navigate to the view issue route with the selected issue's id
        navigate(`/viewissue/${issue.id}`);
    };

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/issues/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // helpers moved to module scope

    const fetchIssues = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/api/issues');
            const mapped = (Array.isArray(data) ? data : []).map((i) => ({
                id: i._id,
                title: i.title,
                image: imageForIssue(i),
                description: i.description || '',
                status: i.status || 'Pending',
                tags: [i?.type?.toLowerCase()].filter(Boolean),
                likes: Array.isArray(i?.upvotes) ? i.upvotes.length : 0,
                dislikes: Array.isArray(i?.downvotes) ? i.downvotes.length : 0,
                date: formatDate(i?.createdAt),
                border: statusBorder(i?.status),
            }));
            setIssues(mapped);
        } catch (err) {
            console.error('Error fetching issues:', err);
        }
    }, []);
    
    useEffect(() => {
        fetchStats();
        fetchIssues();
    }, [fetchStats, fetchIssues]);

    const handleActionClick = (action) => {
        if (action === 'Post a complaint') {
            navigate('/register-complaint'); // ADD THIS NAVIGATION
        } else {
            alert(`${action} button clicked!`);
        }
    };

    return (
        <div className="user-dashboard-container">
            <Header activePage="dashboard" />

            <main className="user-main-content">
                <div className="user-welcome-banner">
                    <h1>Hello, welcome to <strong>Clean Street!</strong></h1>
                    <p>Here are some actions for you</p>
                </div>

                <section className="user-stats-container">
                    <div className="user-stat-card">
                        <div className="user-card-header blue-header"></div>
                        <div className="user-card-body">
                            <p>Total Issues</p>
                            <span>{loading ? '...' : stats.total}</span>
                        </div>
                        <img src={totalIssuesIcon} alt="Total Issues" className="user-stat-icon" />
                    </div>
                    <div className="user-stat-card">
                        <div className="user-card-header blue-header"></div>
                        <div className="user-card-body">
                            <p>Pending</p>
                            <span>{loading ? '...' : stats.pending}</span>
                        </div>
                        <img src={pendingIcon} alt="Pending" className="user-stat-icon" />
                    </div>
                    <div className="user-stat-card">
                        <div className="user-card-header blue-header"></div>
                        <div className="user-card-body">
                            <p>In Progress</p>
                            <span>{loading ? '...' : stats.inProgress}</span>
                        </div>
                        <img src={inProgressIcon} alt="In Progress" className="user-stat-icon" />
                    </div>
                    <div className="user-stat-card">
                        <div className="user-card-header blue-header"></div>
                        <div className="user-card-body">
                            <p>Resolved</p>
                            <span>{loading ? '...' : stats.resolved}</span>
                        </div>
                        <img src={resolvedIcon} alt="Resolved" className="user-stat-icon" />
                    </div>
                </section>

                <section className="reported-issues">
                    <div className="reported-header">
                        <h2>Reported Issues</h2>
                        <button
                            className="report-issue-btn"
                            onClick={() => navigate('/register-complaint')}
                        >
                            + Report New Issue
                        </button>
                    </div>
                    <div className="cards-grid">
                        {issues.map((issue) => (
                            <IssueCard key={issue.id} issue={issue} onOpen={handleOpen} />
                        ))}
                    </div>
                </section>

                <div className="user-dashboard-body">
                    <section className="user-recent-activity-section">
                        <h2>Recent Activity</h2>
                        <div className="user-activity-list">
                            <button className="user-activity-item" onClick={() => handleActionClick('Pothole activity')}>
                                <img src={potholeImg} alt="Pothole" />
                                <div className="user-activity-details">
                                    <span className="user-activity-title">Pothole on Main Street Resolved</span>
                                    <span className="user-activity-time">2 hours ago</span>
                                </div>
                            </button>
                            <button className="user-activity-item" onClick={() => handleActionClick('Streetlight activity')}>
                                <img src={streetlightImg} alt="Streetlight" />
                                <div className="user-activity-details">
                                    <span className="user-activity-title">New streetlight issue reported</span>
                                    <span className="user-activity-time">16 hours ago</span>
                                </div>
                            </button>
                            <button className="user-activity-item" onClick={() => handleActionClick('Garbage activity')}>
                                <img src={garbageImg} alt="Garbage" />
                                <div className="user-activity-details">
                                    <span className="user-activity-title">Garbage dump complaint updated</span>
                                    <span className="user-activity-time">19 hours ago</span>
                                </div>
                            </button>
                        </div>
                    </section>

                    <section className="user-quick-actions-section">
                        <h2>Quick Actions</h2>
                        <div className="user-actions-list">
                            <button className="user-action-button" onClick={() => handleActionClick('Post a complaint')}>
                                <span className="user-action-icon-wrapper"><img src={postIcon} alt="" className="user-action-icon" /></span>
                                Post a complaint
                            </button>
                            <button className="user-action-button" onClick={() => handleActionClick('Volunteer')}>
                                <span className="user-action-icon-wrapper"><img src={volunteerIcon} alt="" className="user-action-icon" /></span>
                                volunteer
                            </button>
                            <button className="user-action-button" onClick={() => handleActionClick('Track your complaint')}>
                                <span className="user-action-icon-wrapper"><img src={trackIcon} alt="" className="user-action-icon" /></span>
                                Track your complaint
                            </button>
                            <button className="user-action-button" onClick={() => handleActionClick('Post your Feedback')}>
                                <span className="user-action-icon-wrapper"><img src={feedbackIcon} alt="" className="user-action-icon" /></span>
                                Post your FeedBack
                            </button>
                        </div>
                        <button className="user-issue-map-button" onClick={() => handleActionClick('Issue Map')}>
                            <span className="user-action-icon-wrapper"><img src={issueMapIcon} alt="" className="user-action-icon" /></span>
                            Issue Map
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
