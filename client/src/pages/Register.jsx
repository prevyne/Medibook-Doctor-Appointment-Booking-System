import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error.response.data.msg);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
            {/* ✅ This is the link we are adding */}
            <p>
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </div>
    );
}

export default Register;