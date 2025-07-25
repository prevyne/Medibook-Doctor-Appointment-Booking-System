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
            patient: req.user.id,
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
// @desc    Get appointments for a logged-in patient
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

// @route   GET /api/appointments/doctor/schedule
// @desc    Get appointments for a logged-in doctor
// @access  Private
router.get('/doctor/schedule', protect, async (req, res) => {
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ msg: 'User is not a doctor' });
    }
    try {
        const appointments = await Appointment.find({ doctor: req.user.id })
            .populate('patient', 'name email')
            .sort({ date: 'asc' });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel an appointment (by patient)
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
        if (appointment.patient.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
        appointment.status = 'Cancelled';
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- ADD THIS NEW ROUTE ---
// @route   PUT /api/appointments/:id/approve
// @desc    Approve an appointment (by doctor)
// @access  Private
router.put('/:id/approve', protect, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
        
        // Ensure the logged-in user is the correct doctor for this appointment
        if (appointment.doctor.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
        
        appointment.status = 'Approved';
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;