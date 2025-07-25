import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Grid, Card, CardContent,
    AppBar, Toolbar, Chip, Paper, CardActions, CircularProgress, Alert
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import API from '../api'; // Use our central API client

function DoctorDashboard() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const fetchSchedule = useCallback(async () => {
        try {
            const res = await API.get('/api/appointments/doctor/schedule');
            setSchedule(res.data);
        } catch (err) {
            setError('Could not fetch your schedule. Please try again later.');
            console.error('Could not fetch schedule', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    const handleApproveAppointment = async (appointmentId) => {
        try {
            await API.put(`/api/appointments/${appointmentId}/approve`);
            setSchedule(schedule.map(app =>
                app._id === appointmentId ? { ...app, status: 'Approved' } : app
            ));
        } catch (err) {
            alert('Failed to approve appointment.');
            console.error('Failed to approve appointment', err);
        }
    };

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'Scheduled': return 'warning';
            case 'Approved': return 'primary';
            case 'Completed': return 'success';
            case 'Cancelled': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Doctor's Portal
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            
            <Container sx={{ py: 4 }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} /> Your Schedule
                    </Typography>
                    
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        schedule.length > 0 ? (
                            <Grid container spacing={2}>
                                {schedule.map(app => (
                                    <Grid item xs={12} md={6} lg={4} key={app._id}>
                                        <Card>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="h6">{app.patient.name}</Typography>
                                                    <Chip label={app.status} color={getStatusChipColor(app.status)} size="small" />
                                                </Box>
                                                <Typography color="text.secondary" sx={{ mb: 1.5 }}>{app.patient.email}</Typography>
                                                <Typography variant="body2">{new Date(app.date).toDateString()} at {app.time}</Typography>
                                            </CardContent>
                                            
                                            {app.status === 'Scheduled' && (
                                                <CardActions>
                                                    <Button size="small" variant="contained" color="primary" onClick={() => handleApproveAppointment(app._id)}>
                                                        Approve
                                                    </Button>
                                                </CardActions>
                                            )}
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography color="text.secondary">You have no appointments in your schedule.</Typography>
                        )
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default DoctorDashboard;