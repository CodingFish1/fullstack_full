var express = require('express');
var router = express.Router();

const PostsControllers = require('../controller/posts.js')

/* GET home page. */
router.get('/', PostsControllers.getPosts);

router.post('/', PostsControllers.createdPosts);

router.delete('/',PostsControllers.delAllPost);

router.delete('/:id',PostsControllers.delSiglePost);

router.patch('/:id',PostsControllers.editPost);

module.exports = router;
