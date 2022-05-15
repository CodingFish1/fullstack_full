function successHandler(res,data){
  res.send(
    {
      "status": "success",
      "data": data
   })
}

module.exports = successHandler