import React from 'react';
import { CircleCheck, CircleAlert, ThumbsUp, ThumbsDown, Send, Clock, User, Calendar, MapPin, ListEnd } from 'lucide-react';

// --- Badges ---
export const IssueBadge = ({ type, children }) => {
    let classes = 'badge ';
    switch (type) {
        case 'priority': classes += 'badge-priority'; break;
        case 'status': classes += 'badge-status'; break;
        case 'tag': classes += 'badge-tag'; break;
        default: classes += 'badge-tag';
    }
    return <span className={classes}>{children}</span>;
};

// --- Metadata Item ---
export const MetadataItem = ({ Icon, text }) => (
    <div className="metadata-item-style">
        <Icon />
        <span>{text}</span>
    </div>
);

// --- Status Timeline ---
const statusSteps = [
    { name: 'Received', icon: CircleAlert },
    { name: 'In Review', icon: Clock },
    { name: 'Resolved', icon: CircleCheck },
];

export const ComplaintStatus = ({ currentStatus }) => {
    const currentIndex = statusSteps.findIndex(step => step.name === currentStatus);
    const progressPercent = (currentIndex / (statusSteps.length - 1)) * 100;

    return (
        <div className="card">
            <h2 className="heading-2">Complaint Status</h2>
            <div className="status-timeline">
                {/* Progress Bar Track */}
                <div className="progress-track">
                    {/* Progress Fill */}
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>

                {/* Status Steps */}
                <div className="status-steps">
                    {statusSteps.map((step, index) => {
                        const isActive = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        const Icon = step.icon;

                        return (
                            <div key={step.name} className="status-step">
                                {/* Icon Circle */}
                                <div className={`step-icon-circle ${isActive ? 'step-icon-active' : 'step-icon-inactive'}`}>
                                    <Icon size={18} />
                                </div>
                                {/* Label */}
                                <span className={`step-label ${isCurrent ? 'step-label-active' : 'step-label-inactive'}`}>
                                    {step.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


// --- Support (Voting) Section ---

const VoteButton = ({ type, count, Icon, isSelected, onClick }) => {
    const defaultClasses = isSelected ? 'vote-button-selected' : 'vote-button-default';

    return (
        <button
            onClick={() => onClick(type)}
            className={`vote-button ${defaultClasses}`}
            aria-pressed={isSelected}
        >
            <Icon className="vote-button-icon" />
            <span className="vote-button-count">{count}</span>
            <span className="vote-button-label">{type === 'up' ? 'Upvotes' : 'Downvotes'}</span>
        </button>
    );
};

export const SupportSection = ({ upvotes, downvotes, userVoteStatus, onVote }) => {
    return (
        <div className="card">
            <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>Support this complaint</h2>
            <p className="support-text">Vote to help prioritize this issue (only once!)</p>
            <div className="vote-buttons">
                <VoteButton
                    type="up"
                    count={upvotes}
                    Icon={ThumbsUp}
                    isSelected={userVoteStatus === 'up'}
                    onClick={onVote}
                />
                <VoteButton
                    type="down"
                    count={downvotes}
                    Icon={ThumbsDown}
                    isSelected={userVoteStatus === 'down'}
                    onClick={onVote}
                />
            </div>
        </div>
    );
};

// --- Comment Items ---
export const CommentItem = ({ comment }) => (
    <div className="comment-item">
        {/* User Initial Avatar */}
        <div className="comment-avatar">
            {comment.initial}
        </div>
        <div className="comment-content">
            <div className="comment-meta">
                <p className="comment-user">{comment.user}</p>
                <p className="comment-time">{comment.timeAgo}</p>
            </div>
            <p className="comment-text">{comment.text}</p>
        </div>
    </div>
);

// --- Comment Input Form ---
export const CommentForm = ({ onPostComment }) => {
    const [commentText, setCommentText] = React.useState('');
    const maxLength = 500;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim() && commentText.length <= maxLength) {
            onPostComment(commentText);
            setCommentText('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                maxLength={maxLength}
                placeholder="Share your thoughts or additional information..."
                rows="4"
                className="comment-textarea"
            ></textarea>
            <div className="comment-footer">
                <p className="char-count">
                    {commentText.length}/{maxLength} characters
                </p>
                <button
                    type="submit"
                    disabled={!commentText.trim() || commentText.length > maxLength}
                    className="post-button"
                >
                    <Send size={16} style={{ marginRight: '0.5rem' }} />
                    Post Comment
                </button>
            </div>
        </form>
    );
};
