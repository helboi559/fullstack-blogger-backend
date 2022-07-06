# _Fullstack Blogger__Backend

## Requirements (Back-End Part 1A)

- Create a new github repo called fullstackbloggerbackend, clone the repo to your computer and add the link to populi. Note: when you create this repository, you must add a README, and a node .gitignore template.
- Initialize the repo with express-generator. add scripts and nodemon as dev dependency.
  
  >$ npx express-generator .
  >$ npm i
  >"PORT=4000 nodemon ./bin/www" 

- Change the server port to 4000.
  >
- Add the following code, after the line var app = express();, to app.js:
  - var blogsRouter = require('./routes/blogs');
  - app.use('/blogs', blogsRouter);
- Create a new file ./routes/blogs.js.
- Create a new express GET route "hello-blogs" in the ./routes/blogs.js file that sends the following as a response:
  - res.json({message: "hello from express"})
- Run npm start in ./ and navigate to "localhost:4000/blogs/hello-blogs" to see if the above works.

## Requirements Mongo (Backend Part 2A)

* In the fullstackbloggerbackend (Server) repo:
  * Install mongodb and dotenv
    > npm i mongodb dotenv
  * Create a new file ./.env
  * Add your Mongo Atlas connection string and DB Name (case sensitive) to the .env file.
    
    ```js
    MONGO_URI=mongodb+srv://<myusername>:<mypassword>@<mycluster>.mongodb.net/?retryWrites=true&w=majority
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
  * Add the following code, after the line var app = express();, to app.js:
    > var { mongoConnect } = require('./mongo.js');
    > mongoConnect();
  * Add a new GET route "all-blogs" in ./routes/blogs.js
    * Implement the following functionality in the "all-blogs" route:
    * It should respond with a list of all the blogs currently stored in your blogs database as a JSON object 
    * res.send(allBlogs). 
    ```js
    //import mongo to blogs.js
    var {blogsDB} = require('../mongo.js')

    //route mongo to blogsdb
    router.get('/all-blogs', async function(req, res, next) {
    try {
    //changed from db.<name of collection>.doSomething() to db.collection('<name of collection>')
    const collection = await blogsDB().collection('posts2')
    const posts2 = await collection.find({}).toArray()
    res.send(posts2)
    }catch(e) {
      console.log(e)
      res.status(e).send('error fetching data ' + e)
    }
    
    });
    ```
