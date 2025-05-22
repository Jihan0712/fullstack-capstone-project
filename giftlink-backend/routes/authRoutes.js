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
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase();

        // Task 2: Access MongoDB users collection
        const collection = db.collection("users");

        // Task 3: Check for user credentials in database
        const { email, password } = req.body;
        const theUser = await collection.findOne({ email });

        // Task 7: Send appropriate message if user not found
        if (!theUser) {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Task 4: Check if the password matches the encrypted password
        const isMatch = await bcryptjs.compare(password, theUser.password);
        if (!isMatch) {
            logger.error('Passwords do not match');
            return res.status(400).json({ error: 'Wrong password' });
        }

        // Task 6: Create JWT authentication with user._id as payload
        const payload = {
            user: {
                id: theUser._id.toString()
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Task 5: Extract user details to send back
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