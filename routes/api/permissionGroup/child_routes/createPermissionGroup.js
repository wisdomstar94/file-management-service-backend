const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

const createPermissionGroup = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  const isPermissionGroupCreatePossible = await db.isActivePermission(loginInfo.userKey, 'yQWpkir1617688667026');
  if (!isPermissionGroupCreatePossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20014009,
        msg: myResultCode[20014009].msg,
      },
    }));
    return;
  }



  const {
    permissionGroupName,
    permissionGroupDescription,
    sortNo,
  } = req.body;

  // permissionGroupName 체크 : required
  if (typeof permissionGroupName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20014010,
        msg: myResultCode[20014010].msg,
      },
    }));
    return;
  }

  if (permissionGroupName.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20014020,
        msg: myResultCode[20014020].msg,
      },
    }));
    return;
  }

  if (permissionGroupName.length > 100) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20014030,
        msg: myResultCode[20014030].msg,
      },
    }));
    return;
  }

  // permissionGroupDescription 체크 : optional
  if (permissionGroupDescription !== null && permissionGroupDescription !== undefined && typeof permissionGroupDescription !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20014040,
        msg: myResultCode[20014040].msg,
      },
    }));
    return;
  }

  if (typeof permissionGroupDescription === 'string') {
    if (permissionGroupDescription.length > 255) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20014050,
          msg: myResultCode[20014050].msg,
        },
      }));
      return;
    }
  }

  // sortNo 체크 : optional
  if (sortNo !== undefined) {
    if (sortNo === null) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20014060,
          msg: myResultCode[20014060].msg,
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
            code: 20014070,
            msg: myResultCode[20014070].msg,
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
          code: 20014080,
          msg: myResultCode[20014080].msg,
        },
      }));
      return;
    }
  }


  // 새로운 권한 종류 생성
  const newPermissionGroupKey = myGetMakeToken({ strlength: 20 });

  // 트랜잭션 시작
  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');

  try {
    const createResult = await db.FmsPermissionGroups.create({
      permissionGroupKey: newPermissionGroupKey,
      permissionGroupName: permissionGroupName,
      permissionGroupDescription: permissionGroupDescription,
      sortNo: sortNo,
      createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
      createdIp: req.real_ip,
      permissionGroupStatus: 'PEGRS00000001',
    }, {
      transaction: transaction
    });

    await db.FmsPermissionGroupInfos.create({
      permissionGroupInfoKey: myGetMakeToken({ strlength: 20 }),
      permissionGroupKey: newPermissionGroupKey,
      createrUserKey: loginInfo.userKey,
    }, {
      transaction: transaction
    });

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    myLogger.info(req.logHeadTail + 'transaction rollback..!');
    myLogger.error(req.logHeadTail + 'e.stack => ' + e.stack);
    myLogger.error(req.logHeadTail + 'e => ' + JSON.stringify(e));

    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20014090,
        msg: myResultCode[20014090].msg,
      },
    }));
    return;
  }

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

module.exports = createPermissionGroup;