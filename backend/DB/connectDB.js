require("dotenv").config(); // Load dotenv before using process.env

const { MongoClient } = require("mongodb");

const url = process.env.MONGODB_URI; // Load from .env
const client = new MongoClient(url);

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas");
        const database = client.db("RentingProperties");
        return database;
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
