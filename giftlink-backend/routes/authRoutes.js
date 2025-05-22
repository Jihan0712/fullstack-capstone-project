const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');

// Load environment variables
dotenv.config();

// Create logger instance
const logger = pino();

// Load JWT secret from .env
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';

// Register Endpoint
router.post('/register', [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Check if user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            logger.warn(`Registration failed: Email already in use - ${email}`);
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Save new user
        const result = await collection.insertOne({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

        // Generate JWT token
        const payload = {
            user: {
                id: result.insertedId.toString()
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        logger.info(`User registered successfully: ${email}`);

        // Send response
        res.status(201).json({
            authtoken,
            userName: `${firstName} ${lastName}`,
            userEmail: email
        });

    } catch (e) {
        logger.error(`Registration failed: ${e.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login Endpoint
router.post('/login', [
    // Validate input fields
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        // Task 2: Access users collection
        const collection = db.collection("users");

        // Task 3: Check credentials
        const { email, password } = req.body;
        const theUser = await collection.findOne({ email });

        // Task 7: User not found
        if (!theUser) {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Task 4: Compare passwords
        const isMatch = await bcryptjs.compare(password, theUser.password);
        if (!isMatch) {
            logger.error('Passwords do not match');
            return res.status(400).json({ error: 'Wrong password' });
        }

        // Task 6: Create JWT authentication
        const payload = {
            user: {
                id: theUser._id.toString()
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Task 5: Extract user details
        const userName = `${theUser.firstName} ${theUser.lastName}`;
        const userEmail = theUser.email;

        logger.info(`User logged in successfully: ${userEmail}`);

        // Return auth token and user info
        res.json({
            authtoken,
            userName,
            userEmail
        });

    } catch (e) {
        logger.error(`Login failed: ${e.message}`);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;