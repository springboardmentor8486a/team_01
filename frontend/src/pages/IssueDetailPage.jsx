import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import './IssueDetailPage.css';
import ViewIssueComponent from '../components/ViewIssueComponent';

/** Helpers to convert backend Issue -> ViewIssueComponent model **/
const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')}, ${d.getFullYear()}, ${hh}:${mm}`;
};

const formatRelative = (iso) => {
    if (!iso) return 'Just now';
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
};

const mapStatus = (s) => {
    const v = String(s || '').toLowerCase();
    if (v === 'resolved') return 'resolved';
    if (v === 'in progress' || v === 'in-progress') return 'in-review';
    if (v === 'received') return 'received';
    return 'received'; // default for "Pending"
};

const toViewModel = (i) => ({
    id: i?._id,
    title: i?.title || 'Untitled Issue',
    priority: String(i?.priority || 'Low').toLowerCase(),
    status: mapStatus(i?.status || 'Pending'),
    type: String(i?.type || '').toLowerCase(),
    reporter: i?.reporterName || 'Demo User',
    date: formatDate(i?.createdAt),
    address: i?.address || '',
    description: i?.description || '',
    landmark: i?.landmark || '',
    coordinates: {
        latitude: typeof i?.location?.lat === 'number' ? i.location.lat.toFixed(6) : String(i?.location?.lat || ''),
        longitude: typeof i?.location?.lng === 'number' ? i.location.lng.toFixed(6) : String(i?.location?.lng || '')
    },
    imageUrl: i?.image || 'https://placehold.co/900x300/e0e7ff/3b82f6?text=Pothole+Image+Placeholder',
    comments: Array.isArray(i?.comments)
        ? i.comments.slice().reverse().map((c, idx) => ({
            id: c?._id || idx,
            author: c?.userName || 'User',
            initials: (c?.userName?.[0] || 'U').toUpperCase(),
            timeAgo: formatRelative(c?.createdAt),
            text: c?.text || '',
            role: c?.role || 'user'
        }))
        : [],
    initialVotes: {
        upvotes: Array.isArray(i?.upvotes) ? i.upvotes.length : 0,
        downvotes: Array.isArray(i?.downvotes) ? i.downvotes.length : 0
    }
});

const IssueDetailPage = () => {
    const params = useParams();
    const location = useLocation();

    // Be resilient if route param isn't matched (e.g., during HMR or wildcard route)
    const derivedId = params?.id || location.pathname.split('/').filter(Boolean).pop();

    const [issueData, setIssueData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        const fetchIssue = async () => {
            // If we still cannot resolve an id, bail out with a clear error
            if (!derivedId) {
                setError('Invalid issue URL');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const { data } = await axios.get(`http://localhost:3000/api/issues/${derivedId}`);
                if (!mounted) return;
                setIssueData(toViewModel(data));
            } catch (e) {
                console.error('Failed to fetch issue by id:', e);
                if (mounted) setError('Failed to load issue');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchIssue();
        return () => { mounted = false; };
    }, [derivedId]);

    if (loading) {
        return <div className="loading">Loading issue details...</div>;
    }

    if (error || !issueData) {
        return (
            <div className="issue-detail-page-container">
                <main className="content-area">
                    <a href="/dashboard" className="back-link">&larr; Back to Dashboard</a>
                    <div className="card"><h3>{error || 'Issue not found'}</h3></div>
                </main>
            </div>
        );
    }

    return (
        <div className="issue-detail-page-container">
            <header className="page-header">
                <div className="logo-container">
                    <span className="logo-initials">CS</span>
                    <span className="logo-name">CleanStreet</span>
                </div>
                <nav className="header-nav">
                    <a href="/dashboard">Dashboard</a>
                    <a href="/profile">Profile</a>
                </nav>
            </header>

            <main className="content-area">
                <a href="/dashboard" className="back-link">
                    &larr; Back to Dashboard
                </a>
                <ViewIssueComponent issue={issueData} />
            </main>
        </div>
    );
};

export default IssueDetailPage;
