import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardStats from '../components/admin/DashboardStats';
import DashboardCharts from '../components/admin/DashboardCharts';
import IssueManagementTable from '../components/admin/IssueManagementTable';
import UserManagementTable from '../components/admin/UserManagementTable';
// import { mockUsers } from '../components/source';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    activeUsers: 0,
    thisMonth: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:3000/api/admin/chart/stat', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        // Transform API response to chartData format
        const transformedData = data.months.map((month, index) => ({
          month,
          issues: data.reported[index],
          resolved: data.resolved[index],
        }));
        setChartData(transformedData);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:3000/api/admin/circle/stat', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        // Color mapping for known categories
        const colorMap = {
          'Road Maintenance': '#2563eb',
          'Lighting': '#3b82f6',
          'Waste Management': '#60a5fa',
          'Vandalism': '#93c5fd',
          'Other': '#dbeafe',
        };
        // Transform API response to categoryData format
        const transformedCategoryData = data.categories.map(item => ({
          name: item.category,
          value: item.percentage,
          color: colorMap[item.category] || '#cccccc', // default color if not found
        }));
        setCategoryData(transformedCategoryData);
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      }
    };

    fetchCategoryData();
  }, []);

  useEffect(() => {
        const fetchIssues = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:3000/api/admin/issuemanagement', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data;
                // Transform data to flatten issue object and normalize status and priority
                const transformedIssues = data
                    .filter(item => item._id || item.id) // filter out items without valid id
                    .map(item => ({
                        id: item._id || item.id,
                        issue: item.issue || {},
                        status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : '',
                        priority: item.priority ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1).toLowerCase() : '',
                        category: item.category || '',
                        reportedBy: item.reportedBy || '',
                        date: item.date || '',
                    }));
                setIssues(transformedIssues);
            } catch (error) {
                console.error('Failed to fetch issues:', error);
            }
        };

        fetchIssues();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:3000/api/admin/usermanagement', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(
        'http://localhost:3000/api/auth/logout',
        null,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        }
      );
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      if (axios?.defaults?.headers?.common?.Authorization) {
        delete axios.defaults.headers.common.Authorization;
      }
      navigate('/login');
    }
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
          <button 
                className="admin-logout-button" 
                onClick={handleLogout}
            >
                Logout
            </button>
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
              <IssueManagementTable issues={issues} />
            </TabsContent>
            <TabsContent value="users" className="management-tabs-content">
              <UserManagementTable users={users} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
