import React, { useState } from 'react';
import './UpdateIssueModal.css';

const UpdateIssueModal = ({ issue, onClose }) => {
  const [status, setStatus] = useState(issue.status);
  const [note, setNote] = useState('');

  // Mock function to handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('--- Update Submitted (UI Only) ---');
    console.log(`Issue ID: ${issue.id}`);
    console.log(`New Status: ${status}`);
    console.log(`Update Note: ${note}`);
    // In a real app, this is where you'd call an API
    onClose(); // Close the modal after submission
  };

  return (
    <div className="modal-backdrop">
      <div className="update-issue-modal">
        <header className="modal-header">
          <h3>Update Issue</h3>
          <button className="modal-close-button" onClick={onClose}>
            {/* Close 'X' icon */}
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p className="update-subheader">
              Update the status and add notes for <strong>{issue.issue}</strong>
            </p>

            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-input select-input"
              >
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="pending">Pending</option>
                <option value="new">New</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="note" className="form-label">Update Note</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about this update..."
                className="form-input textarea-input"
                rows="3"
              />
            </div>
          </div>

          <footer className="modal-footer">
            <button type="submit" className="update-button">
              Update Issue
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default UpdateIssueModal;