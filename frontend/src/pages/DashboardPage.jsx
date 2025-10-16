import React, { useState, useEffect } from 'react';
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
import SideDrawer from '../components/SideDrawer.jsx';

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
    const [issues, setIssues] = useState(() => [
        {
            id: 1,
            title: 'Large Pothole on Main Street',
            image: potholeImg,
            description: "There is a significant pothole on Main Street near the intersection with Oak Avenue. It's...",
            status: 'in review',
            tags: ['pothole'],
            likes: 24,
            dislikes: 2,
            date: '10/11/2025',
            border: 'border-red'
        },
        {
            id: 2,
            title: 'Broken Streetlight on Park Avenue',
            image: streetlightImg,
            description: 'The streetlight at the corner of Park Avenue and 5th Street has been non-functional for...',
            status: 'received',
            tags: ['streetlight'],
            likes: 15,
            dislikes: 1,
            date: '10/02/2025',
            border: 'border-yellow'
        },
        {
            id: 3,
            title: 'Illegal Garbage Dumping at River Park',
            image: garbageImg,
            description: 'Multiple bags of household waste and construction debris have been illegally...',
            status: 'resolved',
            tags: ['garbage'],
            likes: 42,
            dislikes: 0,
            date: '10/05/2025',
            border: 'border-green'
        },
        {
            id: 4,
            title: 'Graffiti on Community Center Wall',
            image: potholeImg,
            description: 'Large graffiti tags have appeared on the west wall of the community center.',
            status: 'received',
            tags: ['vandalism'],
            likes: 8,
            dislikes: 3,
            date: '10/14/2025',
            border: 'border-green'
        }
    ]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const imageAssets = [potholeImg, streetlightImg, garbageImg];

    const handleOpen = (issue) => {
        setSelectedIssue(issue);
        setDrawerOpen(true);
    };
    const handleClose = () => setDrawerOpen(false);
    const handleSave = (updated) => {
        setIssues(prev => prev.map(i => (i.id === updated.id ? updated : i)));
        setDrawerOpen(false);
    };

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
                            <p>pending</p>
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
                <SideDrawer
                    open={drawerOpen}
                    issue={selectedIssue}
                    onClose={handleClose}
                    onSave={handleSave}
                    assets={imageAssets}
                />
            </main>
        </div>
    );
};

export default DashboardPage;
