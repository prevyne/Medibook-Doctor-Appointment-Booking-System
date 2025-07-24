import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        // Fetch available doctors
        const fetchDoctors = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/doctors');
                setDoctors(res.data);
            } catch (error) {
                console.error('Could not fetch doctors', error);
            }
        };

        // Fetch user's appointments
        const fetchAppointments = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/appointments/myappointments', config);
                setAppointments(res.data);
            } catch (error) {
                console.error('Could not fetch appointments', error);
                // If token is invalid (e.g., expired), log out the user
                if (error.response.status === 401) {
                    handleLogout();
                }
            }
        };

        fetchDoctors();
        fetchAppointments();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <h2>Patient Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            
            <hr style={{ margin: '20px 0' }} />

            {/* Section for My Appointments */}
            <h3>My Upcoming Appointments</h3>
            <div>
                {appointments.length > 0 ? (
                    appointments.map(app => (
                        <div key={app._id} style={{ border: '1px solid #4CAF50', padding: '10px', margin: '10px' }}>
                            <p><strong>Doctor:</strong> {app.doctor.name}</p>
                            <p><strong>Specialty:</strong> {app.doctor.specialty}</p>
                            <p><strong>Date:</strong> {new Date(app.date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {app.time}</p>
                            <p><strong>Status:</strong> {app.status}</p>
                        </div>
                    ))
                ) : (
                    <p>You have no upcoming appointments.</p>
                )}
            </div>

            <hr style={{ margin: '20px 0' }} />

            {/* Section for Available Doctors */}
            <h3>Available Doctors</h3>
            <div>
                {doctors.length > 0 ? (
                    doctors.map(doctor => (
                        <div key={doctor._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                            <h4>{doctor.name}</h4>
                            <p>Specialty: {doctor.specialty}</p>
                            <button onClick={() => navigate(`/book/${doctor._id}`)}>
                                View Schedule & Book
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No doctors available at the moment.</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;