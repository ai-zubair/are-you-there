const socket = io();
socket.on('connect',()=>{
    console.log('Connected to the server!')
});
socket.on('newMsg',(msg)=>{
    console.log('New msg has been recieved!');
    const newMsg = `<h3>FROM: ${msg.from}</h3><p>${msg.text}</p><p>AT:${new Date(msg.createdAt).toLocaleTimeString('en-US')}</p>`;
    const messages=document.getElementById('messages');
    messages.insertAdjacentHTML('beforeend',newMsg);
    console.log(msg);
})

socket.emit('createMsg',{
    from: 'Zubair',
    text:'This is really cool mate!'
},(status)=>{
    console.log(status);
})

socket.on('disconnect',()=>{
    console.log('Disconnected from the server!');
})

$('#messageBox').on('submit',(e)=>{
    e.preventDefault();
    socket.emit('createMsg',{
        from: 'Zubair',
        text: $('[name=message]').val()
    },(status)=>{
        console.log(status);
    });
    $('[name=message]').val('');
})