const express = require('express');
const cors = require('cors');
require('dotenv').config()
const connectDB = require('./config/connectDB');
const router = require('./routes/index');


const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

// must be included in order to handle the responses (res) in json format.
app.use(express.json()); 
const PORT = process.env.PORT || 5000;


app.get('/',(req,res)=>{
    res.json({message:"Hello Server is Ready Bro"});
})


app.use('/api',router)

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server Running at port ${PORT}`);
    })
})


