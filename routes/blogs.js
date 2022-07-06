var express = require('express');
var router = express.Router();
//import mongo 
var {blogsDB} = require('../mongo.js')

/* GET home page. */
router.get('/hello-blogs', function(req, res, next) {
  res.json({ message: 'Hello from express'});
});

router.get('/all-blogs', async function(req, res, next) {
  try {
    //changed from db.<name of collection>.doSomething() to db.collection('<name of collection>')
    const collection = await blogsDB().collection('posts2')
    const posts2 = await collection.find({}).toArray()
    console.log('posts2', posts2)
    res.json(posts2)
    // res.send(posts2)
  }catch(e) {
    console.log(e)
    res.status(e).send('error fetching data ' + e)
  }
  // console.log('posts2', posts2)
});

module.exports = router;