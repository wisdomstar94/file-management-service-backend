const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myLogger = require('../../../librarys/myLogger');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

const getPermissionGroupUpload = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  const isPermissionGroupDetailAccessPossible = await db.isActivePermission(loginInfo.userKey, 'a1617688685796Oslkvi');
  if (!isPermissionGroupDetailAccessPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20016509,
        msg: myResultCode[20016509].msg,
      },
    }));
    return;
  }


  const {
    permissionGroupKey, // string
  } = req.body;

  // const where = {};
  // const order = [];
  // const OpAndArray = [];

  // permissionGroupKey 체크 : required
  if (typeof permissionGroupKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20016510,
        msg: myResultCode[20016510].msg,
      },
    }));
    return;
  }
  
  if (permissionGroupKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20016520,
        msg: myResultCode[20016520].msg,
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
        code: 20016530,
        msg: myResultCode[20016530].msg,
      },
    }));
    return;
  }


  // 리스트 가져오기
  const list = await db.FmsPermissionGroupUploads.findAll({
    attributes: [
      'seq', 'permissionGroupUploadKey', 'permissionGroupKey', 'permissionKey',
      'createdAt', 'createdIp', 'isActive',
    ],
    include: [
      {
        model: db.FmsPermissions,
        attributes: [
          'menuKey', 'permissionKey', 'permissionName', 'permissionDescription',
          'sortNo', 'createdAt',
        ],
      },
      {
        model: db.FmsPermissionGroups,
        attributes: [
          'permissionGroupKey', 'permissionGroupName', 'permissionGroupDescription',
          'sortNo', 'createdAt',
        ],
      },
    ],
    where: {
      permissionGroupKey: permissionGroupKey,
      isActive: 'Y',
      isDeletedRow: 'N',
    },
    order: [
      ['createdAt', 'DESC'],
    ],
  });

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      list: list,
    },
  }));
  return;
});

module.exports = getPermissionGroupUpload;