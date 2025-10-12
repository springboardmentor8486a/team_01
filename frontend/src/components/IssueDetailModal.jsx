import React from 'react';
import './IssueDetailModal.css';

const IssueDetailModal = ({ issue, onClose }) => {
  // Use a custom class for high priority to match the design's bold red text
  const priorityClass = issue.priority.toLowerCase() === 'high' ? 'detail-priority-high' : '';

  return (
    <div className="modal-backdrop">
      <div className="issue-detail-modal">
        <header className="modal-header">
          <h3>{issue.issue}</h3>
          <button className="modal-close-button" onClick={onClose}>
            {/* Close 'X' icon */}
            ✕
          </button>
        </header>

        <div className="modal-body">
          <p className="detail-subheader">Issue Details</p>

          <div className="detail-section description-section">
            <h4 className="detail-title">Description</h4>
            <p className="detail-content">{issue.description}</p>
          </div>

          <div className="detail-grid">
            <div className="detail-section">
              <h4 className="detail-title">Location</h4>
              <p className="detail-content">{issue.location}</p>
            </div>
            <div className="detail-section">
              <h4 className="detail-title">Category</h4>
              <p className="detail-content">{issue.category}</p>
            </div>
            <div className="detail-section">
              <h4 className="detail-title">Priority</h4>
              <p className={`detail-content ${priorityClass}`}>{issue.priority}</p>
            </div>
            <div className="detail-section">
              <h4 className="detail-title">Upvotes</h4>
              <p className="detail-content">{issue.upvotes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailModal;