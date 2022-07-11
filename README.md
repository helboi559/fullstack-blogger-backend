# _Fullstack Blogger__Backend

## Requirements (Back-End Part 1A)

### Install Express w/dependencies if needed:
- Create a new github repo called fullstackbloggerbackend, clone the repo to your computer. Add a README, and a node .gitignore template.
- Initialize the repo with express-generator. add scripts and nodemon as dev dependency.
  >$ npx express-generator

  >$ npm i --save-dev nodemon

  >$ npm i 
- Change the server port to 4000 in package.JSON
  > "PORT=4000 nodemon ./bin/www"
### Create route(s) for backend && install cors for middleware
- install cors (located in express)
  > $npm i cors
- Add the following code, before/after the line var app = express();, to app.js:
  ```js
  //route for db
  var blogsRouter = require('./routes/blogs');
  app.use('/blogs', blogsRouter);

  //cors syntax
  var cors = require('cors')
  app.use(cors({origin:"http://localhost:3000"}));
  ```
- Create a new file ./routes/blogs.js.
- Create a new express GET route "hello-blogs" in the ./routes/blogs.js file that sends the following as a response :
  ```js
  var express = require('express');
  var router = express.Router();

  router.get('/hello-blogs', function(req, res, next) {
    res.json({ message: 'Hello from express'});
  });
  ```
- Run npm start/npm run dev(nodemon) in ./ and navigate to "localhost:4000/blogs/hello-blogs" to see if the above works.

## Requirements Mongo (Backend Part 2A)

### Install MongoDB
* In the fullstackbloggerbackend (Server) repo:
  * Install mongodb and dotenv
    > npm i mongodb dotenv
  * Create a new file ./.env
  * Add your Mongo Atlas connection string and DB Name (case sensitive) to the .env file. *ensure that mongo atlas is active via testing*
    
    ```js
    MONGO_URI=mongodb+srv://<myusername>:<mypassword>@<mycluster>.mongodb.net/?retryWrites=true&w=majority
    
    //DB NAME: CASE SENSETIVE
    MONGO_DATABASE=Blogs
    ```
    * Note: NoSqlBooster will still have your URI stored in the connections window. Click Connect -> Select export to URI.
  * Create a new file ./mongo.js and add the following code to it:
   ```js
   const { MongoClient } = require("mongodb");
      require("dotenv").config();

      let db;

      async function mongoConnect() {
        const uri = process.env.MONGO_URI;
        const client = new MongoClient(uri);
        try {
          await client.connect();
          db = await client.db(process.env.MONGO_DATABASE);
          console.log("db connected");
        } catch (error) {
          console.error(error)
        }
      }
      function blogsDB() {
        return db;
      }
      module.exports = {
        mongoConnect,
        blogsDB,
      };
    ```
  * Add the following code, before/after the line var app = express();, to app.js:
    ```js
    var { mongoConnect } = require('./mongo.js');
    mongoConnect();
    ```
    > 
  * Add a new GET route "all-blogs" in ./routes/blogs.js
    * Implement the following functionality in the "all-blogs" route:
    * It should respond with a list of all the blogs currently stored in your blogs database as a JSON object.
    ```js
    //import mongo to blogs.js
    var {blogsDB} = require('../mongo.js')

    //route mongo to blogsdb
    router.get('/all-blogs', async function(req, res, next) {
      try {
      //changed from db.<name of collection>.doSomething() to db.collection('<name of collection>')
      const collection = await blogsDB().collection('posts2')
      const posts2 = await collection.find({}).toArray()
      //res.send(allBlogs) or res.json(allBlogs) work
      res.json(posts2)
    }catch(e) {
      console.log(e)
      res.status(e).send('error fetching data ' + e)
    }
    
    });
    ```
## part 3b

* Implement the following in the Server
  * [Optional] Install nodemon on the server and add the custom dev command in the package.json
    * npm i nodemon
    * "scripts": {
      "start": "PORT=4000 node ./bin/www",
      "dev": "PORT=4000 nodemon ./bin/www"
    }
  * In the "/blogs/all-blogs" route, implement the following:
    * Add the following variables inside the route handler function to get query param values from the incoming GET request url:
      * const limit = Number(req.query.limit)
      * const skip = Number(req.query.limit) * (Number(req.query.page) - 1)
      * const sortField = req.query.sortField 
      * const sortOrder = req.query.sortOrder 
      * const filterField = req.query.filterField 
      * const filterValue = req.query.filterValue
    * Update the mongo query method to properly incorporate the above variables in the query.
      * let filterObj = {}
        if (filterField && filterValue) {
          filterObj = {[filterField]: filterValue}
        }
        let sortObj = {}
        if (sortField && sortOrder) {
          sortObj = {[sortField]: sortOrder}
        }
        const allBlogs = await collection
          .find(filterObj)
          .sort(sortObj)
          .limit(limit)
          .skip(skip)
          .toArray();
      * Note: sortOrder may need to be converted from "ASC" and "DESC" to 1 and -1 respectively before the query is executed.
      * Note: The above code may have to be modified depending on your implementation of the "/blogs/all-blogs" route in the fullstack blogger project. But it should be very similar in functionality to the "/blogs/all" route in the ExpressJS example. 
    * Note: The sorting, filter, limit and page functionality are now being handled by the database using the mongodb query. We will no longer need to use JS functions to implement this functionality on the blogs dataset anymore.
    * Stretch Goal: Add server-side validation to the "/blogs/all-blogs" route to ensure the following before the mongo query is executed:
      * sortField, sortOrder, filterField and filterValue must have truthy values. I.E. they must not be null or an empty string.
      * limit and page must be integer values greater than 0.
### Requirements (Fullstack Part 2 - POST Blog) 4A
* Implement the following in the Server
  * Create a new POST route "/blog-submit" and implement the following
    * Inside the route handler function, add the following variables to get the incoming values from the POST request body:
      * const title = req.body.title
      * const text = req.body.text
      * const author = req.body.author
    * Create a new blogPost object with the following fields, some of which will need to be generated with each new post.
      * title {string}
      * text {string}
      * author {string}
      * createdAt {date}
      * id {number}
      * lastModified {date}
    * Add a mongo insert method to save the new blogPost object in the database.
  * Note: Use ExpressJS Example "/blog-submit" route as reference.