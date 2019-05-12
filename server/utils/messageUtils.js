const generateMessage = (from,text)=>({
    from,
    text,
    createdAt:Date.now()
})

const generateLocationMessage = (from ,lat,lng)=>({
    from,
    url: `https://www.google.com/maps?q=${lat},${lng}`,
    createdAt: Date.now()
})

module.exports = {
    generateMessage,
    generateLocationMessage
}