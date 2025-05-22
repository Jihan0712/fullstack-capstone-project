const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Load gifts from JSON file
const giftsPath = path.join(__dirname, 'gifts.json');
const rawGifts = fs.readFileSync(giftsPath);
const gifts = JSON.parse(rawGifts);

// Connect to MongoDB
const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function importGifts() {
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');

    const db = client.db('giftlink');
    const collection = db.collection('gifts');

    // Clear existing data
    await collection.deleteMany({});
    
    // Insert new data
    await collection.insertMany(gifts);
    console.log('Gift data imported successfully');
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    await client.close();
  }
}

importGifts();
