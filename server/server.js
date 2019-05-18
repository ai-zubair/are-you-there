const path = require('path'); //to get rid of the path style-problem when serving static content
const http = require('http'); //to have explicit access to the http.Server instance 
const fs = require('fs');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage,generateLocationMessage } = require('./utils/messageUtils');
const { isValidString } = require('./utils/validations');

const publicPath = path.join(__dirname,'..','public'); //better styled path to use for static assets
const PORT = process.env.PORT || 3000;

const app = express();


const server = http.createServer(app); //creating an instance of http.Server
const io = socketIO(server); //setting up this Server as web socket server

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    //user joining a room
    socket.on('join',(params,callback)=>{
        if(isValidString(params.username)&&isValidString(params.room)){
            socket.join(params.room);
            //whenever a user connects greet him with a welcome message
            socket.emit('newMsg',generateMessage('Admin','Welcome to the Chat!'));
            //whenever a new user connects inform rest of the users about it
            socket.broadcast.to(params.room).emit('newMsg',generateMessage('Admin',`${params.username} has joined the chat!`));
        }else{
            callback('Invalid Username | Roomname');
        }
        
    })
    socket.on('createMsg',(newMsg,callback)=>{
        console.log('User has created a new message!',newMsg);
        io.emit('newMsg',generateMessage(newMsg.from,newMsg.text));
        callback('Sent');
    })

    socket.on('createLocationMsg',(cordinates)=>{
        io.emit('newMsg',generateLocationMessage('Zubair',cordinates.lat,cordinates.lng))
    })
    socket.on('disconnect',()=>{
        console.log('A user has disconnected!')
    })
})

server.listen(PORT,()=>{
    console.log(`Server has been fired up @ port ${PORT}`)
})