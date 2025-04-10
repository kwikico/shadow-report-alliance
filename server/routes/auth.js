const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });      
    }
    const newUser = { username, email, password };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const users = [];

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;    
    if (email === 'test@test.com' && password === 'test') {
      const token = jwt.sign({ id: 'testuser' }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Use a static ID for the test user
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;    
    if (email === 'test@test.com' && password === 'test') {
      const token = jwt.sign({ id: 'testuser' }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Use a static ID for the test user
      return res.json({ token });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;