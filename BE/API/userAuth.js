const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user.model'); 

const router = express.Router();


// Student Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is already used
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the student user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'BUYER'
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.role !== 'BUYER') {
      return res.status(401).json({ message: 'Invalid user credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid user credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, userName: user.name },
       process.env.JWT_SECRET
    );

    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error with Server, please try again later" });
  }
});

//Admin register Route
router.post('/admin/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN'
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Admin Login Route
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid admin credentials' });

    const token = jwt.sign(
      { userId: user._id, role: user.role, userName: user.name },
      process.env.JWT_SECRET
    );

    res.status(200).json({ message: 'Admin login successful', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
