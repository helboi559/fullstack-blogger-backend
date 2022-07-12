var express = require('express')
var router = express.Router()

var {blogsDB} = require('../mongo.js')

router.get("/blog-list",async function(req,res,next){
//     db.collection.find( { <array>: <condition> ... },
//                     { "<array>.$": 1 } )
// db.collection.find( { <array.field>: <condition> ...},
//                     { "<array>.$": 1 } )
try {
    const collection = await blogsDB().collection('posts2')
    // const posts2 = await collection.find({},{title:1,createdAt:1,author:1,lastModified:1,text:0}).toArray()
    const posts2 = await collection.find({}).project({text:0,_id:0,id:0,category:0}).toArray()
    res.json({message:posts2, response:true})
}  catch(e) {
    // res.status(500)
    console.log(e)
    res.json({message:String(e)})
} 

})

router.put("/edit-blog", async function(req,res,next) {
    try {
        const collection = await blogsDB().collection('posts2')
        
        const updatePost = {
            blogID:Number(req.body.blogID),
            title,
            author,
            text,
        }
        const posts2 = await collection.updateOne({id:blogID},{$set:{updatePost},$currentDate: { lastModified: true }}).toArray()
        res.json({message:posts2,status:true})
    }catch (e) {
        res.json({message:String(e),status:false})
    }
})



module.exports = router;