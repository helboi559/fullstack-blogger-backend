var express = require('express');
var router = express.Router();
//import mongo 
var {blogsDB} = require('../mongo.js')

/* GET home page. */
router.get('/hello-blogs', function(req, res, next) {
  res.json({ message: 'Hello from express'});
});

router.get('/all-blogs', async function(req, res, next) {
  const sortOrder = req.query.sortOrder 
  if (sortOrder === 'ASC') {
    sortOrder = 1
  } else if (sortOrder === 'DESC') {
    sortOrder = -1
  }
  const sortField = req.query.sortField
  
  const filterField = req.query.filterField 
  const filterValue = req.query.filterValue
  const filterObj = {}
  //if they exist
  if(filterField && filterValue) {
    filterObj={[filterField]:filterValue}
  }
  const sortObj = {}
  // if (sortField)
  const limit = Number(req.query.limit)
  const skip = Number(req.query.limit) * (Number(req.query.page) - 1)
  
  try {
    //changed from db.<name of collection>.doSomething() to db.collection('<name of collection>')
    
    const collection = await blogsDB().collection('posts2')
    const posts2 = await collection.find({}).toArray()
    

    // throw Error('Simulated Error') --necessary
    res.json({message:posts2,success:true})
  }catch(e) {
    console.log(e)
    res.json({message:String(e),success:false})
    // res.status(e).send('error fetching data ' + e)
  }
  // console.log('posts2', posts2)
});

// router.get('/all-blogs', async function(req, res, next) {
//   const limit = Number(req.query.limit)
//   const skip = Number(req.query.limit) * (Number(req.query.page) - 1)
//   const sortField = req.query.sortField
//   const sortOrder = req.query.sortOrder 
//   const filterField = req.query.filterField 
//   const filterValue = req.query.filterValue
  
//   try {
//     //changed from db.<name of collection>.doSomething() to db.collection('<name of collection>')
//     const collection = await blogsDB().collection('posts2')
//     const posts2 = await collection.find({}).toArray()
    

//     // throw Error('Simulated Error') --necessary
//     res.json({message:posts2,success:true})
//   }catch(e) {
//     console.log(e)
//     res.json({message:String(e),success:false})
//     // res.status(e).send('error fetching data ' + e)
//   }
//   // console.log('posts2', posts2)
// });

module.exports = router;