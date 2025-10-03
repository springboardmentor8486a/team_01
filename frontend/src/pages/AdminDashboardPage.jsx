import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardStats from '../components/admin/DashboardStats';
import DashboardCharts from '../components/admin/DashboardCharts';
import IssueManagementTable from '../components/admin/IssueManagementTable';
import UserManagementTable from '../components/admin/UserManagementTable';
import { mockIssues, mockUsers, chartData, categoryData } from '../components/source';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    activeUsers: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Corrected key to match login storage
        const response = await axios.get('http://localhost:3000/api/admin/stat', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setStats({
          total: data.totalIssues,
          pending: data.pending,
          inProgress: data.inProgress,
          resolved: data.resolved,
          activeUsers: data.activeUsers,
          thisMonth: data.thisMonth,
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      }
    };

    fetchStats();
  }, []);

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
