import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole'); // Remove role on logout
        navigate('/login');
    };

    return (
        <nav>
            <Link to="/dashboard"><h1>MediBook</h1></Link>
            {token && <button onClick={handleLogout}>Logout</button>}
        </nav>
    );
};

export default Navbar;