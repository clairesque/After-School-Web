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

// load the static html file
var path = require("path");
app.use(express.static(path.resolve(__dirname, "public")));

// connected app with mongodb database
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://MyMongoDBUser:Claire2710@gettingstarted.0k9dq.mongodb.net/', (err, client) => {    
    db = client.db('afterschoolweb')
})

app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/lessons')
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

// post request to add object
app.post('/collection/:collectionName', (req, res, next) => {  
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)    
        res.send(results.ops)  
    })
})

// retrieve object by a specific ID
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id', (req, res, next) => {    
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
        if (e) return next(e)        
        res.send(result)    
    })
})

// put request to update an object
app.put('/collection/:collectionName/:id', (req, res, next) => {  
    req.collection.update(    
        {_id: new ObjectID(req.params.id)},    
        {$set: req.body},    
        {safe: true, multi: false}, (e, result) => {
            if (e) return next(e)      
            res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})    
        })
    })

// request to delete an object by ID
app.delete('/collection/:collectionName/:id', (req, res, next) => {    
    req.collection.deleteOne(        
        { 
            _id: ObjectID(req.params.id) 
        }, 
        (e, result) => {
            if (e) return next(e)            
            res.send((result.result.n === 1) ?                 
            {msg: 'success'} : {msg: 'error'})    
        })
    })

// started server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Express.js server running at localhost:3000')
})