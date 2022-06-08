var express = require('express');
var router = express.Router();

const {isAuth} = require('../service/auth.js');

const handleErrAsync = require("../service/handleErrorAsync")

const uploadControllers = require('../controller/upload.js')

const imgFilter = require('../service/image');

router.post('/', isAuth,imgFilter,handleErrAsync(uploadControllers.upLoadImg));

module.exports = router;