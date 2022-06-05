var express = require('express');
var router = express.Router();

const PostsControllers = require('../controller/posts.js')

const handleErrAsync = require("../service/handleErrorAsync")

/* GET home page. */
router.get('/', handleErrAsync(PostsControllers.getPosts));

router.post('/', handleErrAsync(PostsControllers.createdPosts));

router.delete('/all',handleErrAsync(PostsControllers.delAllPost));

router.delete('/:id',handleErrAsync(PostsControllers.delSiglePost));

router.patch('/:id',handleErrAsync(PostsControllers.editPost));

module.exports = router;
