import React from 'react';
import { FileText, Clock, AlertCircle, CheckCircle, Users, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="stat-card">
    <div className="stat-card-header-bar" />
    <div className="stat-card-content">
      <div>
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">{value}</p>
      </div>
      <Icon className="stat-card-icon" />
    </div>
  </div>
);

export default function DashboardStats({ stats }) {
  return (
    <div className="stats-grid">
      <StatCard title="Total Issues" value={stats.total} icon={FileText} />
      <StatCard title="Pending" value={stats.pending} icon={Clock} />
      <StatCard title="In Progress" value={stats.inProgress} icon={AlertCircle} />
      <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} />
      <StatCard title="Active Users" value={stats.activeUsers} icon={Users} />
      <StatCard title="This Month" value={stats.thisMonth} icon={TrendingUp} />
    </div>
  );
}
