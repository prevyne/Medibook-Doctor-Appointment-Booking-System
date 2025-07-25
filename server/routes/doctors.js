const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.json(doctors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- ADD THIS NEW ROUTE ---
// @route   GET /api/doctors/:id
// @desc    Get a single doctor by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const doctor = await User.findById(req.params.id).select('-password');
        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;