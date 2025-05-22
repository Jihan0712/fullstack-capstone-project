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

// Register Route
router.post('/register', [
    // Input validation
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase(); // ✅ Connected to DB

        // Task 2: Access MongoDB collection
        const collection = db.collection("users"); // ✅ Using "users" collection

        // Task 3: Check for existing email ID
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Generate salt and hash password
        const salt = await bcryptjs.genSalt(10); // ✅ Salt generated
        const hash = await bcryptjs.hash(req.body.password, salt); // ✅ Password hashed

        // Task 4: Save user details in database
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        // Task 5: Create JWT authentication with user._id as payload
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // ✅ Token created
        const email = req.body.email;

        logger.info('User registered successfully');

        // Send response
        res.json({ authtoken, email });

    } catch (e) {
        logger.error(`Registration failed: ${e.message}`);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;