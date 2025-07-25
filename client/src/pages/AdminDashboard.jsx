import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, AppBar, Toolbar, Paper, Table, 
    TableBody, TableCell, TableContainer, TableHead, TableRow, Select, 
    MenuItem, IconButton, CircularProgress, Alert
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import API from '../api';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingUserId, setUpdatingUserId] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const fetchUsers = useCallback(async () => {
        try {
            const { data } = await API.get('/api/admin/users');
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users. Please try again later.');
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            return;
        }
        setUpdatingUserId(userId);
        try {
            await API.put(`/api/admin/users/${userId}/role`, { role: newRole });
            // Refresh users list by updating the state directly for a smoother UX
            setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
        } catch (err) {
            alert('Failed to update role.');
            console.error('Failed to update role', err);
        } finally {
            setUpdatingUserId(null);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to permanently delete ${userName}? This action cannot be undone.`)) {
            return;
        }
        setUpdatingUserId(userId);
        try {
            await API.delete(`/api/admin/users/${userId}`);
            alert('User deleted successfully.');
            setUsers(users.filter(user => user._id !== userId));
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to delete user.');
            console.error('Failed to delete user', err);
        } finally {
            setUpdatingUserId(null);
        }
    };

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
                    
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
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
                                                        disabled={updatingUserId === user._id}
                                                    >
                                                        <MenuItem value="patient">Patient</MenuItem>
                                                        <MenuItem value="doctor">Doctor</MenuItem>
                                                    </Select>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {user.role !== 'admin' && (
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => handleDeleteUser(user._id, user.name)}
                                                        disabled={updatingUserId === user._id}
                                                    >
                                                        {updatingUserId === user._id ? <CircularProgress size={20} /> : <DeleteIcon />}
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default AdminDashboard;