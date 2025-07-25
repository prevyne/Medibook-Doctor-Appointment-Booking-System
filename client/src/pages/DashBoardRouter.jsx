import React from 'react';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';

const DashboardRouter = () => {
    const userRole = localStorage.getItem('userRole');

    switch(userRole) {
        case 'admin':
            return <AdminDashboard />;
        case 'doctor':
            return <DoctorDashboard />;
        default:
            return <PatientDashboard />;
    }
};

export default DashboardRouter;