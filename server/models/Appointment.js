const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String, // e.g., "10:00 AM"
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Cancelled', 'Completed'],
        default: 'Scheduled'
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);