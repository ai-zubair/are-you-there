const express = require('express');
const path = require('path')

const publicPath = path.join(__dirname,'..','public');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(publicPath));

app.listen(PORT,()=>{
    console.log(`Sever has been fired up @ port ${PORT}`)
})