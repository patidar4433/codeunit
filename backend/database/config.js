// database connectivity
const { MongoClient } = require('mongodb');
const url = "mongodb://localhost:27017";
const database = "CodeUnit";

// for users collection
const getConnect = async () => {
    const result = await MongoClient.connect(url);
    const db = result.db(database);
    const collection = db.collection('Users');
    return collection;
}


module.exports = { getConnect };