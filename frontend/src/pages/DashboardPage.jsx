import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import myIssuesIcon from '../assets/dashboardAssets/Usericon.png';
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
    const [myStats, setMyStats] = useState({ myTotal: 0 });
    const [loadingMy, setLoadingMy] = useState(true);
    const navigate = useNavigate(); // ADD THIS HOOK

    // Reported issues data and drawer state
    const [issues, setIssues] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

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
   
    const fetchMyStats = useCallback(async () => {
        try {
            setLoadingMy(true);
            const token = localStorage.getItem('accessToken');
            const { data } = await axios.get('http://localhost:3000/api/issues/my/stats', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                withCredentials: true
            });
            setMyStats({ myTotal: data?.myTotal ?? 0 });
        } catch (err) {
            console.error('Error fetching my stats:', err);
        } finally {
            setLoadingMy(false);
        }
    }, []);
   
    // helpers moved to module scope
   
    const fetchIssues = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/api/issues');
            const list = Array.isArray(data) ? data : [];
            const mapped = list.map((i) => {
                const createdAt = i?.createdAt ? new Date(i.createdAt) : null;
                // inline timeAgo to avoid extra helpers
                const diffSec = createdAt ? Math.floor((Date.now() - createdAt.getTime()) / 1000) : 0;
                let ta = '';
                if (createdAt) {
                    if (diffSec < 60) ta = `${diffSec}s ago`;
                    else {
                        const m = Math.floor(diffSec / 60);
                        if (m < 60) ta = `${m} minute${m !== 1 ? 's' : ''} ago`;
                        else {
                            const h = Math.floor(m / 60);
                            if (h < 24) ta = `${h} hour${h !== 1 ? 's' : ''} ago`;
                            else {
                                const d = Math.floor(h / 24);
                                if (d < 30) ta = `${d} day${d !== 1 ? 's' : ''} ago`;
                                else {
                                    const mo = Math.floor(d / 30);
                                    if (mo < 12) ta = `${mo} month${mo !== 1 ? 's' : ''} ago`;
                                    else {
                                        const y = Math.floor(mo / 12);
                                        ta = `${y} year${y !== 1 ? 's' : ''} ago`;
                                    }
                                }
                            }
                        }
                    }
                }
                return {
                    id: i._id,
                    title: i.title,
                    image: imageForIssue(i),
                    description: i.description || '',
                    status: i.status || 'Pending',
                    tags: [i?.type?.toLowerCase()].filter(Boolean),
                    likes: Array.isArray(i?.upvotes) ? i.upvotes.length : 0,
                    dislikes: Array.isArray(i?.downvotes) ? i.downvotes.length : 0,
                    date: formatDate(i?.createdAt),
                    createdAt,
                    timeAgo: ta,
                    border: statusBorder(i?.status),
                };
            });
            setIssues(mapped);
            setRecentActivity(mapped.slice(0, 3));
        } catch (err) {
            console.error('Error fetching issues:', err);
        }
    }, []);
    
    useEffect(() => {
        fetchStats();
        fetchMyStats();
        fetchIssues();
    }, [fetchStats, fetchMyStats, fetchIssues]);

    // 🌟 UPDATED FUNCTION: Redirects to new routes based on button action 🌟
    const handleActionClick = (action) => {
        switch (action) {
            case 'Post a complaint':
                // Existing, working route
                navigate('/register-complaint');
                break;
            case 'Volunteer':
                // New route for Volunteer Page
                navigate('/volunteer');
                break;
            case 'Track your complaint':
                // New route for Tracking Page
                navigate('/track-complaint');
                break;
            case 'Post your Feedback':
                // New route for Feedback Page
                navigate('/post-feedback');
                break;
            case 'Issue Map':
                // New route for Issue Map Page
                navigate('/issue-map');
                break;
            default:
                // Fallback for activity list buttons
                alert(`${action} button clicked! (This activity is just a placeholder action.)`);
        }
    };
    // --------------------------------------------------------------------

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
                            <p>My Issues</p>
                            <span>{loadingMy ? '...' : myStats.myTotal}</span>
                        </div>
                        <img src={myIssuesIcon} alt="My Issues" className="user-stat-icon" />
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
                            {recentActivity.length === 0 ? (
                                <div className="user-activity-empty">No recent activity</div>
                            ) : (
                                recentActivity.map((item) => (
                                    <button
                                        key={item.id}
                                        className="user-activity-item"
                                        onClick={() => handleOpen(item)}
                                        title={item.title}
                                    >
                                        <img src={item.image} alt={item.title} />
                                        <div className="user-activity-details">
                                            <span className="user-activity-title">{item.title}</span>
                                            <span className="user-activity-time">{item.timeAgo}</span>
                                        </div>
                                    </button>
                                ))
                            )}
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