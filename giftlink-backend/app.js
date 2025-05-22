const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Task 1: Import the giftRoutes and store in a constant called giftRoutes
const giftRoutes = require('./routes/giftRoutes');

// Task 2: Add the giftRoutes to the server
app.use('/api/gifts', giftRoutes);

// Optional: Test route
app.get('/', (req, res) => {
    res.send('GiftLink API is running!');
});

// Export the app for use in server.js
module.exports = app;