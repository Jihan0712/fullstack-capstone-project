const express = require('express');
const router = express.Router();

// Import database connection function
const { connectToDatabase } = require('../models/db');

// GET /api/gifts - Get all gifts
router.get('/api/gifts', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gifts = await collection.find({}).toArray();
        res.json(gifts);
    } catch (err) {
        console.error('Error fetching gifts:', err);
        res.status(500).json({ error: 'Failed to fetch gifts' });
    }
});

// GET /api/gifts/:id - Get a specific gift by ID
router.get('/api/gifts/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Task 1: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase();

        // Task 2: Use the collection() method to retrieve the gift collection
        const collection = db.collection("gifts");

        // Task 3: Find a specific gift by ID using findOne
        const gift = await collection.findOne({ id: id });

        if (!gift) {
            return res.status(404).json({ error: 'Gift not found' });
        }

        res.json(gift);
    } catch (err) {
        console.error('Error fetching gift by ID:', err);
        res.status(500).json({ error: 'Failed to fetch gift' });
    }
});

module.exports = router;