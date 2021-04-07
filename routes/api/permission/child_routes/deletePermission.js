const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

const deletePermission = wrapper(async(req, res, next) => {
  const {
    permissionKey,
  } = req.body;

  // permissionKey 체크 : required
  if (typeof permissionKey !== 'string' && !Array.isArray(permissionKey)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20013010,
        msg: myResultCode[20013010].msg,
      },
    }));
    return;
  }

  if (typeof permissionKey === 'string') {
    if (permissionKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20013020,
          msg: myResultCode[20013020].msg,
        },
      }));
      return;
    }

    if (permissionKey.length !== 20) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20013030,
          msg: myResultCode[20013030].msg,
        },
      }));
      return;
    }
  } 
  
  if (Array.isArray(permissionKey)) {
    if (permissionKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20013040,
          msg: myResultCode[20013040].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < permissionKey.length; i++) {
      if (typeof permissionKey[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20013050,
            msg: myResultCode[20013050].msg,
          },
        }));
        return;
      }

      if (permissionKey[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20013060,
            msg: myResultCode[20013060].msg,
          },
        }));
        return;
      }

      if (permissionKey[i].length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20013070,
            msg: myResultCode[20013070].msg,
          },
        }));
        return;
      }
    }
  } 


  // 권한 삭제 처리
  const modifyResult = await db.FmsPermissions.update({
    isDeletedRow: 'Y',
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    updatedIp: req.real_ip,
  }, {
    where: {
      permissionKey: permissionKey,
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

module.exports = deletePermission;