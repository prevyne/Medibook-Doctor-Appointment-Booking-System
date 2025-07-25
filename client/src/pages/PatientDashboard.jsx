import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Box, Typography, Button, Grid, Card, CardContent, 
    CardActions, AppBar, Toolbar, Chip, Paper
} from '@mui/material';
// Import Icons
import EventIcon from '@mui/icons-material/Event';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

function PatientDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // To store user's name

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const handleCancelAppointment = async (appointmentId) => {
        // the cancel logic
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/appointments/${appointmentId}/cancel`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
            setAppointments(appointments.map(app => app._id === appointmentId ? { ...app, status: 'Cancelled' } : app));
        } catch (error) {
            console.error('Failed to cancel appointment', error);
        }
    };

    useEffect(() => {
        // the useEffect logic
        const token = localStorage.getItem('token');
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const fetchData = async () => {
            try {
                const [doctorsRes, appointmentsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/doctors'),
                    axios.get('http://localhost:5000/api/appointments/myappointments', config)
                ]);
                setDoctors(doctorsRes.data);
                setAppointments(appointmentsRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
                if (error.response && error.response.status === 401) handleLogout();
            }
        };
        fetchData();
    }, []);

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'Scheduled': return 'primary';
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
                        MediBook
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            
            <Container sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome Back!
                </Typography>

                {/* My Appointments Section */}
                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon sx={{ mr: 1, color: 'primary.main' }} /> My Appointments
                    </Typography>
                    {appointments.length > 0 ? (
                        <Grid container spacing={2}>
                            {appointments.map(app => (
                                <Grid item xs={12} md={6} key={app._id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6">Dr. {app.doctor.name}</Typography>
                                                <Chip label={app.status} color={getStatusChipColor(app.status)} size="small" />
                                            </Box>
                                            <Typography color="text.secondary" sx={{ mb: 1.5 }}>{app.doctor.specialty}</Typography>
                                            <Typography variant="body2">{new Date(app.date).toDateString()} at {app.time}</Typography>
                                        </CardContent>
                                        {app.status === 'Scheduled' && (
                                            <CardActions>
                                                <Button size="small" color="secondary" onClick={() => handleCancelAppointment(app._id)}>
                                                    Cancel
                                                </Button>
                                            </CardActions>
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography color="text.secondary">You have no upcoming appointments.</Typography>
                    )}
                </Paper>

                {/* Available Doctors Section */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <MedicalServicesIcon sx={{ mr: 1, color: 'primary.main' }} /> Book a New Appointment
                    </Typography>
                    {doctors.length > 0 ? (
                         <Grid container spacing={2}>
                            {doctors.map(doctor => (
                                <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">{doctor.name}</Typography>
                                            <Typography color="text.secondary">{doctor.specialty}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button fullWidth variant="outlined" size="small" onClick={() => navigate(`/book/${doctor._id}`)}>
                                                Book Now
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography color="text.secondary">No doctors available at the moment.</Typography>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default PatientDashboard;