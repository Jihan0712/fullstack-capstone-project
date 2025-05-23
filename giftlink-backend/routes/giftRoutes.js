const express = require('express');
const { ObjectId } = require('mongodb'); // Import ObjectId for querying by _id
const connectToDatabase = require('../models/db');
const logger = require('../logger');

const router = express.Router();

// Get all gifts
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const gifts = await collection.find({}).toArray();
        res.json(gifts);
    } catch (e) {
        logger.error('Oops, something went wrong:', e.message); // Corrected logging
        next(e);
    }
});

// Get a single gift by ID
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        const id = req.params.id;

        // Check if the ID is a valid ObjectId
        if (ObjectId.isValid(id)) {
            const gift = await collection.findOne({ _id: new ObjectId(id) });
            if (!gift) {
                return res.status(404).json({ error: "Gift not found" });
            }
            return res.json(gift);
        }

        // If not a valid ObjectId, check for a plain 'id' field
        const gift = await collection.findOne({ id: id });
        if (!gift) {
            return res.status(404).json({ error: "Gift not found" });
        }
        return res.json(gift);
    } catch (e) {
        logger.error('Error fetching gift by ID:', e.message);
        next(e);
    }
});

module.exports = router;