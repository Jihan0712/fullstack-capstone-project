const { MongoClient } = require('mongodb'); // MongoDB driver
require('dotenv').config(); // Load environment variables
const fs = require('fs'); // File system module to read JSON file

// Load MongoDB connection URL from .env
const MONGO_URL = process.env.MONGO_URL;

async function main() {
    try {
        // Connect to MongoDB
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        console.log('Connected to MongoDB');

        // Select the database and collection
        const db = client.db('giftlink');
        const giftsCollection = db.collection('gifts');

        // Read the gifts.json file
        const giftsData = JSON.parse(fs.readFileSync('./gifts.json', 'utf8'));
        console.log(`Read ${giftsData.length} gifts from gifts.json`);

        // Insert the gifts data into the database
        const result = await giftsCollection.insertMany(giftsData);
        console.log(`Inserted documents: ${result.insertedCount}`);

        // Close the connection
        await client.close();
    } catch (error) {
        console.error('Error importing gifts:', error.message);
    }
}

main();