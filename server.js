const express = require('express')
// created new express app
const app = express()

app.use(express.json())
app.set('port', 3000)
app.use ((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers","*");
    next();
})

// connected app with mongodb database
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://MyMongoDBUser:Claire2710@gettingstarted.0k9dq.mongodb.net/', (err, client) => {    
    db = client.db('afterschoolweb')
})

app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/messages')
})

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => 
{  
    req.collection = db.collection(collectionName)
    return next()
})

// return entire collection in descending order of price
app.get('/collection/:collectionName', (req, res, next) => {
        req.collection.find({}, {sort: [['price', -1]]}).toArray((e, results) => {
            if (e) return next(e)
            res.send(results)
        })
    })

// started server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Express.js server running at localhost:3000')
})