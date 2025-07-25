const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// @route   GET /api/admin/users
// @desc    Get all users (for admin)
// @access  Private/Admin
router.get('/users', protect, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role (for admin)
// @access  Private/Admin
router.put('/users/:id/role', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ msg: 'Cannot change admin role' });
            }
            user.role = req.body.role || user.role;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user and their appointments
// @access  Private/Admin
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ msg: 'You cannot delete your own admin account' });
        }

        await Appointment.deleteMany({ $or: [{ patient: user._id }, { doctor: user._id }] });
        
        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: 'User and associated appointments removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;