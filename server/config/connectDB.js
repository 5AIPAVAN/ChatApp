const mongoose = require('mongoose');
// must require dotenv to use env variables
require('dotenv').config();
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        const connection = mongoose.connection;
        connection.on('connection',()=>{
            console.log("Connected to DataBase");
        })

        connection.on('error',()=>{
            console.log("Some Error while connecting mongoDB");
        })
    } catch (err) {
        console.log("Error while Database Connectio : "+err);
    }
}

module.exports = connectDB;