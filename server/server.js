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
    //whenever a user connects greet him with a welcome message
    socket.emit('newMsg',{
        from:'Admin',
        text:'Welcome to the Chat!',
        createdAt:Date.now()
    });
    //whenever a new user connects inform rest of the users about it
    socket.broadcast.emit('newMsg',{
        from:'Admin',
        text:'A new user has joined the chat!',
        createdAt: Date.now()
    })

    socket.on('createMsg',(newMsg)=>{
        console.log('User has created a new message!',newMsg);
        io.emit('newMsg',{
            from : newMsg.from,
            text: newMsg.text,
            createdAt: Date.now()
        })
    })

    socket.on('disconnect',()=>{
        console.log('A user has disconnected!')
    })
})

server.listen(PORT,()=>{
    console.log(`Sever has been fired up @ port ${PORT}`)
})