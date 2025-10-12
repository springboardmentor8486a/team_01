import React from 'react';
import IssueCard from './IssueCard';
import './IssueList.css';

export default function IssueList({ issues, onEdit, onView }) {
  return (
    <div className="issue-list">
      {issues.map(i => <IssueCard key={i.id} issue={i} onEdit={onEdit} onView={onView} />)}
    </div>
  );
}
