const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

let dbInstance = null;

async function connectToDatabase() {
    // Task 1: Connect to MongoDB
    await client.connect();

    // Task 2: Connect to database giftDB and store in variable dbInstance
    dbInstance = client.db('giftDB');

    // Task 3: Return the database instance
    return dbInstance;
}

module.exports = { connectToDatabase };