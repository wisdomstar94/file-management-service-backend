const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');

const deletePermissionGroup = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  await db.insertLog({
    logType: 'LOGTY00000015', // 그룹 권한 삭제 시도
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    // value1: JSON.stringify(userId),
    // value2: JSON.stringify(userPhone),
    // logContent: ``,
  });

  const isPermissionGroupCreatePossible = await db.isActivePermission(loginInfo.userKey, 'dxO1617688869086NNkT');
  if (!isPermissionGroupCreatePossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20015009,
        msg: myResultCode[20015009].msg,
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
        code: 20015010,
        msg: myResultCode[20015010].msg,
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
          code: 20015020,
          msg: myResultCode[20015020].msg,
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
          code: 20015030,
          msg: myResultCode[20015030].msg,
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
          code: 20015040,
          msg: myResultCode[20015040].msg,
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
            code: 20015050,
            msg: myResultCode[20015050].msg,
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
            code: 20015060,
            msg: myResultCode[20015060].msg,
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
            code: 20015070,
            msg: myResultCode[20015070].msg,
          },
        }));
        return;
      }
    }
  }


  // 권한 그룹 정보 업데이트
  const modifyResult = await db.FmsPermissionGroups.update({
    isDeletedRow: 'Y',
  }, {
    where: {
      permissionGroupKey: permissionGroupKey,
    },
  });

  await db.insertLog({
    logType: 'LOGTY00000016', // 그룹 권한 삭제 성공
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    // value1: JSON.stringify(userId),
    // value2: JSON.stringify(userPhone),
    logContent: `
      ※ 삭제된 그룹 권한 식별키 : \`${JSON.stringify(permissionGroupKey)}\`
    `,
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

module.exports = deletePermissionGroup;