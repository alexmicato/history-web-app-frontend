import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./AdminPage.css"
import { FaHome } from "react-icons/fa";

function AdminPage() {

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoleToAdd, setSelectedRoleToAdd] = useState({});
    const [selectedRoleToRemove, setSelectedRoleToRemove] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const usersResp = await axios.get(`http://localhost:8080/admin/users`, config);
            setUsers(usersResp.data);
            setFilteredUsers(usersResp.data);
            setLoading(false);

            const roleInitAdd = {};
            const roleInitRemove = {};
            usersResp.data.forEach(user => {
                roleInitAdd[user.username] = '';
                roleInitRemove[user.username] = '';
            });
            setSelectedRoleToAdd(roleInitAdd);
            setSelectedRoleToRemove(roleInitRemove);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const rolesResp = await axios.get(`http://localhost:8080/roles`, config);
            setRoles(rolesResp.data);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        }
    };

    const handleAddRole = async (username) => {
        const roleToAdd = selectedRoleToAdd[username];
        if (!roleToAdd) return;

        const token = localStorage.getItem('authToken');
        await axios.post(`http://localhost:8080/admin/${username}/roles/add`, roleToAdd, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'text/plain'
            }
});
        fetchUsers();  // Refresh user data
    };

    const handleRemoveRole = async (username) => {
        const roleToRemove = selectedRoleToRemove[username];
        if (!roleToRemove) return;

        // Check if the role to remove is "USER"
        if (roleToRemove.toUpperCase() === "USER") {
            alert("Removing the 'USER' role is not allowed.");
            return; 
        }

        const token = localStorage.getItem('authToken');
        await axios.post(`http://localhost:8080/admin/${username}/roles/remove`, roleToRemove, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'text/plain'
            }
        });
    
        fetchUsers(); 
    };

    const handleRoleSelectionChangeToAdd = (username, role) => {
        setSelectedRoleToAdd(prev => ({ ...prev, [username]: role }));
    };

    const handleRoleSelectionChangeToRemove = (username, role) => {
        setSelectedRoleToRemove(prev => ({ ...prev, [username]: role }));
    };

    const handleSearch = () => {
        const filtered = users.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredUsers(filtered);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className='admin-page'>
            <button onClick={() => handleNavigation('/main')}><FaHome /> Home</button>
            <h1>Manage User Roles</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Current Roles</th>
                        <th>Remove Role</th>
                        <th>Add Role</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>
                                {user.roles.join(', ')}
                            </td>
                            <td>
                                <select
                                    value={selectedRoleToRemove[user.username] || ''}
                                    onChange={(e) => handleRoleSelectionChangeToRemove(user.username, e.target.value)}
                                >
                                    <option value="">Select Role to Remove...</option>
                                    {user.roles.map(role => (
                                        <option key={role} value={role} disabled={role.toUpperCase() === "USER"}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={() => handleRemoveRole(user.username)}>Remove</button>
                            </td>
                            <td>
                                <select
                                    value={selectedRoleToAdd[user.username] || ''}
                                    onChange={(e) => handleRoleSelectionChangeToAdd(user.username, e.target.value)}
                                >
                                    <option value="">Select Role to Add...</option>
                                    {roles.filter(role => !user.roles.includes(role)).map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                                <button onClick={() => handleAddRole(user.username)}>Add</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPage;
