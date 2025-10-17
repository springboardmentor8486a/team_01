import React, { useState, useMemo } from 'react';
import './IssueManagement.css';
import IssueDetailModal from './IssueDetailModal'; 
import UpdateIssueModal from './UpdateIssueModal'; 

// --- Mock Data (keeping existing data) ---
const initialIssues = [
  {
    id: 1,
    issue: 'Pothole on Main Street',
    location: 'Main St & Oak Ave',
    status: 'in progress',
    priority: 'high',
    category: 'Road Maintenance',
    reportedBy: 'John Citizen',
    date: '9/20/2024',
    description: 'Large pothole causing damage to vehicles near the intersection of Main St and Oak Ave.',
    upvotes: 12,
  },
  {
    id: 2,
    issue: 'Broken Streetlight',
    location: 'Pine Street',
    status: 'resolved',
    priority: 'medium',
    category: 'Lighting',
    reportedBy: 'Jane Smith',
    date: '9/15/2024',
    description: 'Streetlight is out on Pine Street near the public library.',
    upvotes: 5,
  },
  {
    id: 3,
    issue: 'Overflowing Garbage Bin',
    location: 'Central Park',
    status: 'pending',
    priority: 'medium',
    category: 'Waste Management',
    reportedBy: 'Mike Johnson',
    date: '9/23/2024',
    description: 'The public garbage bin at the main entrance of Central Park is overflowing.',
    upvotes: 8,
  },
  {
    id: 4,
    issue: 'Graffiti on Public Building',
    location: 'Community Center',
    status: 'in progress',
    priority: 'low',
    category: 'Vandalism',
    reportedBy: 'Sarah Wilson',
    date: '9/18/2024',
    description: 'New graffiti on the back wall of the community center building.',
    upvotes: 3,
  },
];

const allStatuses = ['All Status', 'in progress', 'resolved', 'pending'];

const IssueManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status'); // New state for status filter
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // --- Filtering Logic for Search and Status ---
  const filteredIssues = useMemo(() => {
    let results = initialIssues;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const lowerCaseFilterStatus = filterStatus.toLowerCase();

    // 1. Search Filter
    if (searchTerm) {
      results = results.filter(issue => 
        Object.values(issue).some(value => 
          String(value).toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    }
    
    // 2. Status Filter
    if (filterStatus !== 'All Status') {
      results = results.filter(issue => 
        issue.status.toLowerCase() === lowerCaseFilterStatus
      );
    }

    return results;
  }, [searchTerm, filterStatus]); // Depend on both search and filter status

  // --- Handlers for Modals (Keeping existing handlers) ---
  const handleView = (issue) => {
    setSelectedIssue(issue);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (issue) => {
    setSelectedIssue(issue);
    setIsUpdateModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedIssue(null);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedIssue(null);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority.toLowerCase()}`;
  };

  return (
    <div className="issue-management-dashboard">
      <header className="dashboard-header">
        <button className="nav-button active">Issue Management</button>
        <button className="nav-button">User Management</button>
      </header>

      <div className="search-and-filter-bar">
        {/* Search Input Container with Icon */}
        <div className="search-input-container">
          {/* Search Icon (Magnifying Glass) */}
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filter Dropdown Button */}
        <div className="filter-dropdown-container">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-button"
          >
            {allStatuses.map(status => (
              <option key={status} value={status}>
                {status === 'All Status' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          {/* Filter Icon (Three lines) */}
          <svg className="filter-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
        </div>
      </div>

      <div className="all-issues-card">
        <h2>All Issues</h2>
        <p className="card-subtitle">Manage and update issue status</p>

        <div className="issues-table-container">
          <table className="issues-table">
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
              {filteredIssues.map((issue) => (
                <tr key={issue.id}>
                  <td>
                    <div className="issue-title">{issue.issue}</div>
                    <div className="issue-location">{issue.location}</div>
                  </td>
                  <td>
                    <span className={`status-tag ${getStatusClass(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td>
                    <span className={getPriorityClass(issue.priority)}>
                      {issue.priority}
                    </span>
                  </td>
                  <td>{issue.category}</td>
                  <td>{issue.reportedBy}</td>
                  <td>{issue.date}</td>
                  <td className="actions-cell">
                    {/* View Icon (Eye) */}
                    <button className="action-icon-button" onClick={() => handleView(issue)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="action-svg-icon">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    {/* Edit Icon (Pencil) */}
                    <button className="action-icon-button" onClick={() => handleEdit(issue)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="action-svg-icon">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table >
          {filteredIssues.length === 0 && (
            <p className="no-results">No issues found matching your criteria.</p>
          )}
        </div>
      </div>

      {/* Modals based on the state */}
      {isDetailModalOpen && selectedIssue && (
        <IssueDetailModal issue={selectedIssue} onClose={handleCloseDetailModal} />
      )}

      {isUpdateModalOpen && selectedIssue && (
        <UpdateIssueModal issue={selectedIssue} onClose={handleCloseUpdateModal} />
      )}
    </div>
  );
};

export default IssueManagement;
