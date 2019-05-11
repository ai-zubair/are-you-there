const socket = io();
socket.on('connect',()=>{
    console.log('Connected to the server!')
});
socket.on('newMsg',(msg)=>{
    console.log('New msg has been recieved!');
    console.log(msg);
})
socket.emit('createMsg',{
    from: 'zubair.bashir',
    text: 'Hey! How are you doing this fine afternoon?',
});
socket.on('disconnect',()=>{
    console.log('Disconnected from the server!');
})