const path = require('path'); //to get rid of the path style-problem when serving static content
const http = require('http'); //to have explicit access to the http.Server instance 
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'..','public'); //better styled path to use for static assets
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app); //creating an instance of http.Server
const io = socketIO(server); //setting up this Server as web socket server

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('A new user has connected!');
    socket.emit('newMsg',{
        from: 'zubair.bashir@gmail.com',
        text: 'Hey man what are you doing today?',
        createdAt: Date()
    });
    socket.on('createMsg',(newMsg)=>{
        console.log('User has created a new message!',newMsg)
    })
    socket.on('disconnect',()=>{
        console.log('A user has disconnected!')
    })
})

server.listen(PORT,()=>{
    console.log(`Sever has been fired up @ port ${PORT}`)
})