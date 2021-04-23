const myLogger = require('../librarys/myLogger');

const errorHandler = function(err, req, res, next) {
  const err_status = err.status || 500;

  if (err_status !== 404) {
    myLogger.error(req.logHeadTail + err.stack);
    myLogger.error(req.logHeadTail + JSON.stringify(err));
  }
  myLogger.error(req.logHeadTail + 'message : ' + err.message);
  myLogger.error(req.logHeadTail + 'status : ' + err_status);

  res.status(err_status);
  try {
    const json_object = JSON.parse(err.message);
    res.status(200).json(json_object);
    return;
  } catch (e) {
    res.send('에러가 발생하였습니다. 접근코드 : ' + req.accessUniqueKey);
    return;
  }
    
};

module.exports = errorHandler;
