import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Eye, FilePenLine, X } from 'lucide-react';

// const mockIssuesData = [
//     { id: 1, title: 'Pothole on Main Street', location: 'Main St & Oak Ave', status: 'in progress', priority: 'high', category: 'Road Maintenance', reportedBy: 'John Citizen', date: '20/9/2024', description: 'Large pothole causing traffic issues.' },
//     { id: 2, title: 'Broken Streetlight', location: 'Pine Street', status: 'resolved', priority: 'medium', category: 'Lighting', reportedBy: 'Jane Smith', date: '15/9/2024', description: 'Streetlight is out.' },
//     { id: 3, title: 'Overflowing Garbage Bin', location: 'Central Park', status: 'pending', priority: 'medium', category: 'Waste Management', reportedBy: 'Mike Johnson', date: '23/9/2024', description: 'Bin is overflowing.' },
//     { id: 4, title: 'Graffiti on Public Building', location: 'Community Center', status: 'in progress', priority: 'low', category: 'Vandalism', reportedBy: 'Sarah Wilson', date: '18/9/2024', description: 'Graffiti on west wall.' },
// ];

const Dialog = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return ( <div className="dialog-overlay" onClick={onClose}><div className="dialog-container" onClick={e => e.stopPropagation()}><button className="dialog-close-btn" onClick={onClose}><X size={20} /></button>{children}</div></div> );
};

const ShowIssueDialog = ({ issue, onClose }) => ( <Dialog isOpen={!!issue} onClose={onClose}><div className="dialog-header"><h3 className="dialog-title">{issue?.issue?.title}</h3><p className="dialog-subtitle">{issue?.issue?.address}</p></div><div className="dialog-content"><div className="detail-grid"><div className="detail-item"><strong>Status:</strong> <span className={`status-badge ${issue?.status.replace(' ', '-')}`}>{issue?.status}</span></div><div className="detail-item"><strong>Priority:</strong> <span className={`priority-${issue?.priority}`}>{issue?.priority}</span></div><div className="detail-item"><strong>Category:</strong> {issue?.category}</div><div className="detail-item"><strong>Reported By:</strong> {issue?.reportedBy}</div></div><p className="detail-description"><strong>Description:</strong> {issue?.issue?.description}</p></div></Dialog> );
const EditIssueDialog = ({ issue, onClose, onSave }) => {
    const handleSubmit = (e) => { e.preventDefault(); onSave(issue.id, { status: e.target.status.value, priority: e.target.priority.value }); onClose(); };
    return ( <Dialog isOpen={!!issue} onClose={onClose}><div className="dialog-header"><h3 className="dialog-title">Edit Issue #{issue?.id}</h3></div><form className="dialog-content" onSubmit={handleSubmit}><div className="form-grid"><div className="form-item"><label htmlFor="status">Status</label><select id="status" name="status" defaultValue={issue?.status} className="dialog-select"><option value="pending">Pending</option><option value="in progress">In Progress</option><option value="resolved">Resolved</option></select></div><div className="form-item"><label htmlFor="priority">Priority</label><select id="priority" name="priority" defaultValue={issue?.priority} className="dialog-select"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div></div><div className="dialog-footer"><button type="button" className="dialog-button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="dialog-button-primary">Save Changes</button></div></form></Dialog> );
};

export default function IssueManagementTable({ issues: propIssues }) {
    const [issues, setIssues] = useState(propIssues || []);
    const [modalState, setModalState] = useState({ type: null, issue: null });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const dropdownRef = useRef(null);

    useEffect(() => {
        setIssues(propIssues || []);
    }, [propIssues]);

    useEffect(() => {
        const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const openModal = (type, issue) => setModalState({ type, issue });
    const closeModal = () => setModalState({ type: null, issue: null });
    const handleSave = (id, updates) => setIssues(p => p.map(i => i.id === id ? { ...i, ...updates } : i));
    const handleStatusSelect = (status) => { setSelectedStatus(status); setIsDropdownOpen(false); };
    const getStatusClass = (status) => `status-badge ${status.replace(' ', '-')}`;
    const getPriorityClass = (priority) => `priority-${priority}`;

    return (
        <>
            <div className="issue-management-container">
                <div className="table-filters">
                    <div className="search-wrapper"><Search className="search-icon" /><input placeholder="Search issues..." className="search-input" /></div>
                    <div className="filter-actions" ref={dropdownRef}>
                        <button className="filter-trigger-btn" onClick={() => setIsDropdownOpen(p => !p)}><SlidersHorizontal className="filter-icon" /><span>{selectedStatus}</span></button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => handleStatusSelect('All Status')}>All Status</div>
                                <div className="dropdown-item" onClick={() => handleStatusSelect('Pending')}>Pending</div>
                                <div className="dropdown-item" onClick={() => handleStatusSelect('In Progress')}>In Progress</div>
                                <div className="dropdown-item" onClick={() => handleStatusSelect('Resolved')}>Resolved</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="table-container-wrapper">
                    <div className="table-header-info"><h3 className="table-title">All Issues</h3><p className="table-description">Manage and update issue status</p></div>
                    <table>
                        <thead><tr><th>Issue</th><th>Status</th><th>Priority</th><th>Category</th><th>Reported By</th><th>Date</th><th className="actions-header">Actions</th></tr></thead>
                        <tbody>
                            {issues.map((issue) => (
                                <tr key={issue.id}>
                                    <td><div className="issue-title">{issue.issue?.title}</div><div className="issue-location">{issue.issue?.address}</div></td>
                                    <td><span className={getStatusClass(issue.status)}>{issue.status}</span></td>
                                    <td><span className={getPriorityClass(issue.priority)}>{issue.priority}</span></td>
                                    <td>{issue.category}</td>
                                    <td>{issue.reportedBy}</td>
                                    <td>{issue.date}</td>
                                    <td className="actions-cell">
                                        <div className="actions-wrapper">
                                            <button className="action-button" title="Show Details" onClick={() => openModal('show', issue)}><Eye className="action-icon" /></button>
                                            <button className="action-button" title="Edit Issue" onClick={() => openModal('edit', issue)}><FilePenLine className="action-icon" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ShowIssueDialog issue={modalState.type === 'show' ? modalState.issue : null} onClose={closeModal} />
            <EditIssueDialog issue={modalState.type === 'edit' ? modalState.issue : null} onClose={closeModal} onSave={handleSave} />
        </>
    );
}
