import React from 'react';

export default function IssueCard({ issue, onOpen }) {
  const tags = Array.isArray(issue.tags) ? issue.tags : [];
  const likes = typeof issue.likes === 'number' ? issue.likes : 0;
  const dislikes = typeof issue.dislikes === 'number' ? issue.dislikes : 0;

  return (
    <div className={'card ' + (issue.border || '')}>
      <img src={issue.image} alt={issue.title} />
      <h3>{issue.title}</h3>
      <p>{issue.description}</p>
      <div className="badges">
        <div className="badge">{issue.status}</div>
        {tags.map((t, i) => (
          <div key={i} className="badge">{t}</div>
        ))}
      </div>
      <div className="meta">
        <div className="actions">
          <div className="icon-btn">👍 {likes}</div>
          <div className="icon-btn">👎 {dislikes}</div>
          <div style={{ width: 8 }} />
          <div className="date">📅 {issue.date}</div>
        </div>
        <div>
          <span className="view" onClick={() => onOpen(issue)}>View</span>
        </div>
      </div>
    </div>
  );
}
