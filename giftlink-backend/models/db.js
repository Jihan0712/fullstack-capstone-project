require('dotenv').config();
const { MongoClient } = require('mongodb');

// Load MongoDB connection string from .env
const url = process.env.MONGO_URI;
const dbName = "giftlink"; // Ensure this matches your MongoDB database name

let dbInstance = null;

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance; // Return cached instance if already connected
    }

    try {
        console.log('Connecting to MongoDB...');
        const client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();
        console.log('Connected to MongoDB');
        dbInstance = client.db(dbName); // Connect to the specified database
        return dbInstance;
    } catch (e) {
        console.error('Failed to connect to MongoDB:', e.message);
        throw e; // Rethrow the error to handle it upstream
    }
}

module.exports = connectToDatabase;