var express = require('express');
var router = express.Router();

const PostsControllers = require('../controller/posts.js')

/* GET home page. */
router.get('/posts', PostsControllers.getPosts);

router.post('/posts', PostsControllers.createdPosts);

module.exports = router;
