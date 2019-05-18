const path = require('path'); //to get rid of the path style-problem when serving static content
const http = require('http'); //to have explicit access to the http.Server instance 
const fs = require('fs');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');

const { generateMessage,generateLocationMessage } = require('./utils/messageUtils');
const { isValidString } = require('./utils/validations');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname,'..','public'); //better styled path to use for static assets
const PORT = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app); //creating an instance of http.Server
const io = socketIO(server); //setting up this Server as web socket server
const userList = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    //user requesting to join a room
    socket.on('join',(params,callback)=>{
        if(isValidString(params.username)&&isValidString(params.room)){
            //put the user into the speicfied room and create the room if its doesn't exist already
            socket.join(params.room);
            //remove the user from any other room he's joined in
            userList.removeUser(socket.id);
            //add the user to the new room
            userList.addUser(socket.id,params.username,params.room);
            //greet him with a welcome message
            socket.emit('newMsg',generateMessage('Admin','Welcome to the Chat!'));
            //send an updated user list to the group
            io.to(params.room).emit('userListUpdate',{
                users:userList.getUserList(params.room),
                at:moment().valueOf()
            });
            //inform the group about the new user
            socket.broadcast.to(params.room).emit('newMsg',generateMessage('Admin',`${params.username} has joined the chat!`));
        }else{
            callback('Invalid Username | Roomname');
        }
        
    })
    socket.on('createMsg',(newMsg,callback)=>{
        const user = userList.getUser(socket.id);
        console.log(user);
        if(user && isValidString(newMsg.text)){
            io.to(user.room).emit('newMsg',generateMessage(user.name,newMsg.text));
        }
        callback('Sent');
    })

    socket.on('createLocationMsg',(cordinates)=>{
        const user = userList.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newMsg',generateLocationMessage(user.name,cordinates.lat,cordinates.lng))
        }
    })
    socket.on('disconnect',()=>{
        const user = userList.removeUser(socket.id);
        if(user){
            //remove the user from the room list
            io.to(user.room).emit('userListUpdate',{
                users:userList.getUserList(user.room),
                at:moment().valueOf()
            });
            //notify all the room users about this leaving
            io.to(user.room).emit('newMsg',generateMessage('Admin',`${user.name} has left the chat!`))
        }
        console.log('A user has disconnected!')
    })
})

server.listen(PORT,()=>{
    console.log(`Server has been fired up @ port ${PORT}`)
})