var myGetRandomNumber = require('./myGetRandomNumber').myGetRandomNumber;
var myGetRandomString = require('./myGetRandomString').myGetRandomString;

module.exports = {
  myGetMakeToken: function(params) {
    var timestamp = new Date().getTime();
    var timestamp_length = timestamp.toString().length;
    var str_max_length = params.strlength - timestamp_length;
    var first_length = myGetRandomNumber({
      min: 1, 
      max: str_max_length
    });
    var second_length = str_max_length - first_length;
    const token = ''.concat(
      myGetRandomString({
        str_length: first_length
      }),
      new Date().getTime(),
      myGetRandomString({
        str_length: second_length
      })
    );
    return token;
  }
};