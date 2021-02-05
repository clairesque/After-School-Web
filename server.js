const express = require('express')
const app = express()

app.use(express.json())
app.set('port', 3000)
app.use ((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers","*");
    next();
})

app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/messages')
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Express.js server running at localhost:3000')
})