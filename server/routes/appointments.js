const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { doctor, date, time } = req.body;

        const newAppointment = new Appointment({
            patient: req.user.id, // from the 'protect' middleware
            doctor,
            date,
            time
        });

        const appointment = await newAppointment.save();
        res.json(appointment);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/appointments/myappointments
// @desc    Get appointments for a logged-in user
// @access  Private
router.get('/myappointments', protect, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id }).populate('doctor', 'name specialty');
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;