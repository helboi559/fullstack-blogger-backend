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
    
    let skip = Number(req.query.limit) * (Number(req.query.page) - 1)
    let limit = Number(req.query.limit)
    let sortOrder = req.query.sortOrder 
    if (sortOrder === 'ASC') {
      sortOrder = 1
    } else if (sortOrder === 'DESC') {
      sortOrder = -1
    }
    let filterField = req.query.filterField 
    let filterValue = req.query.filterValue
    let sortField = req.query.sortField
     //changed from db.<name of collection>.doSomething() to db.collection('<name of collection>')
    let collection = await blogsDB().collection('posts2')
    let sortObj = {}
    //if they exist
    if (sortField && sortOrder) {
      sortObj = {[sortField]:sortOrder}
    }
    
    let filterObj = {}
    //if they exist
    if(filterField && filterValue) {
      filterObj={[filterField]:filterValue}
    } 
    
    let posts2 = await collection
      .find(filterObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();
    

    // throw Error('Simulated Error') --necessary
    res.json({message:posts2,success:true})
  }catch(e) {
    console.log(e)
    res.json({message:String(e),success:false})
    // res.status(e).send('error fetching data ' + e)
  }
  // console.log('posts2', posts2)
});

router.post('/blog-submit', async function(req, res, next) {
  try {
    const collection = await blogsDB.collection('posts2')
    const posts2 = await collection.find({}).toArray()
    const title = req.body.title
    const text = req.body.text
    const author = req.body.author
    const now= new Date()
    const newPost = {
      title:title,
      text:text,
      author:author,
      createdAt:now,
      id:posts2.length += 1,
      lastModified:now
    }
    //add post
    const addPost = await collection.insertOne(newPost)
    res.json({message:'success'})
  } catch (e){
    res.json({message:'failed'})
  }
  

});

module.exports = router;