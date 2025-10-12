import React from 'react';
// Assuming IssueManagement is located relative to your pages folder
// Please verify this path matches your project structure!
import IssueManagement from '../components/IssueManagement'; 

/**
 * AdminDashboard Page
 * This component acts as the main container for the admin-level features.
 * Currently renders the IssueManagement dashboard.
 */
const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-layout">
      {/* In a real application, a sidebar or top navigation menu would go here.
        For now, we just render the main content.
      */}
      <main className="admin-content-area">
        <IssueManagement />
      </main>
    </div>
  );
};

export default AdminDashboard;
