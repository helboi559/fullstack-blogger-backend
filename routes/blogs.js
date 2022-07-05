var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/hello-blogs', function(req, res, next) {
  res.json({ message: 'Hello from express'});
});

module.exports = router;