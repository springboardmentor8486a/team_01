import React, { useState, useEffect } from 'react';
import './IssueManagementPage.css';
import Header from '../components/Header';

const IssueManagementPage = () => {
    const [issues, setIssues] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [editingIssue, setEditingIssue] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Sample initial data matching your HTML
    const initialIssues = [
        {
            id: 1,
            title: "Pothole on Main Street",
            location: "Main St & Oak Ave",
            status: "in progress",
            priority: "high",
            category: "Road Maintenance",
            reporter: "John Citizen",
            date: "9/20/2024",
            description: "Large pothole causing traffic issues"
        },
        {
            id: 2,
            title: "Broken Streetlight",
            location: "Pine Street",
            status: "resolved",
            priority: "medium",
            category: "Lighting",
            reporter: "Jane Smith",
            date: "9/15/2024",
            description: "Streetlight not working for 3 days"
        },
        {
            id: 3,
            title: "Overflowing Garbage Bin",
            location: "Central Park",
            status: "pending",
            priority: "medium",
            category: "Waste Management",
            reporter: "Mike Johnson",
            date: "9/23/2024",
            description: "Garbage bin overflowing and attracting pests"
        },
        {
            id: 4,
            title: "Graffiti on Public Building",
            location: "City Hall",
            status: "in progress",
            priority: "low",
            category: "Vandalism",
            reporter: "Sarah Wilson",
            date: "9/18/2024",
            description: "Graffiti on the west side of the building"
        }
    ];

    useEffect(() => {
        const savedIssues = localStorage.getItem('civic-issues');
        if (savedIssues) {
            setIssues(JSON.parse(savedIssues));
        } else {
            setIssues(initialIssues);
            localStorage.setItem('civic-issues', JSON.stringify(initialIssues));
        }
    }, []);

    const handleAddIssue = (issueData) => {
        const newIssue = {
            id: Date.now(),
            ...issueData,
            status: 'pending',
            date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
        };
        const updatedIssues = [...issues, newIssue];
        setIssues(updatedIssues);
        localStorage.setItem('civic-issues', JSON.stringify(updatedIssues));
        setShowModal(false);
        setSuccessMessage('Issue submitted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleEditIssue = (id, issueData) => {
        const updatedIssues = issues.map(issue =>
            issue.id === id ? { ...issue, ...issueData } : issue
        );
        setIssues(updatedIssues);
        localStorage.setItem('civic-issues', JSON.stringify(updatedIssues));
        setShowModal(false);
        setEditingIssue(null);
        setSuccessMessage('Issue updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleDeleteIssue = (id) => {
        if (window.confirm('Are you sure you want to delete this issue?')) {
            const updatedIssues = issues.filter(issue => issue.id !== id);
            setIssues(updatedIssues);
            localStorage.setItem('civic-issues', JSON.stringify(updatedIssues));
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch = 
            issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.reporter.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = activeFilter === 'all' || issue.status === activeFilter;
        
        return matchesSearch && matchesFilter;
    });

    const getStatusClass = (status) => {
        switch (status) {
            case 'in progress': return 'status-in-progress';
            case 'resolved': return 'status-resolved';
            case 'pending': return 'status-pending';
            default: return '';
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            case 'low': return 'priority-low';
            default: return '';
        }
    };

    return (
        <div className="issue-management-container">
            <Header activePage="issues" />
            
            <main className="main-content">
                <div className="page-header">
                    <h2>All Issues</h2>
                    <p>Manage and update issue status</p>
                </div>

                {successMessage && (
                    <div className="success-message">
                        <i className="fas fa-check-circle"></i> {successMessage}
                    </div>
                )}

                <div className="controls-bar">
                    <button 
                        className="add-issue-btn"
                        onClick={() => {
                            setEditingIssue(null);
                            setShowModal(true);
                        }}
                    >
                        <i className="fas fa-plus"></i> Add New Issue
                    </button>
                    
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search issues..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="status-filter">
                    {['all', 'pending', 'in progress', 'resolved'].map(status => (
                        <button
                            key={status}
                            className={`status-filter-btn ${activeFilter === status ? 'active' : ''}`}
                            onClick={() => setActiveFilter(status)}
                        >
                            {status === 'in progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Issue</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Category</th>
                                <th>Reported By</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIssues.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="no-issues">No issues found</td>
                                </tr>
                            ) : (
                                filteredIssues.map(issue => (
                                    <tr key={issue.id}>
                                        <td>
                                            <strong>{issue.title}</strong>
                                            <br />
                                            <span className="issue-location">{issue.location}</span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(issue.status)}`}>
                                                {issue.status}
                                            </span>
                                        </td>
                                        <td className={getPriorityClass(issue.priority)}>
                                            {issue.priority}
                                        </td>
                                        <td>{issue.category}</td>
                                        <td>{issue.reporter}</td>
                                        <td>{issue.date}</td>
                                        <td className="actions">
                                            <button 
                                                className="action-btn"
                                                onClick={() => {
                                                    setEditingIssue(issue);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                className="action-btn"
                                                onClick={() => handleDeleteIssue(issue.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <IssueModal
                        issue={editingIssue}
                        onClose={() => {
                            setShowModal(false);
                            setEditingIssue(null);
                        }}
                        onSubmit={editingIssue ? 
                            (data) => handleEditIssue(editingIssue.id, data) : 
                            handleAddIssue
                        }
                    />
                )}
            </main>
        </div>
    );
};

// Modal Component
const IssueModal = ({ issue, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: issue?.title || '',
        location: issue?.location || '',
        priority: issue?.priority || '',
        category: issue?.category || '',
        reporter: issue?.reporter || '',
        description: issue?.description || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{issue ? 'Edit Issue' : 'Report New Issue'}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="issueTitle">Issue Title *</label>
                        <input
                            type="text"
                            id="issueTitle"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Pothole on Main Street"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="issueLocation">Location *</label>
                        <input
                            type="text"
                            id="issueLocation"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Main St & Oak Ave"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="issuePriority">Priority *</label>
                        <select
                            id="issuePriority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="issueCategory">Category *</label>
                        <select
                            id="issueCategory"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Road Maintenance">Road Maintenance</option>
                            <option value="Lighting">Lighting</option>
                            <option value="Waste Management">Waste Management</option>
                            <option value="Vandalism">Vandalism</option>
                            <option value="Parks & Recreation">Parks & Recreation</option>
                            <option value="Public Safety">Public Safety</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="issueReporter">Reported By *</label>
                        <input
                           
