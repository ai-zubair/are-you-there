const socket = io();
socket.on('connect',()=>{
    console.log('Connected to the server!')
});
socket.on('newMsg',(msg)=>{
    console.log('New msg has been recieved!');
    const newMsg = `<li class='message'><div class='messageItemsWrapper'><span class="sender">${msg.from}</span><span class="time">${new Date(msg.createdAt).toLocaleTimeString('en-US')}</span><p class="msgText">${msg.text}</p></div></li>`;
    const messages=document.getElementById('messageList');
    messages.insertAdjacentHTML('beforeend',newMsg);
    console.log(msg);
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