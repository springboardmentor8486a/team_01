import React, { useState } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
// Styling imported via IssueDetailPage.jsx

// Lightweight JWT payload parser to get current user id for comment ownership checks
const getCurrentUserId = () => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        const payload = JSON.parse(atob((token.split('.')[1]) || ''));
        return payload?.userId || payload?.user?.userId || null;
    } catch {
        return null;
    }
};

// Helper component for the status steps
const StatusStep = ({ label, isActive, isCompleted }) => {
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
    const [localComments, setLocalComments] = useState(issue.comments || []);
    const [votes, setVotes] = useState(issue.initialVotes);
    const [userVote, setUserVote] = useState(null); // 'upvote', 'downvote', or null
    const currentUserId = getCurrentUserId();
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    
    const MAX_CHARS = 500;

    // --- Interaction Handlers ---

    const handleVote = async (type) => {
        if (!issue?.id) {
            console.warn('Issue id missing; cannot vote');
            return;
        }

        const prevVotes = { ...votes };
        const prevUserVote = userVote;

        // Optimistic UI update
        setVotes(prev => {
            let up = prev.upvotes;
            let down = prev.downvotes;

            if (type === 'upvote') {
                if (userVote === 'upvote') { // undo upvote
                    up -= 1;
                    setUserVote(null);
                } else { // set upvote (clear downvote if set)
                    up += 1;
                    if (userVote === 'downvote') down -= 1;
                    setUserVote('upvote');
                }
            } else { // downvote
                if (userVote === 'downvote') { // undo downvote
                    down -= 1;
                    setUserVote(null);
                } else { // set downvote (clear upvote if set)
                    down += 1;
                    if (userVote === 'upvote') up -= 1;
                    setUserVote('downvote');
                }
            }
            return { upvotes: up, downvotes: down };
        });

        try {
            const url = `http://localhost:3000/api/issues/${issue.id}/${type}`;
            const token = localStorage.getItem('accessToken');
            const { data } = await axios.post(
                url,
                {},
                {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }
            );

            // If backend responds with updated arrays/counts, sync from server
            if (data) {
                const upLen = Array.isArray(data.upvotes) ? data.upvotes.length
                             : (typeof data.upvotes === 'number' ? data.upvotes : undefined);
                const downLen = Array.isArray(data.downvotes) ? data.downvotes.length
                               : (typeof data.downvotes === 'number' ? data.downvotes : undefined);

                if (typeof upLen === 'number' || typeof downLen === 'number') {
                    setVotes(prev => ({
                        upvotes: typeof upLen === 'number' ? upLen : prev.upvotes,
                        downvotes: typeof downLen === 'number' ? downLen : prev.downvotes
                    }));
                }
            }
        } catch (err) {
            console.error('Vote request failed', err);
            // Rollback optimistic update
            setVotes(prevVotes);
            setUserVote(prevUserVote);
        }
    };
    
    const handlePostComment = async (e) => {
        e.preventDefault();
        const text = commentText.trim();
        if (text.length === 0) return;

        // optimistic add
        const optimisticId = Date.now();
        const optimisticComment = {
            id: optimisticId,
            userId: currentUserId,
            author: "You",
            initials: "Y",
            timeAgo: "Just now",
            text,
            role: "user"
        };
        setLocalComments(prev => [optimisticComment, ...prev]);
        setCommentText('');

        try {
            const token = localStorage.getItem('accessToken');
            const url = `http://localhost:3000/api/issues/${issue.id}/comment`;
            const { data } = await axios.post(
                url,
                { text },
                {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }
            );

            if (data && data.comment) {
                const serverComment = {
                    id: data.comment._id || optimisticId,
                    userId: data.comment.userId || currentUserId,
                    author: "You",
                    initials: "Y",
                    timeAgo: "Just now",
                    text: data.comment.text || text,
                    role: "user"
                };
                // replace optimistic with server comment
                setLocalComments(prev => [serverComment, ...prev.filter(c => c.id !== optimisticId)]);
            }
        } catch (err) {
            console.error('Post comment failed', err);
            // rollback optimistic
            setLocalComments(prev => prev.filter(c => c.id !== optimisticId));
            setCommentText(text);
        }
    };

    // Delete a comment (only if owned by current user)
    const handleDeleteComment = async (commentId) => {
        const prev = [...localComments];
        setLocalComments(prev.filter(c => c.id !== commentId));
        try {
            const token = localStorage.getItem('accessToken');
            const url = `http://localhost:3000/api/issues/${issue.id}/comment/${commentId}`;
            await axios.delete(url, {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
        } catch (err) {
            console.error('Delete comment failed', err);
            // rollback
            setLocalComments(prev);
        }
    };

    // Begin editing a comment
    const startEdit = (comment) => {
        setEditingId(comment.id);
        setEditText(comment.text || '');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    // Save edited comment
    const saveEdit = async (commentId) => {
        const old = localComments.find(c => c.id === commentId)?.text;
        // optimistic update
        setLocalComments(prev => prev.map(c => c.id === commentId ? { ...c, text: editText } : c));
        try {
            const token = localStorage.getItem('accessToken');
            const url = `http://localhost:3000/api/issues/${issue.id}/comment/${commentId}`;
            const { data } = await axios.put(url, { text: editText }, {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            // sync with server response
            if (data && data.comment) {
                setLocalComments(prev => prev.map(c => c.id === commentId ? { ...c, text: data.comment.text || editText } : c));
            }
            setEditingId(null);
            setEditText('');
        } catch (err) {
            console.error('Update comment failed', err);
            // rollback
            setLocalComments(prev => prev.map(c => c.id === commentId ? { ...c, text: old } : c));
        }
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
                                {comment.initials || 'U'}
                            </div>
                            <div className="comment-content">
                                <div className="comment-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                    <div className="comment-author">
                                        <strong>{comment.author || 'User'}</strong>
                                        <span style={{ marginLeft: 10 }}>{comment.timeAgo || ''}</span>
                                    </div>
                                    {comment.userId && currentUserId && String(comment.userId) === String(currentUserId) && (
                                        <div className="comment-actions-inline" style={{ display: 'flex', gap: 8 }}>
                                            {editingId === comment.id ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="post-comment-button"
                                                        onClick={() => saveEdit(comment.id)}
                                                        style={{ padding: '6px 12px' }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="post-comment-button"
                                                        onClick={cancelEdit}
                                                        style={{ padding: '6px 12px' }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="post-comment-button"
                                                        onClick={() => startEdit(comment)}
                                                        style={{ padding: '6px 12px' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="post-comment-button"
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        style={{ padding: '6px 12px' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {editingId === comment.id ? (
                                    <textarea
                                        className="comment-textarea"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        style={{ marginTop: 8 }}
                                    />
                                ) : (
                                    <p className="comment-text">{comment.text}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ViewIssueComponent;
