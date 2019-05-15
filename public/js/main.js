const socket = io();
socket.on('connect',()=>{
    console.log('Connected to the server!')
});
socket.on('newMsg',(msg)=>{
    const messages=$('#messageList');
    const newMsgTemplate = $('#msgTemplate').html();
    const newMsg = Mustache.render(newMsgTemplate,{
        from:msg.from,
        at:moment(msg.createdAt).format('h:mm a'),
        text:msg.text,
        url:msg.url
    });
    messages.append(newMsg);
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