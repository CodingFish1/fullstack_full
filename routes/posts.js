var express = require('express');
var router = express.Router();

const PostsControllers = require('../controller/posts.js')

const handleErrAsync = require("../service/handleErrorAsync")

const {isAuth,generateSendJWT} = require('../service/auth');

/* GET home page. */
router.get('/',isAuth ,handleErrAsync(PostsControllers.getPosts));

router.post('/', isAuth,handleErrAsync(PostsControllers.createdPosts));

router.delete('/all',isAuth,handleErrAsync(PostsControllers.delAllPost));

router.delete('/:id',isAuth,handleErrAsync(PostsControllers.delSiglePost));

router.post('/:id/likes',isAuth,handleErrAsync(PostsControllers.addLike));

router.delete('/:id/likes',isAuth,handleErrAsync(PostsControllers.removeLike));

router.post('/:id/comment',isAuth,handleErrAsync(PostsControllers.addComment));

module.exports = router;
