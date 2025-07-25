import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

import Register from './pages/Register';
import Login from './pages/Login';
import BookingPage from './pages/BookingPage';
import DashboardRouter from './pages/DashBoardRouter';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <DashboardRouter />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/book/:doctorId"
                            element={
                                <PrivateRoute>
                                    <BookingPage />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/" element={<Login />} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;