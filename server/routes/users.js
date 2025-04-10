const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST / route to create a new user
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const user = new User({ username, email, password });
        await user.save();

        // Send a 201 response with the new user's information
        res.status(201).json(user);
    } catch (err) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;