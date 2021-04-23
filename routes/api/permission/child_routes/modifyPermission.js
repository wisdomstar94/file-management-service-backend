const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

const modifyPermission = wrapper(async(req, res, next) => {
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
        code: 20012508,
        msg: myResultCode[20012508].msg,
      },
    }));
    return;
  }



  const {
    menuKey,
    permissionKey,
    permissionName,
    permissionDescription,
    sortNo,
  } = req.body;

  // menuKey 체크 : optional
  if (typeof menuKey !== 'string' && menuKey !== null && menuKey !== undefined) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20012509,
        msg: myResultCode[20012509].msg,
      },
    }));
    return;
  }

  if (typeof menuKey === 'string') {
    if (menuKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012510,
          msg: myResultCode[20012510].msg,
        },
      }));
      return;
    }

    if (menuKey.length !== 20) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012520,
          msg: myResultCode[20012520].msg,
        },
      }));
      return;
    }

    const menuKeyResult = await db.FmsMenus.findOne({
      where: {
        menuKey: menuKey,
        isDeletedRow: 'N',
      },
    });
    if (menuKeyResult === null) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012530,
          msg: myResultCode[20012530].msg,
        },
      }));
      return;
    }
  } 

  // permissionKey 체크 : require
  if (typeof permissionKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20012540,
        msg: myResultCode[20012540].msg,
      },
    }));
    return;
  }

  if (permissionKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20012550,
        msg: myResultCode[20012550].msg,
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
        code: 20012560,
        msg: myResultCode[20012560].msg,
      },
    }));
    return;
  }

  const permissionKeyResult = await db.FmsPermissions.findOne({
    where: {
      permissionKey: permissionKey,
      isDeletedRow: 'N',
    },
  });
  if (permissionKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20012570,
        msg: myResultCode[20012570].msg,
      },
    }));
    return;
  }

  // permissionName 체크 : optional
  if (permissionName !== undefined && typeof permissionName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20012579,
        msg: myResultCode[20012579].msg,
      },
    }));
    return;
  }

  if (typeof permissionName === 'string') {
    if (permissionName.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012580,
          msg: myResultCode[20012580].msg,
        },
      }));
      return;
    }

    if (permissionName.length > 255) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012590,
          msg: myResultCode[20012590].msg,
        },
      }));
      return;
    }
  }

  // permissionDescription 체크 : optinoal
  if (typeof permissionDescription !== 'string' && permissionDescription !== null && permissionDescription !== undefined) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20012599,
        msg: myResultCode[20012599].msg,
      },
    }));
    return;
  }

  // sortNo 체크 : optional
  if (sortNo !== undefined) {
    if (sortNo === null) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012600,
          msg: myResultCode[20012600].msg,
        },
      }));
      return;
    }

    if (typeof sortNo === 'string') {
      if (sortNo.trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20012610,
            msg: myResultCode[20012610].msg,
          },
        }));
        return;
      }
    }

    if (isNaN(Number(sortNo))) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012620,
          msg: myResultCode[20012620].msg,
        },
      }));
      return;
    }
  }



  // 권한 정보 업데이트
  const modifyResult = await db.FmsPermissions.update({
    menuKey: menuKey,
    permissionName: permissionName,
    permissionDescription: permissionDescription,
    sortNo: sortNo,
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

module.exports = modifyPermission;