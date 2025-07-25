import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Grid, Card,
    CardContent, AppBar, Toolbar, Chip, Paper, CardActions
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';

function DoctorDashboard() {
    const [schedule, setSchedule] = useState([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const fetchSchedule = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const res = await axios.get('http://localhost:5000/api/appointments/doctor/schedule', config);
            setSchedule(res.data);
        } catch (error) {
            console.error('Could not fetch schedule', error);
            if (error.response && error.response.status === 401) {
                handleLogout();
            }
        }
    };
    
    // --- ADD THIS NEW FUNCTION ---
    const handleApproveAppointment = async (appointmentId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/appointments/${appointmentId}/approve`, {}, config);
            
            // Update the UI instantly
            setSchedule(schedule.map(app => 
                app._id === appointmentId ? { ...app, status: 'Approved' } : app
            ));
        } catch (error) {
            console.error('Failed to approve appointment', error);
            alert('Failed to approve appointment.');
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'Scheduled': return 'warning'; // Changed for better visibility
            case 'Approved': return 'primary'; // Added for new status
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
                    {schedule.length > 0 ? (
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
                                        
                                        {/* --- ADD THIS CARD ACTIONS SECTION --- */}
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
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default DoctorDashboard;