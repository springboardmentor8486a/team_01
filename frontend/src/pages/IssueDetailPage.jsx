import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, User, Calendar, MapPin, ListEnd, Clock, ListEnd as ListEndIcon } from 'lucide-react';
// Imports for external files
import './IssueDetailPage.css'; 
import { IssueBadge, MetadataItem, ComplaintStatus, SupportSection, CommentItem, CommentForm } from '../components/ViewIssueComponent.jsx';

// --- MOCK DATA SIMULATION ---
// In a real MERN app, the issue ID would be read from the URL parameter (e.g., useParams() in React Router)
const MOCK_ISSUE_ID = 'issue-123';

const getMockUserId = () => {
    // Simulates getting a unique user identifier, necessary for the "vote only once" logic
    let userId = sessionStorage.getItem('mockUserId');
    if (!userId) {
        userId = crypto.randomUUID();
        sessionStorage.setItem('mockUserId', userId);
    }
    return userId;
};

// Placeholder for the structure of data expected from the backend
const mockIssueDetails = {
    id: MOCK_ISSUE_ID,
    title: 'Large Pothole on Main Street',
    priority: 'High Priority',
    status: 'IN REVIEW',
    tag: 'pothole',
    submittedBy: 'Demo User',
    date: 'Oct 7, 2025',
    time: '10:38 AM',
    address: '123 Main Street, Downtown',
    image: 'https://placehold.co/800x450/3b82f6/ffffff?text=Reported+Issue+Image',
    description: "There is a significant pothole on Main Street near the intersection with Oak Avenue. It's approximately 2 feet wide and 6 inches deep, posing a serious hazard to vehicles and pedestrians. This has been causing traffic slowdowns during peak hours.",
    landmark: 'Near City Hall',
    latitude: 40.712800,
    longitude: -74.006000,
    currentStatus: 'In Review',
    initialUpvotes: 24,
    initialDownvotes: 2,
};

const initialMockComments = [
    { id: 3, user: 'City Admin', initial: 'C', timeAgo: '1d ago', text: 'We have received your report and our crew will be dispatched to assess and repair this pothole within the next 3-5 business days. Thank thanks and hope the issue resolves quickly you.' },
    { id: 2, user: 'Mike Chen', initial: 'M', timeAgo: '2d ago', text: 'Thanks for reporting this. The city needs to prioritize fixing this before someone gets hurt.' },
    { id: 1, user: 'Sarah Johnson', initial: 'S', timeAgo: '3d ago', text: 'I drive through here every day and this pothole is getting worse. Almost damaged my tire yesterday!' },
];


// --- API MOCK FUNCTIONS (Replace with MERN API calls) ---

// Mock function to simulate fetching all issue data
const fetchIssueDetails = async (issueId, mockUserId) => {
    // *** TEAM LEAD INTEGRATION POINT: Replace this with an actual API call (GET /api/issues/:issueId) ***
    await new Promise(resolve => setTimeout(resolve, 300)); 

    // Check mock vote status from local storage
    const storedVote = localStorage.getItem(`issue-${issueId}-vote-${mockUserId}`);
    
    return {
        issue: mockIssueDetails,
        comments: initialMockComments,
        userVote: storedVote || null,
        votes: {
            upvotes: mockIssueDetails.initialUpvotes,
            downvotes: mockIssueDetails.initialDownvotes,
        }
    };
};

// Mock function to simulate a vote update (real-time enforcement)
const updateVote = async (issueId, mockUserId, voteType) => {
    // *** TEAM LEAD INTEGRATION POINT: Replace this with an actual API call (POST /api/issues/:issueId/vote) ***
    await new Promise(resolve => setTimeout(resolve, 100)); 
    return { success: true };
};

// Mock function to post a new comment
const postComment = async (issueId, mockUserId, text) => {
    // *** TEAM LEAD INTEGRATION POINT: Replace this with an actual API call (POST /api/issues/:issueId/comments) ***
    await new Promise(resolve => setTimeout(resolve, 100)); 
    
    return {
        id: Date.now(),
        user: 'Current User', // Replace with actual user name
        initial: 'CU', // Replace with user initials
        timeAgo: 'Just now',
        text: text,
    };
};


// --- MAIN APPLICATION COMPONENT ---
const App = ({ issueId = MOCK_ISSUE_ID }) => {
    const mockUserId = useMemo(() => getMockUserId(), []);

    const [issue, setIssue] = useState(null);
    const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
    const [userVoteStatus, setUserVoteStatus] = useState(null); // 'up', 'down', or null
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Simulate fetching issue details, votes, and user's vote status
                const data = await fetchIssueDetails(issueId, mockUserId);
                
                setIssue(data.issue);
                setVotes(data.votes);
                setComments(data.comments);
                setUserVoteStatus(data.userVote);
                
                setError(null);
            } catch (err) {
                console.error("Failed to load issue details:", err);
                setError("Could not load issue details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [issueId, mockUserId]);

    // Handle the Upvote/Downvote action (Real-time simulation)
    const handleVote = useCallback(async (type) => {
        if (!issue) return;
        
        const newVotes = { ...votes };
        const originalVotes = { ...votes };
        const originalUserVoteStatus = userVoteStatus;
        let newUserVoteStatus = type;

        if (userVoteStatus === type) {
            // Unvote: Clicked the current vote again
            if (type === 'up') newVotes.upvotes -= 1;
            if (type === 'down') newVotes.downvotes -= 1;
            newUserVoteStatus = null;
            localStorage.removeItem(`issue-${issueId}-vote-${mockUserId}`);
        } else {
            // Change vote or First vote
            if (userVoteStatus === 'up') newVotes.upvotes -= 1; // Unvote previous upvote
            if (userVoteStatus === 'down') newVotes.downvotes -= 1; // Unvote previous downvote

            if (type === 'up') newVotes.upvotes += 1; // Vote up
            if (type === 'down') newVotes.downvotes += 1; // Vote down
            
            localStorage.setItem(`issue-${issueId}-vote-${mockUserId}`, type);
        }

        // Optimistic UI Update (assumes the API call will succeed)
        setVotes(newVotes);
        setUserVoteStatus(newUserVoteStatus);

        try {
            const apiResult = await updateVote(issueId, mockUserId, newUserVoteStatus);
            if (!apiResult.success) {
                // Revert state on server failure
                setVotes(originalVotes);
                setUserVoteStatus(originalUserVoteStatus);
                console.error("Vote failed on backend.");
                setError("Voting failed on the server. Please try again.");
            }
        } catch (err) {
            console.error("API error during voting:", err);
            // CRITICAL: Revert optimistic state on network/API failure
            setVotes(originalVotes);
            setUserVoteStatus(originalUserVoteStatus);
            setError("Voting failed due to a network error.");
        }
    }, [issueId, mockUserId, userVoteStatus, votes, issue]);

    // Handle Comment Submission
    const handlePostComment = useCallback(async (text) => {
        if (!issue) return;
        
        try {
            // Post comment to MERN backend
            const newComment = await postComment(issueId, mockUserId, text);
            // Prepend the new comment to the list for real-time appearance
            setComments(prevComments => [newComment, ...prevComments]);
        } catch (err) {
            console.error("API error during comment posting:", err);
            setError("Failed to post comment. Please check your connection.");
        }
    }, [issueId, mockUserId, issue]);


    if (loading) {
        return (
            <div className="issue-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9fafb' }}>
                <div style={{ fontSize: '1.5rem', color: '#3b82f6', animation: 'pulse 1s infinite' }}>
                    Loading Issue Details...
                </div>
            </div>
        );
    }

    if (error) {
         return (
            <div className="issue-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9fafb' }}>
                <div style={{ padding: '2rem', borderRadius: '8px', border: '1px solid #ef4444', color: '#ef4444', backgroundColor: '#ffffff' }}>
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="issue-page">
            <div className="issue-container">
                {/* Back to Dashboard Link */}
                <a href="#" className="back-link">
                    <ChevronLeft size={20} style={{ marginRight: '0.25rem' }} />
                    Back to Dashboard
                </a>

                {/* Main Content Card */}
                <main className="shadow-card" style={{ padding: '0', backgroundColor: 'var(--card-bg)' }}>
                    <div className="issue-header">
                        {/* Issue Title and Badges */}
                        <h1 className="issue-title">{issue.title}</h1>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            <IssueBadge type="priority">{issue.priority}</IssueBadge>
                            <IssueBadge type="status">{issue.status}</IssueBadge>
                            <IssueBadge type="tag">{issue.tag}</IssueBadge>
                        </div>

                        {/* Metadata (User, Date, Location) */}
                        <div className="metadata-group">
                            <MetadataItem Icon={User} text={issue.submittedBy} />
                            <MetadataItem Icon={Calendar} text={issue.date} />
                            <MetadataItem Icon={Clock} text={issue.time} />
                            <MetadataItem Icon={MapPin} text={issue.address} />
                        </div>
                    </div>

                    {/* Issue Image */}
                    <div style={{ padding: '0 1rem 1rem 1rem' }}>
                        <img
                            src={issue.image}
                            alt="Reported issue"
                            className="issue-image"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x450/6B7280/ffffff?text=Image+Not+Available'; }}
                        />
                    </div>

                    <div style={{ padding: '0 0 2rem 0' }}>
                        {/* Description and Location Card */}
                        <div className="info-grid">
                            {/* Description Section */}
                            <div className="card" style={{ marginTop: '0', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                                <h2 className="heading-2">Description</h2>
                                <p style={{ color: 'var(--text-medium)', lineHeight: '1.6' }}>{issue.description}</p>
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                                    <p style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Landmark</p>
                                    <p style={{ color: 'var(--text-medium)' }}>{issue.landmark}</p>
                                </div>
                            </div>

                            {/* Location Coordinates Card */}
                            <div className="card" style={{ marginTop: '0', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                                <h2 className="heading-2">Location Coordinates</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div className="location-coord-item">
                                        <span>Latitude</span>
                                        <span>{issue.latitude}</span>
                                    </div>
                                    <div className="location-coord-item">
                                        <span>Longitude</span>
                                        <span>{issue.longitude}</span>
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--blue-light)', borderRadius: '8px', color: 'var(--primary-dark)', cursor: 'pointer' }}>
                                    <MapPin size={20} style={{ marginRight: '0.5rem' }} />
                                    View on Map (Placeholder)
                                </div>
                            </div>
                        </div>

                        {/* Complaint Status Timeline */}
                        <div style={{ padding: '0 2rem' }}>
                            <ComplaintStatus currentStatus={issue.currentStatus} />
                        </div>

                        {/* Support (Voting) Section */}
                        <div style={{ padding: '0 2rem' }}>
                            <SupportSection
                                upvotes={votes.upvotes}
                                downvotes={votes.downvotes}
                                userVoteStatus={userVoteStatus}
                                onVote={handleVote}
                            />
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="card shadow-card" style={{ marginTop: '2rem', padding: '2rem', border: 'none' }}>
                        <h2 className="comments-header">
                            <ListEndIcon size={20} style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }} />
                            Comments ({comments.length})
                        </h2>

                        {/* Comment Input */}
                        <CommentForm onPostComment={handlePostComment} />

                        {/* Comment List */}
                        <div className="comment-list">
                            {comments.map((comment) => (
                                <CommentItem key={comment.id} comment={comment} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
