import React, { useState } from 'react';
import './IssueDetailPage.css';
import ViewIssueComponent from '../components/ViewIssueComponent';

const MOCK_ISSUE_DATA = {
    title: "Large Pothole on Main Street",
    priority: "high",
    status: "in-review", // 'received', 'in-review', 'resolved'
    type: "pothole",
    reporter: "Demo User",
    date: "Oct 10, 2025, 05:15 PM",
    address: "123 Main Street, Downtown",
    description: "There is a significant pothole on Main Street near the intersection with Oak Avenue. It's approximately 2 feet wide and 6 inches deep, posing a serious hazard to vehicles and pedestrians. This has been causing traffic slowdowns during peak hours.",
    landmark: "Near City Hall",
    coordinates: {
        latitude: "40.712800",
        longitude: "-74.006000"
    },
    // Mock image URL for demonstration
    imageUrl: "https://placehold.co/900x300/e0e7ff/3b82f6?text=Pothole+Image+Placeholder", 
    comments: [
        {
            id: 1,
            author: "Sarah Johnson",
            initials: "S",
            timeAgo: "3d ago",
            text: "I drive through here every day and this pothole is getting worse. Almost damaged my tire yesterday!",
            role: "user"
        },
        {
            id: 2,
            author: "Mike Chen",
            initials: "M",
            timeAgo: "2d ago",
            text: "Thanks for reporting this. The city needs to prioritize fixing this before someone gets hurt.",
            role: "user"
        },
        {
            id: 3,
            author: "City Admin",
            initials: "C",
            timeAgo: "1d ago",
            text: "We have received your report and our crew will be dispatched to assess and repair this pothole within the next 3-5 business days. Thank you.",
            role: "admin"
        },
    ],
    initialVotes: { // Initialize votes that will be managed by ViewIssueComponent's state
        upvotes: 24,
        downvotes: 2,
    }
};

const IssueDetailPage = () => {
    // 🚨 API CALL INTEGRATION POINT 1: Initial Data Fetch
    // Your team lead will replace this MOCK_ISSUE_DATA with a state
    // that fetches data on mount (e.g., using useEffect with fetch).
    const [issueData, setIssueData] = useState(MOCK_ISSUE_DATA);

    // In a real app, loading and error states would be managed here.
    const loading = false; 

    if (loading) {
        return <div className="loading">Loading issue details...</div>;
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
