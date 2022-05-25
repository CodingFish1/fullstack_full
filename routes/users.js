var express = require('express');
var router = express.Router();

const UserControllers = require('../controller/users.js')

router.get('/', UserControllers.getAllUsers);

router.post('/', UserControllers.createdUser);

// router.delete('/:id',PostsControllers.delSiglePost);

router.patch('/:id',UserControllers.delSigleUser);

module.exports = router;
