import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/book/:doctorId" element={<PrivateRoute><BookingPage /></PrivateRoute>} />

                    <Route path="/" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;