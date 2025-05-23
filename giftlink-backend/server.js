const express = require('express');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');
const connectToDatabase = require('./models/db');
const authRoutes = require('./routes/authRoutes');
const giftRoutes = require('./routes/giftRoutes'); // Import gift routes

// Create logger instance
const logger = pino();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3060;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(pinoHttp({ logger })); // Use Pino for HTTP logging

// Test route
app.get('/', (req, res) => {
    res.send('GiftLink Backend Running!');
});

// Use Routes
app.use('/api/auth', authRoutes); // Mount authentication routes
app.use('/api/gifts', giftRoutes); // Mount gift routes

// Global Error Handler
app.use((err, req, res, next) => {
    logger.error(err, 'Unhandled error in server.js');
    res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB
connectToDatabase().then(() => {
    logger.info('Connected to MongoDB');
}).catch((e) => {
    logger.fatal(e, 'Failed to connect to MongoDB');
    process.exit(1); // Exit on DB failure
});

// Start the server
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});