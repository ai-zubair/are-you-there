const socket = io();
socket.on('connect',()=>{
    console.log('Connected to the server!')
});
socket.on('newMsg',(msg)=>{
    console.log('New msg has been recieved!');
    const newMsg = `<h3>FROM: ${msg.from}</h3><p>${msg.text}</p>`;
    const messages=document.getElementById('messages');
    console.log(messages)
    messages.insertAdjacentHTML('beforeend',newMsg);
    console.log(msg);
})

socket.on('disconnect',()=>{
    console.log('Disconnected from the server!');
})