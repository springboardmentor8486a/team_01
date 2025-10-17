import React, { useState } from 'react';
import { Clock, CheckCircle, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
// Styling imported via IssueDetailPage.jsx

// Helper component for the status steps
const StatusStep = ({ label, icon: Icon, isActive, isCompleted }) => {
    let iconClass = '';
    if (isCompleted) {
        iconClass = 'completed';
    } else if (isActive) {
        iconClass = 'active';
    } else if (!isActive && !isCompleted && label === "Received") {
        iconClass = 'active'; // Received is active by default
    }

    // Use a placeholder icon for 'Resolved' if not active/completed
    const DisplayIcon = label === "Resolved" ? CheckCircle : Clock; 

    return (
        <div className="status-step">
            <div className={`step-icon ${iconClass}`}>
                <DisplayIcon size={18} />
            </div>
            {label}
        </div>
    );
};

// Main Component
const ViewIssueComponent = ({ issue }) => {
    // Local State for Interactive Elements
    const [commentText, setCommentText] = useState('');
    const [localComments, setLocalComments] = useState(issue.comments);
    const [votes, setVotes] = useState(issue.initialVotes);
    const [userVote, setUserVote] = useState(null); // 'upvote', 'downvote', or null
    
    const MAX_CHARS = 500;

    // --- Interaction Handlers ---

    const handleVote = (type) => {
        // Optimistic UI Update using local state
        setVotes(prev => {
            let newUpvotes = prev.upvotes;
            let newDownvotes = prev.downvotes;

            if (type === 'upvote') {
                if (userVote === 'upvote') { // Undo Upvote
                    newUpvotes -= 1;
                    setUserVote(null);
                } else { // New Upvote (or changing from downvote)
                    newUpvotes += 1;
                    if (userVote === 'downvote') newDownvotes -= 1;
                    setUserVote('upvote');
                }
            } else { // type === 'downvote'
                if (userVote === 'downvote') { // Undo Downvote
                    newDownvotes -= 1;
                    setUserVote(null);
                } else { // New Downvote (or changing from upvote)
                    newDownvotes += 1;
                    if (userVote === 'upvote') newUpvotes -= 1;
                    setUserVote('downvote');
                }
            }
            return { upvotes: newUpvotes, downvotes: newDownvotes };
        });

        // 🚨 API CALL INTEGRATION POINT 2: Handle Voting
        console.log(`Sending API call to register vote: ${type} for issue ${issue.title}`);
        // Your team lead will implement the actual fetch request here.
    };
    
    const handlePostComment = (e) => {
        e.preventDefault();
        const text = commentText.trim();
        if (text.length === 0) return;

        const newComment = {
            id: Date.now(), // Unique ID for key
            author: "Current User", // Mock current user
            initials: "CU",
            timeAgo: "Just now",
            text: text,
            role: "user"
        };

        // Optimistic UI Update
        setLocalComments(prev => [newComment, ...prev]);
        setCommentText(''); 

        // 🚨 API CALL INTEGRATION POINT 3: Post Comment
        console.log("Sending API call to post comment:", newComment);
        // Your team lead will implement the actual fetch request here.
    };

    // --- Status Logic ---
    let progressWidth = '0%';
    let stepReceived = false;
    let stepInReview = false;
    let stepResolved = false;

    if (issue.status === 'received') {
        progressWidth = '25%';
        stepReceived = true;
    } else if (issue.status === 'in-review') {
        progressWidth = '50%';
        stepReceived = true;
        stepInReview = true;
    } else if (issue.status === 'resolved') {
        progressWidth = '100%';
        stepReceived = true;
        stepInReview = true;
        stepResolved = true;
    }

    return (
        <>
            {/* Issue Header and Details Card */}
            <div className="card">
                <header className="issue-header">
                    <h1>{issue.title}</h1>
                    <div className="issue-tags">
                        <span className={`tag tag-priority-${issue.priority}`}>{issue.priority} Priority</span>
                        <span className={`tag tag-status-${issue.status}`}>{issue.status.replace('-', ' ')}</span>
                        <span className={`tag tag-type-${issue.type}`}>{issue.type}</span>
                    </div>
                    <p className="issue-meta">
                        <Clock size={12} style={{marginRight: '5px', verticalAlign: 'middle'}} />
                        {issue.reporter} | {issue.date} | {issue.address}
                    </p>
                </header>
                
                {/* Image Section */}
                <div className="issue-image-container">
                    <img src={issue.imageUrl} alt={issue.title} />
                </div>
                
                <div className="issue-details">
                    <h3>Description</h3>
                    <p>{issue.description}</p>
                    
                    <h3>Landmark</h3>
                    <p>{issue.landmark}</p>
                    
                    <h3>Location Coordinates</h3>
                    <div className="location-grid">
                        <div className="location-item">
                            <span>Latitude</span>
                            <strong>{issue.coordinates.latitude}</strong>
                        </div>
                        <div className="location-item">
                            <span>Longitude</span>
                            <strong>{issue.coordinates.longitude}</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Complaint Status Card */}
            <div className="card">
                <h3>Complaint Status</h3>
                <div className="status-progress-bar">
                    <div className="progress-fill" style={{ width: progressWidth }}></div>
                </div>
                <div className="status-steps">
                    <StatusStep label="Received" icon={Clock} isActive={issue.status === 'received'} isCompleted={stepReceived} />
                    <StatusStep label="In Review" icon={Clock} isActive={issue.status === 'in-review'} isCompleted={stepInReview} />
                    <StatusStep label="Resolved" icon={CheckCircle} isActive={issue.status === 'resolved'} isCompleted={stepResolved} />
                </div>
            </div>

            {/* Support Voting Card */}
            <div className="card">
                <div className="support-section">
                    <div>
                        <strong>Support this complaint</strong><br/>
                        Vote to help prioritize this issue.
                    </div>
                    <div className="vote-buttons">
                        <div 
                            className={`vote-button upvote-button ${userVote === 'upvote' ? 'active-vote' : ''}`} 
                            onClick={() => handleVote('upvote')}
                        >
                            <ThumbsUp size={16} />
                            {votes.upvotes} Upvotes
                        </div>
                        <div 
                            className={`vote-button downvote-button ${userVote === 'downvote' ? 'active-vote' : ''}`} 
                            onClick={() => handleVote('downvote')}
                        >
                            <ThumbsDown size={16} />
                            {votes.downvotes} Downvotes
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Card */}
            <div className="card">
                <h3 className="comments-header">Comments ({localComments.length})</h3>

                <form className="comment-input-area" onSubmit={handlePostComment}>
                    <textarea
                        className="comment-textarea"
                        placeholder="Share your thoughts or additional information..."
                        maxLength={MAX_CHARS}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    ></textarea>
                    <div className="comment-actions">
                        <span className="comment-chars">
                            {commentText.length}/{MAX_CHARS} characters
                        </span>
                        <button type="submit" className="post-comment-button" disabled={commentText.trim().length === 0}>
                            <Send size={16} style={{transform: 'rotate(45deg)'}} />
                            Post Comment
                        </button>
                    </div>
                </form>

                <div className="comment-list">
                    {localComments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <div className={`comment-avatar comment-avatar-${comment.role}`}>
                                {comment.initials}
                            </div>
                            <div className="comment-content">
                                <strong>{comment.author}</strong>
                                <span>{comment.timeAgo}</span>
                                <p className="comment-text">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ViewIssueComponent;
