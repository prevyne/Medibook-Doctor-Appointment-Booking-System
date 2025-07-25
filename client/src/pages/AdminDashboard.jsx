import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Grid, Card,
    CardContent, AppBar, Toolbar, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, IconButton
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`, { role: newRole }, config);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update role', error);
            alert('Failed to update role.');
        }
    };
    
    // --- ADD THIS NEW FUNCTION ---
    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to permanently delete ${userName}? This action cannot be undone.`)) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, config);
            alert('User deleted successfully.');
            // Remove user from state to update UI instantly
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Failed to delete user', error);
            alert(error.response?.data?.msg || 'Failed to delete user.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Admin Portal
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            
            <Container sx={{ py: 4 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} /> User Management
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Current Role</TableCell>
                                    <TableCell align="center">Change Role</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell align="center">
                                            {user.role !== 'admin' && (
                                                <Select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    size="small"
                                                    sx={{ minWidth: 100 }}
                                                >
                                                    <MenuItem value="patient">Patient</MenuItem>
                                                    <MenuItem value="doctor">Doctor</MenuItem>
                                                </Select>
                                            )}
                                        </TableCell>
                                        {/* --- ADD THIS TABLE CELL FOR THE DELETE BUTTON --- */}
                                        <TableCell align="center">
                                            {user.role !== 'admin' && (
                                                <IconButton color="error" onClick={() => handleDeleteUser(user._id, user.name)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </Box>
    );
}

export default AdminDashboard;