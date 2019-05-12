const path = require('path'); //to get rid of the path style-problem when serving static content
const http = require('http'); //to have explicit access to the http.Server instance 
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/messageUtils');

const publicPath = path.join(__dirname,'..','public'); //better styled path to use for static assets
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app); //creating an instance of http.Server
const io = socketIO(server); //setting up this Server as web socket server

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    //whenever a user connects greet him with a welcome message
    socket.emit('newMsg',generateMessage('Admin','Welcome to the Chat!'));
    //whenever a new user connects inform rest of the users about it
    socket.broadcast.emit('newMsg',generateMessage('Admin','A new user has joined the chat!'));

    socket.on('createMsg',(newMsg,callback)=>{
        console.log('User has created a new message!',newMsg);
        io.emit('newMsg',generateMessage(newMsg.from,newMsg.text));
        callback('Sent');
    })

    socket.on('createLocationMsg',(locData)=>{
        io.emit('newMsg',generateMessage('Zubair',`Lt:${locData.lat}\nLn:${locData.lng}`))
    })
    socket.on('disconnect',()=>{
        console.log('A user has disconnected!')
    })
})

server.listen(PORT,()=>{
    console.log(`Sever has been fired up @ port ${PORT}`)
})