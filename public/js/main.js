const socket = io();

socket.on('connect',()=>{
    console.log('Connected to the server!');
    const params = $.deparam(window.location.search);
    socket.emit('join',params,(err)=>{
        if(!err){
            console.log('Success Join!')
        }else{
            window.location.href = '/';
        }
    });
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
    autoScroll(messages);
})

socket.on('userListUpdate',(roomUserData)=>{
    $('#chat_list').html('');
    const params = $.deparam(window.location.search);
    roomUserData.users.forEach( user => {
        if(user === params.username){
            return;
        }
        const roomUserTemplate = $('#roomUserTemplate').html();
        const roomUser = Mustache.render(roomUserTemplate,{
            name:user,
            time:moment(roomUserData.at).format('ddd Do MMM, h:mm a')
        })
        $('#chat_list').append(roomUser);
    })
})

$('#messageBox').on('submit',(e)=>{
    e.preventDefault();
    const params = $.deparam(window.location.search);
    socket.emit('createMsg',{
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

$('#hamburger').on('click',()=>{
    $('nav').toggleClass('showNav')
    $('#overlay').toggleClass('hideOverlay')
})
$('#closeButton').on('click',()=>{
    $('nav').toggleClass('showNav');
    $('#overlay').toggleClass('hideOverlay');
})
$('#overlay').on('click',()=>{
    $('nav').toggleClass('showNav');
    $('#overlay').toggleClass('hideOverlay');
})

function autoScroll(messages){
    const newMessage = messages.children().last();
    const newMessageHeight = newMessage.innerHeight();
    const prevMessageHeight = newMessage.prev().innerHeight();
    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    if(scrollHeight <= newMessageHeight+prevMessageHeight+clientHeight+scrollTop){
        messages.scrollTop(scrollHeight);
    }
}

