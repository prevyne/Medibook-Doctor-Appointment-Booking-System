import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Paper, TextField, MenuItem, 
    AppBar, Toolbar, CircularProgress, Alert
} from '@mui/material';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import API from '../api';

function BookingPage() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const availableTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const { data } = await API.get(`/api/doctors/${doctorId}`);
                setDoctor(data);
            } catch (err) {
                setError("Could not fetch doctor's details. Please go back and try again.");
                console.error("Could not fetch doctor details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorDetails();
    }, [doctorId]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const appointmentDetails = { doctor: doctorId, date, time };
            await API.post('/api/appointments', appointmentDetails);
            alert('Appointment booked successfully!');
            navigate('/dashboard');
        } catch (err) {
            alert('Booking failed. The time slot may have just been taken.');
            console.error('Booking failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        MediBook
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>

            <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <BookOnlineIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                            <Typography component="h1" variant="h5">
                                Book an Appointment
                            </Typography>
                            {doctor && (
                                <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                                    with Dr. {doctor.name} ({doctor.specialty})
                                </Typography>
                            )}
                            <Box component="form" onSubmit={handleBooking} sx={{ mt: 3, width: '100%' }}>
                                <TextField
                                    margin="normal" required fullWidth id="date" label="Appointment Date"
                                    name="date" type="date" InputLabelProps={{ shrink: true }}
                                    onChange={(e) => setDate(e.target.value)} disabled={submitting}
                                />
                                <TextField
                                    margin="normal" required fullWidth id="time" select
                                    label="Available Time" value={time} onChange={(e) => setTime(e.target.value)} disabled={submitting}
                                >
                                    <MenuItem value=""><em>Select a time</em></MenuItem>
                                    {availableTimes.map((t) => ( <MenuItem key={t} value={t}>{t}</MenuItem> ))}
                                </TextField>
                                <Button
                                    type="submit" fullWidth variant="contained"
                                    sx={{ mt: 3, mb: 2, py: 1.5, height: 50 }}
                                    disabled={!date || !time || submitting}
                                >
                                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default BookingPage;