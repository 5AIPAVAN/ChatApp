const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');



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
    console.log('token from sockedio',token)

    // getting user details with help of token and helper function

    const user = await getUserDetailsFromToken(token);
    console.log('user fetched with token in socketio',user)


    // creating a room for obtained user
    // socket.join() is used to create rooms for particular users mentioned
    socket.join(user?._id);
    onlineUser.add(user?._id);


    // sending onlineUsers from server with data
    // must be recived in client 
    io.emit('onlineUser',Array.from(onlineUser));


    // executes when socked disconnected
    socket.on('disconnect',(socket)=>{
        // when use disconnected delete from onlineusers set
        onlineUser.delete(user?._id);
        console.log('diconnected socket : '+socket.id);
    })
})


module.exports={
    app,
    server
}


