const myGetMakeToken = require('../librarys/myGetMakeToken').myGetMakeToken;
const myResultCode = require('../librarys/myResultCode');
const db = require('../../models/index');
const wrapper = require('../librarys/myAsyncWrapper');
const myValueLog = require('../librarys/myValueLog');


const uploadFileVersionPermissionCheck = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  const isFileUploadPossible = await db.isActivePermission(loginInfo.userKey, 'u1617690905605MYBYVC');
  if (!isFileUploadPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20032010,
        msg: myResultCode[20032010].msg,
      },
    }));
    return;
  }

  next();
});

module.exports = uploadFileVersionPermissionCheck;
