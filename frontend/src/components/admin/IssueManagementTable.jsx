import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Search, Eye, Edit } from 'lucide-react';

export default function IssueManagementTable({ issues }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-badge pending';
      case 'in progress': return 'status-badge in-progress';
      case 'resolved': return 'status-badge resolved';
      default: return 'status-badge';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="issue-management-container">
      {/* Search and Filter bar is now restructured */}
      <div className="table-filters">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <Input placeholder="Search issues..." className="search-input" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="filter-trigger">
            <Filter className="filter-icon" />
            <span>All Status</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="table-wrapper">
        <div className="table-header-info">
          <h3 className="table-title">All Issues</h3>
          <p className="table-description">Manage and update issue status</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="actions-header">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id} className="table-row">
                <TableCell>
                  <div className="issue-title">{issue.title}</div>
                  <div className="issue-location">{issue.location}</div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusClass(issue.status)}>{issue.status}</Badge>
                </TableCell>
                <TableCell>
                  <span className={getPriorityClass(issue.priority)}>{issue.priority}</span>
                </TableCell>
                <TableCell>{issue.category}</TableCell>
                <TableCell>{issue.reportedBy}</TableCell>
                <TableCell>{issue.date}</TableCell>
                <TableCell className="actions-cell">
                  <div className="actions-wrapper">
                    <Button variant="outline" size="icon" className="action-button">
                      <Eye className="action-icon" />
                    </Button>
                    <Button variant="outline" size="icon" className="action-button">
                      <Edit className="action-icon" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}