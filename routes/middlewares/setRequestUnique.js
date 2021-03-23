const myGetMakeToken = require('../librarys/myGetMakeToken').myGetMakeToken;

const setRequestUnique = function(req, res, next) {
  const accessUniqueKey = myGetMakeToken({ strlength: 20 });
  const logHeadTail = accessUniqueKey + ' - ';

  req.logHeadTail = logHeadTail;
  req.accessUniqueKey = accessUniqueKey;

  next();
};

module.exports = setRequestUnique;
