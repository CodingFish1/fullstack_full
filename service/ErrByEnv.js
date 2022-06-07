// PROD : 只顯示定義好的ERR
const Err_Prod = (err, res) => {
    if (err.isOperational) {
       // 預期錯誤: 送出定義訊息
      res.status(err.statusCode).json({
        message: err.message,
      });
    } else {
      // log 紀錄
      console.error("出現重大錯誤", err);
      // 非預期錯誤: 送出罐頭預設訊息
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  };
  
  // DEV : 全部ERR都顯示
  const Err_Dev = (err, res) => {
    res.status(err.statusCode).json({
      message: err.message,
      error: err,
      stack: err.stack,
    });
  };
  
  module.exports = { Err_Prod, Err_Dev };