const { MongoClient } = require('mongodb');

// 1
const MONGO_URL = `mongodb://${process.env.MONGO_URL || "localhost:27017"}/hackernews`;

// 2
module.exports = async () => {
    const db = await MongoClient.connect(MONGO_URL);
    return { Links: db.collection('links') };
}