const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');



const app = express();

// Socket.io connection

// Here credentails allows to send cookies,authorization headers to be sent and received in cross-origin requests
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:process.env.FRONTEND_URL,
        credentials:true 
    }
})


// to keep track of all current OnlineUsers from server side declare a set

const onlineUser = new Set();

// need to make it async to use await in function
io.on('connection', async (socket)=>{

    console.log('connected socket',socket.id);

    // getting token send from client for authentication.
    // we can use this token here to get details of connected user.


    const token = socket.handshake.auth.token
    // console.log('token from sockedio',token)

    // getting user details with help of token and helper function

    const user = await getUserDetailsFromToken(token);
    // console.log('user fetched with token in socketio',user)


    // creating a room for obtained user
    // socket.join() is used to create rooms for particular users mentioned
    socket.join(user?._id);
    onlineUser.add(user?._id?.toString());


    // sending onlineUsers from server with data
    // must be recived in client 
    io.emit('onlineUser',Array.from(onlineUser));


    // obtains id of user you want to chat with from params in messagepage.js
    // from that id you can obtain that user details here 
    socket.on('message-page',async(userId)=>{
        console.log('you are try to chat with ',userId);

        const userDetails = await UserModel.findById(userId).select("-password");

        const payload = {
            _id : userDetails?._id,
            name : userDetails?.name,
            email : userDetails?.email,
            profile_pic : userDetails?.profile_pic,
            online : onlineUser.has(userId) // here you are checking wheather that user is online or not
        }

        socket.emit('message-user',payload);

    })


    // executes when socked disconnected
    socket.on('disconnect',(socket)=>{
        // when use disconnected delete from onlineusers set
        onlineUser.delete(user?._id?.toString());
        console.log('diconnected socket : '+socket.id);
    })
})


module.exports={
    app,
    server
}


