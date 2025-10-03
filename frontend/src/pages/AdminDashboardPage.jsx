import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardStats from '../components/admin/DashboardStats';
import DashboardCharts from '../components/admin/DashboardCharts';
import IssueManagementTable from '../components/admin/IssueManagementTable';
import UserManagementTable from '../components/admin/UserManagementTable';
import { mockIssues, mockUsers, chartData, categoryData } from '../components/source';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const stats = {
    total: mockIssues.length,
    pending: mockIssues.filter(i => i.status === 'pending').length,
    inProgress: mockIssues.filter(i => i.status === 'in progress').length,
    resolved: mockIssues.filter(i => i.status === 'resolved').length,
    activeUsers: 4,
    thisMonth: 18,
  };

  return (
    <div className="admin-dashboard-container">
      <AdminHeader />
      <main className="admin-main-content">
        <div className="welcome-banner">
          <h1 className="welcome-banner-title">
            Hello, welcome to <span className="welcome-banner-highlight">Clean Street Admin!</span>
          </h1>
          <p className="welcome-banner-subtitle">
            Manage and track all civic issues across the community
          </p>
        </div>

        <DashboardStats stats={stats} />

        {/* This is the new, dedicated container for the charts */}
        <div className="charts-row">
          <DashboardCharts chartData={chartData} categoryData={categoryData} />
        </div>

        {/* The management section is now separate from the charts */}
        <div className="management-section">
          <Tabs defaultValue="issues">
            <TabsList className="management-tabs-list">
              <TabsTrigger value="issues" className="management-tabs-trigger">Issue Management</TabsTrigger>
              <TabsTrigger value="users" className="management-tabs-trigger">User Management</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="management-tabs-content">
              <IssueManagementTable issues={mockIssues} />
            </TabsContent>
            <TabsContent value="users" className="management-tabs-content">
              <UserManagementTable users={mockUsers} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
