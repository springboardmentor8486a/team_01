import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Eye, Calendar, Edit } from 'lucide-react';
import './IssueCard.css';

export default function IssueCard({ issue, onEdit, onView }) {
  const [likes, setLikes] = useState(issue.likes || 0);
  const [dislikes, setDislikes] = useState(issue.dislikes || 0);

  return (
    <div className="issue-card">
      <div className="card-accent" data-status={issue.status}></div>
      <img className="issue-img" src={issue.image} alt={issue.title} />
      <div className="issue-body">
        <h3 className="issue-title">{issue.title}</h3>
        <p className="issue-desc">{issue.description}</p>

        <div className="issue-tags">
          <span className={'tag status '+issue.status.replace(' ','-')}>{issue.status}</span>
          <span className="tag category">{issue.category}</span>
        </div>

        <div className="issue-actions">
          <button onClick={()=>setLikes(likes+1)}><ThumbsUp size={16}/> <span>{likes}</span></button>
          <button onClick={()=>setDislikes(dislikes+1)}><ThumbsDown size={16}/> <span>{dislikes}</span></button>
          <button onClick={()=>onView(issue)}><MessageSquare size={16}/> <span>{issue.comments}</span></button>
          <button onClick={()=>onEdit(issue)}><Edit size={16}/> <span>Edit</span></button>
        </div>

        <div className="issue-footer">
          <div><Calendar size={14}/> <small>{issue.date}</small></div>
          <div className="view-link" onClick={()=>onView(issue)}><Eye size={14}/> <small>View</small></div>
        </div>
      </div>
    </div>
  );
}
