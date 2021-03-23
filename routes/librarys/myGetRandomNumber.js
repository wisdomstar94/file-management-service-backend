module.exports = {
  myGetRandomNumber: function(params) {
    var ranNum = Math.floor(Math.random()*(params.max-params.min+1)) + params.min;
    return ranNum;
  }
};

