import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function BookingPage() {
    const { doctorId } = useParams(); // Gets the doctor ID from the URL
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    
    // Example available time slots
    const availableTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"];

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            
            const appointmentDetails = {
                doctor: doctorId,
                date,
                time
            };

            await axios.post('http://localhost:5000/api/appointments', appointmentDetails, config);
            alert('Appointment booked successfully!');
            navigate('/dashboard');

        } catch (error) {
            console.error('Booking failed:', error);
            alert('Booking failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Book Appointment</h2>
            <form onSubmit={handleBooking}>
                <div>
                    <label>Date:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                    <label>Time:</label>
                    <select value={time} onChange={(e) => setTime(e.target.value)} required>
                        <option value="">Select a time</option>
                        {availableTimes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <button type="submit">Confirm Booking</button>
            </form>
        </div>
    );
}

export default BookingPage;