var iconvLite = require('iconv-lite');

module.exports = {
  myGetDownloadFilename: function(params) {
    var header = params.req.headers['user-agent'];
    
    if (header.includes("MSIE") || header.includes("Trident")) { 
      return encodeURIComponent(params.filename).replace(/\\+/gi, "%20");
    } else if (header.includes("Chrome")) {
      return iconvLite.decode(iconvLite.encode(params.filename, "UTF-8"), 'ISO-8859-1');
    } else if (header.includes("Opera")) {
      return iconvLite.decode(iconvLite.encode(params.filename, "UTF-8"), 'ISO-8859-1');
    } else if (header.includes("Firefox")) {
      return iconvLite.decode(iconvLite.encode(params.filename, "UTF-8"), 'ISO-8859-1');
    }

    return params.filename;
  }
};

