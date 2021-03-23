module.exports = {
  myGetRandomString: function(params) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    
    for (var i=0; i<params.str_length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },
  myGetRandomNumberOneString: function(params) {
    var text = "";
    var possible = "123456789";
    if (params.is_zero_include) {
      possible = "0123456789";
    }
    
    for (var i=0; i<1; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
};

