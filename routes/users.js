var express = require('express');
var router = express.Router();

const {isAuth,generateSendJWT} = require('../service/auth');

const handleErrAsync = require("../service/handleErrorAsync")

const UserControllers = require('../controller/users.js')

router.get('/', UserControllers.getAllUsers);

router.post('/signup', handleErrAsync(UserControllers.createdUser));

router.post('/signin', handleErrAsync(UserControllers.signinUser));

router.post('/profile',isAuth, handleErrAsync(UserControllers.userAuth));

router.patch('/updatepsw',isAuth, handleErrAsync(UserControllers.updatePSW));

// router.delete('/:id',PostsControllers.delSiglePost);

router.patch('/:id',UserControllers.delSigleUser);

module.exports = router;
