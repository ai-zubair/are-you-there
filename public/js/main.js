const socket = io();
socket.on('connect',()=>{
    console.log('Connected to the server!')
});

function autoScroll(messages){
    const newMessage = messages.children().last();
    const newMessageHeight = newMessage.innerHeight();
    const prevMessageHeight = newMessage.prev().innerHeight();
    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    console.log(`scrollTop:${scrollTop}\nclientHeight:${clientHeight}\nscrollHeight:${scrollHeight}\nprevMessageHeight:${prevMessageHeight}\nnewMessageHeight:${newMessageHeight}`)
    if(scrollHeight <= newMessageHeight+prevMessageHeight+clientHeight+scrollTop){
        messages.scrollTop(scrollHeight);
    }
}

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
    autoScroll(messages);
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
        navigator.geolocation.getCurrentPosition((position)=>{
            socket.emit('createLocationMsg',{
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        },(err)=>{
            alert('Failed to fetch the location!');
            console.log(err)
        })
    }else{
        alert(`Your browser doesn't support geo-location!`)
    }
})

socket.on('disconnect',()=>{
    console.log('Disconnected from the server!');
})
