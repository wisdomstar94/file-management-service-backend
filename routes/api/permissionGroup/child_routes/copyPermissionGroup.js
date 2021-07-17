const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myLogger = require('../../../librarys/myLogger');

const copyPermissionGroup = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  const isPermissionGroupCopyPossible = await db.isActivePermission(loginInfo.userKey, 'fBE1617688648208MMwd');
  if (!isPermissionGroupCopyPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20062010,
        msg: myResultCode[20062010].msg,
      },
    }));
    return;
  }



  const {
    permissionGroupKey,
  } = req.body;

  // permissionGroupKey 체크 : required
  if (typeof permissionGroupKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20062020,
        msg: myResultCode[20062020].msg,
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
        code: 20062030,
        msg: myResultCode[20062030].msg,
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
        code: 20062040,
        msg: myResultCode[20062040].msg,
      },
    }));
    return;
  }

  // 그룹 권한 조회하기
  const permissionGroupResult = await db.FmsPermissionGroups.findOne({
    where: {
      permissionGroupKey: permissionGroupKey,
      isDeletedRow: 'N',
    },
  });

  if (permissionGroupResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20062050,
        msg: myResultCode[20062050].msg,
      },
    }));
    return;
  }
  /*
    FmsPermissionGroups.permissionGroupKey
    permissionGroupName
    permissionGroupDescription
    sortNo
    permissionGroupStatus
    ...
  */

  // 해당 그룹에 등록된 권한 목록 가져오기
  const permissionResult = await db.FmsPermissionGroupUploads.findAll({
    where: {
      permissionGroupKey: permissionGroupKey,
      isDeletedRow: 'N',
    },
  });
  /*
    permissionGroupUploadKey
    permissionGroupKey
    permissionKey
    isActive
    ...
  */

  // 새로운 권한키 생성
  const newPermissionGroupKey = myGetMakeToken({ strlength: 20 });
  const newPermissionGroupInfoKey = myGetMakeToken({ strlength: 20 });

  // 트랜잭션 시작
  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');

  try {
    const createResult = await db.FmsPermissionGroups.create({
      permissionGroupKey: newPermissionGroupKey,
      permissionGroupName: '[복제] ' + permissionGroupResult.permissionGroupName,
      permissionGroupDescription: permissionGroupResult.permissionGroupDescription,
      sortNo: permissionGroupResult.sortNo,
      createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
      createdIp: req.real_ip,
      permissionGroupStatus: 'PEGRS00000001',
      // permissionGroupInfoKey: newPermissionGroupInfoKey,
    }, {
      transaction: transaction
    });

    await db.FmsPermissionGroupInfos.create({
      permissionGroupInfoKey: newPermissionGroupInfoKey,
      permissionGroupKey: newPermissionGroupKey,
      createrUserKey: loginInfo.userKey,
    }, {
      transaction: transaction
    });

    await db.FmsPermissionGroupUploads.bulkCreate(permissionResult.map((x) => {
      return {
        permissionGroupUploadKey: myGetMakeToken({ strlength: 20 }),
        permissionGroupKey: newPermissionGroupKey,
        permissionKey: x.permissionKey,
        createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
        createdIp: req.real_ip,
        isActive: x.isActive,
      };
    }), {
      transaction: transaction,
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
        code: 20062060,
        msg: myResultCode[20062060].msg,
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

module.exports = copyPermissionGroup;