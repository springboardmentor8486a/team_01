import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
// Import your own, reliable icon components
import { EyeIcon, EditIcon, CloseIcon } from './IconComponents';

// DIALOGS
const Dialog = ({ isOpen, onClose, children }) => { if (!isOpen) return null; return ( <div className="dialog-overlay" onClick={onClose}><div className="dialog-container" onClick={e => e.stopPropagation()}><button className="dialog-close-btn" onClick={onClose}><CloseIcon /></button>{children}</div></div> ); };
const ShowIssueDialog = ({ issue, onClose }) => ( <Dialog isOpen={!!issue} onClose={onClose}><div className="dialog-header"><h3 className="dialog-title">{issue?.issue?.title}</h3><p className="dialog-subtitle">{issue?.issue?.address}</p></div><div className="dialog-content"><div className="detail-grid"><div className="detail-item"><strong>Status:</strong> <span className={`status-badge ${issue?.status.toLowerCase().replace(' ', '-')}`}>{issue?.status}</span></div><div className="detail-item"><strong>Priority:</strong> <span className={`priority-${issue?.priority.toLowerCase()}`}>{issue?.priority}</span></div><div className="detail-item"><strong>Category:</strong> {issue?.category}</div><div className="detail-item"><strong>Reported By:</strong> {issue?.reportedBy}</div></div><p className="detail-description"><strong>Description:</strong> {issue?.issue?.description}</p></div></Dialog> );
const EditIssueDialog = ({ issue, onClose, onSave }) => {
    const handleSubmit = async (e) => { e.preventDefault(); const status = e.target.status.value; const priority = e.target.priority.value; try { const token = localStorage.getItem('accessToken'); await axios.put(`http://localhost:3000/api/admin/issuemanagement/${issue.issue?._id || issue.id}`, { status, priority }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }); alert('Issue updated successfully'); onSave(issue.id, { status, priority }); onClose(); } catch (error) { alert('Failed to update issue: ' + (error.response?.data?.message || error.message)); } };
    return ( <Dialog isOpen={!!issue} onClose={onClose}><div className="dialog-header"><h3 className="dialog-title">Edit Issue #{issue?.id}</h3></div><form className="dialog-content" onSubmit={handleSubmit}><div className="form-grid"><div className="form-item"><label htmlFor="status">Status</label><select id="status" name="status" defaultValue={issue?.status} className="dialog-select"><option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Resolved">Resolved</option></select></div><div className="form-item"><label htmlFor="priority">Priority</label><select id="priority" name="priority" defaultValue={issue?.priority} className="dialog-select"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div></div><div className="dialog-footer"><button type="button" className="dialog-button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="dialog-button-primary">Save Changes</button></div></form></Dialog> );
};

// MAIN COMPONENT
export default function IssueManagementTable({ issues: propIssues }) {
    const [issues, setIssues] = useState(propIssues || []);
    const [modalState, setModalState] = useState({ type: null, issue: null });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => { setIssues(propIssues || []); }, [propIssues]);
    useEffect(() => { const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false); }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [dropdownRef]);

    const filteredIssues = useMemo(() => { return (issues || []).filter(issue => { const statusMatch = selectedStatus === 'All Status' || (issue.status && issue.status.toLowerCase() === selectedStatus.toLowerCase()); const searchMatch = searchTerm === '' || (issue.issue?.title && issue.issue.title.toLowerCase().includes(searchTerm.toLowerCase())) || (issue.issue?.address && issue.issue.address.toLowerCase().includes(searchTerm.toLowerCase())); return statusMatch && searchMatch; }); }, [issues, selectedStatus, searchTerm]);
    
    const openModal = (type, issue) => setModalState({ type, issue });
    const closeModal = () => setModalState({ type: null, issue: null });
    const handleSave = (id, updates) => setIssues(p => p.map(i => i.id === id ? { ...i, ...updates } : i));
    const handleStatusSelect = (status) => { setSelectedStatus(status); setIsDropdownOpen(false); };
    const getStatusClass = (status) => `status-badge ${status ? status.toLowerCase().replace(/ /g, '-') : ''}`;
    const getPriorityClass = (priority) => `priority-${priority ? priority.toLowerCase() : ''}`;
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-GB') : 'N/A';

    return (
        <>
            <div className="issue-management-container">
                <div className="table-filters">
                    <div className="search-wrapper"><Search className="search-icon" /><input placeholder="Search issues..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                    <div className="filter-actions" ref={dropdownRef}>
                        <button className="filter-trigger-btn" onClick={() => setIsDropdownOpen(p => !p)}><SlidersHorizontal className="filter-icon" /><span>{selectedStatus}</span></button>
                        {isDropdownOpen && <div className="dropdown-menu"><div className="dropdown-item" onClick={() => handleStatusSelect('All Status')}>All Status</div><div className="dropdown-item" onClick={() => handleStatusSelect('Pending')}>Pending</div><div className="dropdown-item" onClick={() => handleStatusSelect('In Progress')}>In Progress</div><div className="dropdown-item" onClick={() => handleStatusSelect('Resolved')}>Resolved</div></div>}
                    </div>
                </div>
                <div className="table-container-wrapper">
                    <div className="table-header-info"><h3 className="table-title">All Issues</h3><p className="table-description">Manage and update issue status</p></div>
                    <table>
                        <thead><tr><th>Issue</th><th>Status</th><th>Priority</th><th>Category</th><th>Reported By</th><th>Date</th><th className="actions-header">Actions</th></tr></thead>
                        <tbody>
                            {filteredIssues.map((issue) => (
                                <tr key={issue.id}>
                                    <td><div className="issue-title">{issue.issue?.title}</div><div className="issue-location">{issue.issue?.address}</div></td>
                                    <td><span className={getStatusClass(issue.status)}>{issue.status}</span></td>
                                    <td><span className={getPriorityClass(issue.priority)}>{issue.priority}</span></td>
                                    <td>{issue.category}</td>
                                    <td>{issue.reportedBy}</td>
                                    <td>{formatDate(issue.date)}</td>
                                    <td className="actions-cell">
                                        <div className="actions-wrapper">
                                            <button className="action-button" title="Show Details" onClick={() => openModal('show', issue)}><EyeIcon /></button>
                                            <button className="action-button" title="Edit Issue" onClick={() => openModal('edit', issue)}><EditIcon /></button>
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