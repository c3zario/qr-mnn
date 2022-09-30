const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

async function getDatabase() {
    const databaseName = process.env.MONGODB_DATABASE ?? "mnn";
    const client = new MongoClient(process.env.MONGODB_CONNECTION ?? "mongodb://127.0.0.1:27017");
    await client.connect();
    const database = client.db(databaseName);
    return {
        users: database.collection("users"),
        codes: database.collection("codes"),
    };
}

module.exports = { getDatabase };
