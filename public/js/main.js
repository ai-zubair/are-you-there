const socket = io();
socket.on('connect',()=>{
    console.log('Connected to the server!')
});
socket.on('newMsg',(msg)=>{
    // console.log('New msg has been recieved!');
    const newMsg = `<div class="outerMessageItemsWrapper"><div class='messageItemsWrapper'><div class='message'><span class="sender">${msg.from}</span><span class="time">${new Date(msg.createdAt).toLocaleTimeString('en-US')}</span><p class="msgText">${msg.text}</p></div></div></div>`;
    const messages=document.getElementById('messageList');
    messages.insertAdjacentHTML('beforeend',newMsg);
    // console.log(msg);
})

socket.on('newLocationMsg',(msg)=>{
    const newMsg = `<div class="outerMessageItemsWrapper"><div class='messageItemsWrapper'><div class='message'><span class="sender">${msg.from}</span><span class="time">${new Date(msg.createdAt).toLocaleTimeString('en-US')}</span><a href=${msg.url} target="_blank" class="msgText">Here's my location!</a></div></div></div>`;
    const messages=document.getElementById('messageList');
    messages.insertAdjacentHTML('beforeend',newMsg);
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
        // console.log(status);
    });
    $('[name=message]').val('');
})

$('#location').on('click',(e)=>{
    if("geolocation" in navigator){
        $(this).attr('disabled','disabled').text('Sending...');
        navigator.geolocation.getCurrentPosition((position)=>{
            socket.emit('createLocationMsg',{
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            $(this).removeAttr('disabled','disabled').text('Location');
        },(err)=>{
            alert('Failed to fetch the location!');
            $(this).removeAttr('disabled','disabled').text('Location');
            console.log(err)
        })
    }else{
        alert(`Your browser doesn't support geo-location!`)
    }
})