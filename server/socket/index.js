const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');
const {ConversationModel,MessageModel}  = require('../models/ConversationModel');




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
    socket.join(user?._id.toString());
    onlineUser.add(user?._id?.toString());


    // sending onlineUsers from server with data
    // must be recived in client 
    io.emit('onlineUser',Array.from(onlineUser));


    // obtains id of user you want to chat with from params in messagepage.js
    // from that id you can obtain that user details here  
    // you can also get your existing chat here with help of his id(receiver/friend)
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

         //getting previous message of your chat between you and your friend
         // checking conversation model for getting previous messages
         const getConversationMessage = await ConversationModel.findOne({
            "$or" : [
                { sender : user?._id, receiver : userId },
                { sender : userId, receiver :  user?._id}
            ]
        }).populate('messages').sort({ updatedAt : -1 })

        socket.emit('message',getConversationMessage?.messages || [])

    })



    // obtains details of sender,receiver,message data from client and preocesses it .
    socket.on('new message', async (data)=>{
        // console.log('new message received at server',data);


    //first check wheater a conversation is already available between sender,receiver.
      let conversation = await ConversationModel.findOne({
            "$or" : [
                { sender : data?.sender, receiver : data?.receiver },
                { sender : data?.receiver, receiver :  data?.sender}
                // as a sender can act as receiver from second person(receiver) end.
                // check wheather that is stored in database
            ]
        })

        // users interacting for first time
        // if there is no existing conversation -> create a new conversation
        if(!conversation){
            const createConversation = await ConversationModel({
                sender : data?.sender,
                receiver : data?.receiver
            })
            conversation = await createConversation.save();
        }

        // must create a new message with received new-message data
        // every message is linked to a conversation
        const message = new MessageModel({
            text : data.text,
            imageUrl : data.imageUrl,
            videoUrl : data.videoUrl,
            msgByUserId :  data?.msgByUserId, // is necessary to display message on right side in frontend
          })
          const saveMessage = await message.save()

          // update the conversation with the new message -> add it(push into existing)
          const updateConversation = await ConversationModel.updateOne({ _id : conversation?._id },{
            "$push" : { messages : saveMessage?._id }
        })


        // after updating the conversation -> return all the messages between the two persons
        const getConversationMessage = await ConversationModel.findOne({
            "$or" : [
                { sender : data?.sender, receiver : data?.receiver },
                { sender : data?.receiver, receiver :  data?.sender}
            ] // in sorted order from past to latest
        }).populate('messages').sort({ updatedAt : -1 })
        console.log('all messages between u and your friend',getConversationMessage);

        // send all latet conversation to both users
        io.to(data?.sender).emit('message',getConversationMessage?.messages)
        io.to(data?.receiver).emit('message',getConversationMessage?.messages)





      

    })


    // executes when socked disconnected
    socket.on('disconnect',(socket)=>{
        // when use disconnected delete from onlineusers set
        onlineUser.delete(user?._id?.toString());
        console.log('diconnected socket : ',socket.id);
    })
})


module.exports={
    app,
    server
}


