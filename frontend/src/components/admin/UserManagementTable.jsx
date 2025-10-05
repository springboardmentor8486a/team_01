import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Filter, Search, Edit, Trash2, X } from 'lucide-react';

// const mockUsersData = [
//   { id: 1, name: 'John Citizen', email: 'john.citizen@example.com', role: 'user', location: 'Downtown District', joinDate: '20/9/2024' },
//   { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'volunteer', location: 'Maple Creek', joinDate: '15/9/2024' },
//   { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'user', location: 'Oakridge', joinDate: '23/9/2024' },
//   { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'admin', location: 'City Hall', joinDate: '18/9/2024' },
// ];

const Dialog = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return ( <div className="dialog-overlay" onClick={onClose}><div className="dialog-container" onClick={e => e.stopPropagation()}><button className="dialog-close-btn" onClick={onClose}><X size={20} /></button>{children}</div></div> );
};

const EditUserDialog = ({ user, onClose, onSave }) => {
    const handleSubmit = (e) => { e.preventDefault(); onSave(user.id, { role: e.target.role.value, location: e.target.location.value }); onClose(); };
    return ( <Dialog isOpen={!!user} onClose={onClose}><div className="dialog-header"><h3 className="dialog-title">Edit User: {user?.name}</h3></div><form className="dialog-content" onSubmit={handleSubmit}><div className="form-grid"><div className="form-item"><label htmlFor="role">Role</label><select id="role" name="role" defaultValue={user?.role} className="dialog-select"><option value="user">User</option><option value="volunteer">Volunteer</option><option value="admin">Admin</option></select></div><div className="form-item"><label htmlFor="location">Location</label><input id="location" name="location" defaultValue={user?.location} className="dialog-input" /></div></div><div className="dialog-footer"><button type="button" className="dialog-button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="dialog-button-primary">Save Changes</button></div></form></Dialog> );
};

const DeleteUserDialog = ({ user, onClose, onDelete }) => ( <Dialog isOpen={!!user} onClose={onClose}><div className="dialog-header"><h3 className="dialog-title">Confirm Deletion</h3><p className="dialog-subtitle">Are you sure you want to delete this user?</p></div><div className="dialog-content"><p className="delete-warning">User "{user?.name}" will be permanently removed.</p><div className="dialog-footer"><button type="button" className="dialog-button-secondary" onClick={onClose}>Cancel</button><button type="button" className="dialog-button-danger" onClick={() => { onDelete(user.id); onClose(); }}>Delete User</button></div></div></Dialog> );

export default function UserManagementTable({ users }) {
    const [localUsers, setLocalUsers] = useState(users);
    const [modalState, setModalState] = useState({ type: null, user: null });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('all');
    const dropdownRef = useRef(null);

    useEffect(() => {
        setLocalUsers(users);
    }, [users]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const openModal = (type, user) => setModalState({ type, user });
    const closeModal = () => setModalState({ type: null, user: null });
    const handleSave = async (id, updates) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.put(`http://localhost:3000/api/admin/usermanagement/${id}`, updates, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedUser = response.data;
            setLocalUsers(p => p.map(u => u.id === id ? { ...u, ...updatedUser } : u));
            alert('User updated successfully.');
        } catch (error) {
            console.error('Failed to update user:', error);
            alert('Failed to update user. Please try again.');
        }
    };
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`http://localhost:3000/api/admin/usermanagement/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLocalUsers(p => p.filter(u => u.id !== id));
            alert('User deleted successfully.');
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user. Please try again.');
        }
    };
    const handleRoleSelect = (role) => { setSelectedRole(role); setIsDropdownOpen(false); };
    const getRoleClass = (role) => `role-badge ${role.toLowerCase()}`;

    const filteredUsers = selectedRole === 'all' ? localUsers : localUsers.filter(user => user.role.toLowerCase() === selectedRole.toLowerCase());

    return (
        <>
            <div className="user-management-container">
                <div className="table-filters">
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input placeholder="Search users by name or email..." className="search-input" />
                    </div>
                    <div className="filter-actions" ref={dropdownRef}>
                        <button className="filter-trigger-btn" onClick={() => setIsDropdownOpen(p => !p)}>
                            <Filter className="filter-icon" />
                            <span>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => handleRoleSelect('all')}>All Roles</div>
                                <div className="dropdown-item" onClick={() => handleRoleSelect('user')}>User</div>
                                <div className="dropdown-item" onClick={() => handleRoleSelect('volunteer')}>Volunteer</div>
                                <div className="dropdown-item" onClick={() => handleRoleSelect('admin')}>Admin</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Location</th>
                                <th>Joined Date</th>
                                <th className="actions-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-name">{user.name}</div>
                                        <div className="user-email">{user.email}</div>
                                    </td>
                                    <td><span className={getRoleClass(user.role)}>{user.role}</span></td>
                                    <td>{user.location}</td>
                                    <td>{user.joinedDate}</td>
                                    <td className="actions-cell">
                                        <div className="actions-wrapper">
                                            <button className="action-button" title="Edit User" onClick={() => openModal('edit', user)}>
                                                <Edit className="action-icon" />
                                            </button>
                                            <button className="action-button delete-button" title="Delete User" onClick={() => openModal('delete', user)}>
                                                <Trash2 className="action-icon" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <EditUserDialog user={modalState.type === 'edit' ? modalState.user : null} onClose={closeModal} onSave={handleSave} />
            <DeleteUserDialog user={modalState.type === 'delete' ? modalState.user : null} onClose={closeModal} onDelete={handleDelete} />
        </>
    );
}
