const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    mongoose.connect(process.env.DATABASE_URl)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.log("Database connection failed", err);
        process.exit(1);
    });
}

module.exports = connectDB;