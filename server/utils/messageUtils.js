const generateMessage = (from,text)=>({
    from,
    text,
    createdAt:Date.now()
})

module.exports = {
    generateMessage
}