const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

const modifyPermission = wrapper(async(req, res, next) => {
  const {
    menuKey,
    permissionKey,
    permissionName,
    permissionDescription,
    sortNo,
  } = req.body;

  const update = {};

  // menuKey 체크 : optional
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

    update.menuKey = menuKey;
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
      permissionKey: permissionKey
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

    update.permissionName = permissionName;
  }

  // permissionDescription 체크 : optinoal
  if (typeof permissionDescription === 'string') {
    update.permissionDescription = permissionDescription;
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

    update.sortNo = sortNo;
  }


  update.updatedAt = myDate().format('YYYY-MM-DD HH:mm:ss');
  update.updatedIp = req.real_ip;


  // 권한 정보 업데이트
  const modifyResult = await db.FmsPermissions.update(update, {
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