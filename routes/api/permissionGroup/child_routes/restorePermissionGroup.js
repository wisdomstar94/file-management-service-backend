const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');

const restorePermissionGroup = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  if (loginInfo.userLevel !== 'USLEV00000001') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20015509,
        msg: myResultCode[20015509].msg,
      },
    }));
    return;
  }



  const {
    permissionGroupKey, // string, string[]
  } = req.body;

  // permissionGroupKey 체크 : required
  if (typeof permissionGroupKey !== 'string' && !Array.isArray(permissionGroupKey)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20015510,
        msg: myResultCode[20015510].msg,
      },
    }));
    return;
  }

  if (typeof permissionGroupKey === 'string') {
    if (permissionGroupKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20015520,
          msg: myResultCode[20015520].msg,
        },
      }));
      return;
    }

    if (permissionGroupKey.length !== 20) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20015530,
          msg: myResultCode[20015530].msg,
        },
      }));
      return;
    }
  }

  if (Array.isArray(permissionGroupKey)) {
    if (permissionGroupKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20015540,
          msg: myResultCode[20015540].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < permissionGroupKey.length; i++) {
      if (typeof permissionGroupKey[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20015550,
            msg: myResultCode[20015550].msg,
          },
        }));
        return;
      }

      if (permissionGroupKey[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20015560,
            msg: myResultCode[20015560].msg,
          },
        }));
        return;
      }

      if (permissionGroupKey[i].length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20015570,
            msg: myResultCode[20015570].msg,
          },
        }));
        return;
      }
    }
  }


  // 권한 그룹 정보 업데이트
  const modifyResult = await db.FmsPermissionGroups.update({
    isDeletedRow: 'N',
  }, {
    where: {
      permissionGroupKey: permissionGroupKey,
    },
  });

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
    },
  }));
  return;
});

module.exports = restorePermissionGroup;