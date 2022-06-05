var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { Err_Prod, Err_Dev } = require("./service/ErrByEnv");

const cors = require('cors')

var indexRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

// 補捉程式錯誤，捕捉預期外錯誤
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
	console.error('Uncaughted Exception！')
	console.error(err.name)
  console.error(err.message)
  console.error(err.stack)
	process.exit(1)
});


var app = express();

require('./connections');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', indexRouter);
app.use('/users', usersRouter);
// 404 error
app.use(function(req,res,next){
    res.status(404).json({
        status:'false',
        message:"Wrong Router"
    })
})

// error 500 預期next(err)的錯誤會到這
app.use(function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
  
    // dev
    if (process.env.NODE_ENV === "dev") {
      return Err_Dev(err, res);
    }
    // production
    if (err.name === "ValidationError") {
      err.message = "資料欄位未填寫正確，請重新輸入！";
      err.isOperational = true;
      return Err_Prod(err, res);
    }
    Err_Prod(err, res);
  });

// Express Errors
app.use(function(err,req,res,next){
    res.status(500).json({
        "err":err.message
    })
})

//補捉未處理的 catch，預防漏寫catch
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

module.exports = app;
