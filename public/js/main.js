const socket = io();
socket.on('connect',()=>{
    console.log('Connected to the server!')
});
socket.on('newMsg',(msg)=>{
    console.log('New msg has been recieved!');
    console.log(msg);
})

socket.on('disconnect',()=>{
    console.log('Disconnected from the server!');
})