require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');
const authRoutes = require('./routes/authRoutes');

const connectToDatabase = require('./models/db');
const { loadData } = require('./util/import-mongo/index');

const app = express();
const port = process.env.PORT || 3060;

// Middleware
app.use(cors());
app.use(express.json());

// Pino HTTP logger middleware
const pinoHttp = require('pino-http')({ logger: pinoLogger });
app.use(pinoHttp);

// Route files
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Use Routes
app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes)

// Test route
app.get("/", (req, res) => {
    res.send("Inside the server");
});

// Connect to MongoDB
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
}).catch((e) => {
    pinoLogger.fatal(e, 'Failed to connect to DB');
    process.exit(1); // Exit on DB failure
});

// Global Error Handler
app.use((err, req, res, next) => {
    pinoLogger.error(err, 'Unhandled error in app.js');
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(port, () => {
    pinoLogger.info(`Server running on port ${port}`);
});