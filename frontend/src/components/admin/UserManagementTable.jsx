import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Search, Edit, Trash2 } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'John Citizen', email: 'john.citizen@example.com', role: 'user', location: 'Downtown District', joinDate: '20/9/2024' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'volunteer', location: 'Maple Creek', joinDate: '15/9/2024' },
  { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'user', location: 'Oakridge', joinDate: '23/9/2024' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'admin', location: 'City Hall', joinDate: '18/9/2024' },
];

export default function UserManagementTable({ users = mockUsers }) {
  const getRoleClass = (role) => {
    switch (role) {
      case 'admin': return 'role-badge admin';
      case 'volunteer': return 'role-badge volunteer';
      default: return 'role-badge user';
    }
  };

  const userList = users.length > 0 ? users : mockUsers;

  return (
    <div className="user-management-container">
      <div className="table-filters">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <Input placeholder="Search users by name or email..." className="search-input" />
        </div>
        <div className="filter-actions">
          <Select defaultValue="all">
            <SelectTrigger className="filter-trigger">
              <Filter className="filter-icon" />
              <span>All Roles</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="volunteer">Volunteer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="table-wrapper">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="actions-header">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.map((user) => (
              <TableRow key={user.id} className="table-row">
                <TableCell>
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleClass(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell className="actions-cell">
                  <div className="actions-wrapper">
                    <Button variant="outline" size="icon" className="action-button">
                      <Edit className="action-icon" />
                    </Button>
                    <Button variant="outline" size="icon" className="action-button delete-button">
                      <Trash2 className="action-icon" />
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
