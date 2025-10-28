import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Assuming you use axios for data fetching
// Reuse assets for visual consistency
import potholeImg from '../assets/dashboardAssets/pothole.png'; 
import streetlightImg from '../assets/dashboardAssets/streetlight.png'; 

// Mock data (replace with actual API call)
const mockIssues = [
  { id: 1, title: 'Pothole at Central Ave', status: 'In Progress', image: potholeImg },
  { id: 2, title: 'Broken Streetlight, Sector 4', status: 'Pending', image: streetlightImg },
  { id: 3, title: 'Waste Dump near Park Gate', status: 'Resolved', image: potholeImg },
];

const RecentIssuesPreview = () => {
    // In a real app, you'd fetch data here: useEffect + useState
    
    return (
        <section className="recent-issues-preview-section">
            <h2 className="section-title">Latest Community Reports 📢</h2>
            <p className="section-subtitle">See what's been reported and fixed in your city this week.</p>
            
            <div className="issue-preview-grid">
                {mockIssues.map((issue) => (
                    <Link to={`/viewissue/${issue.id}`} key={issue.id} className="issue-preview-card">
                        <img src={issue.image} alt={issue.title} className="issue-preview-image" />
                        <div className="issue-preview-details">
                            <h3>{issue.title}</h3>
                            <span className={`issue-status status-${issue.status.replace(/\s/g, '').toLowerCase()}`}>
                                {issue.status}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="view-all-container">
                <Link to="/issues" className="view-all-button">
                    View All Reports &rarr;
                </Link>
            </div>
        </section>
    );
};

export default RecentIssuesPreview;