const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

// calling the main function to connect to MongoDB
main().then(() => {
    console.log("connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    })
// writing async function to connect to MongoDB
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/warmstay');

}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "685ce3066f3bd1e64c9ad552"})) // adding owner
    await Listing.insertMany(initData.data);
    console.log("Data was initialized successfully");
}
initDB();
