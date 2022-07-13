var express = require('express')
var router = express.Router()

var {blogsDB} = require('../mongo.js')

router.get("/blog-list",async function(req,res,next){

try {
    const collection = await blogsDB().collection('posts2')
    // 0 is to 'exclude" 1 is to "include"
    const posts2 = await collection.find({}).project({text:0,_id:0,category:0}).toArray()
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
        const blogId = Number(req.body.blogId)
        const updatePost = {
            id:blogId,
            title:req.body.title,
            author:req.body.author,
            text:req.body.text,
        }
        // updated last modified with $currentDate no key needed
        const updatedPost = await collection.updateOne({id:blogId},{$set:updatePost,$currentDate: { lastModified: true }})
        
        res.json({message:"changed post!",status:updatedPost})
    }catch (e) {
        res.json({message:String(e),status:false})
    }
})

router.delete("/delete-blog/:blogId", async function(req,res) {
    try {
        //info coming in from client .../admin/:blogId
        let blogId = Number(req.params.blogId)
        const collection = await blogsDB().collection('posts2')
        const posts2 = await collection.deleteOne({id:blogId})
        res.json({message:'deleted blog!'})
    }catch(e) {
        res.json({message:String(e)})
    }
})


module.exports = router;