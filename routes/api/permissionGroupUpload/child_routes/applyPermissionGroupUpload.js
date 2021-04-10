const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myLogger = require('../../../librarys/myLogger');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

// /api/permissionGroup/createPermissionGroup 대체 
const applyPermissionGroupUpload = wrapper(async(req, res, next) => {
  const {
    permissionGroupKey, // string 또는 undefined
    permissionKeyInfo, // [ { permissionKey: '', isActive: '' }, ... ]

    permissionGroupName,
    permissionGroupDescription,
    sortNo,
    permissionGroupStatus,
  } = req.body;

  // permissionGroupKey 체크 : required
  if (typeof permissionGroupKey !== 'string' && permissionGroupKey !== undefined) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20016010,
        msg: myResultCode[20016010].msg,
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
          code: 20016020,
          msg: myResultCode[20016020].msg,
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
          code: 20016030,
          msg: myResultCode[20016030].msg,
        },
      }));
      return;
    }
  }

  // permissionKeyInfo 체크 : required
  if (!Array.isArray(permissionKeyInfo)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20016040,
        msg: myResultCode[20016040].msg,
      },
    }));
    return;
  }

  if (permissionKeyInfo.length === 0) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20016050,
        msg: myResultCode[20016050].msg,
      },
    }));
    return;
  }

  // permissionGroupName 체크 : required
  if (typeof permissionGroupName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20016060,
        msg: myResultCode[20016060].msg,
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
        code: 20016070,
        msg: myResultCode[20016070].msg,
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
        code: 20016080,
        msg: myResultCode[20016080].msg,
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
        code: 20016090,
        msg: myResultCode[20016090].msg,
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
          code: 20016100,
          msg: myResultCode[20016100].msg,
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
          code: 20016110,
          msg: myResultCode[20016110].msg,
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
            code: 20016120,
            msg: myResultCode[20016120].msg,
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
          code: 20016130,
          msg: myResultCode[20016130].msg,
        },
      }));
      return;
    }
  }

  // permissionGroupStatus 체크
  if (permissionGroupStatus !== undefined && typeof permissionGroupStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20016131,
        msg: myResultCode[20016131].msg,
      },
    }));
    return;
  }

  if (typeof permissionGroupStatus === 'string') {
    if (permissionGroupStatus.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20016132,
          msg: myResultCode[20016132].msg,
        },
      }));
      return;
    }

    if (permissionGroupStatus.length !== 13) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20016133,
          msg: myResultCode[20016133].msg,
        },
      }));
      return;
    }

    const permissionGroupStatusCheck = await db.FmsCodes.isValidCode('PEGRS', permissionGroupStatus);
    if (!permissionGroupStatusCheck) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20016134,
          msg: myResultCode[20016134].msg,
        },
      }));
      return;
    }
  }



  // transaction start

  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');

  try {
    let permissionGroupKeyReal = permissionGroupKey;

    if (permissionGroupKey === undefined) {
      // 새로운 권한 종류 생성
      const newPermissionGroupKey = myGetMakeToken({ strlength: 20 });

      await db.FmsPermissionGroups.create({
        permissionGroupKey: newPermissionGroupKey,
        permissionGroupName: permissionGroupName,
        permissionGroupDescription: permissionGroupDescription,
        sortNo: sortNo,
        createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
        createdIp: req.real_ip,
        permissionGroupStatus: 'PEGRS00000001',
      }, {
        transaction: transaction,
      });

      permissionGroupKeyReal = newPermissionGroupKey;
    } else {
      // 존재하는 권한 그룹인지 체크
      const permissionGroupKeyResult = await db.FmsPermissionGroups.findOne({
        where: {
          permissionGroupKey: permissionGroupKeyReal,
          isDeletedRow: 'N',
        },
      }, {
        transaction: transaction,
      });

      // 존재하지 않는 권한 그룹 고유 식별키이면 막기
      if (permissionGroupKeyResult === null) {
        await transaction.rollback();
        myLogger.info(req.logHeadTail + 'transaction rollback..!');

        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20016150,
            msg: myResultCode[20016150].msg,
          },
        }));
        return;
      }

      // 존재하는 권한 그룹 고유 식별키이면 정보 업데이트
      const modifyResult = await db.FmsPermissionGroups.update({
        permissionGroupName: permissionGroupName,
        permissionGroupDescription: permissionGroupDescription,
        sortNo: sortNo,
        permissionGroupStatus: permissionGroupStatus,
        updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
        updatedIp: req.real_ip,
      }, {
        where: {
          permissionGroupKey: permissionGroupKey,
        },
        transaction: transaction,
      });
    }
    
    let successCount = 0;

    for (let i = 0; i < permissionKeyInfo.length; i++) {
      const item = permissionKeyInfo[i];
      /*
        item.permissionKey
        item.isActive
      */
      if (typeof item.permissionKey !== 'string') {
        continue;
      }

      if (item.permissionKey.trim() === '') {
        continue;
      }

      if (item.permissionKey.length !== 20) {
        continue;
      }

      if (item.isActive !== 'Y' && item.isActive !== 'N') {
        continue;
      }
      
      const permissionKeyResult = await db.FmsPermissionGroupUploads.findOne({
        where: {
          permissionGroupKey: permissionGroupKeyReal,
          permissionKey: item.permissionKey,
          isDeletedRow: 'N',
        },
        transaction: transaction,
      });

      if (permissionKeyResult !== null) {
        await db.FmsPermissionGroupUploads.update({
          isActive: item.isActive,
          updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
          updatedIp: req.real_ip,
        }, {
          where: {
            permissionGroupKey: permissionGroupKeyReal,
            permissionKey: item.permissionKey,
          },
          transaction: transaction,
        });
        successCount++;
        continue;
      }
      
      const newPermissionGroupUploadKey = myGetMakeToken({ strlength: 20 });

      await db.FmsPermissionGroupUploads.create({
        permissionGroupUploadKey: newPermissionGroupUploadKey,
        permissionGroupKey: permissionGroupKeyReal,
        permissionKey: item.permissionKey,
        createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
        createdIp: req.real_ip,
        isActive: item.isActive,
      }, {
        transaction: transaction,
      });
      successCount++;
    }

    await transaction.commit();
    myLogger.info(req.logHeadTail + 'transaction commit..!');

    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 10001000,
        requestCount: permissionKeyInfo.length,
        successCount: successCount,
      },
    }));
    return;
  } catch (e) {
    await transaction.rollback();
    myLogger.info(req.logHeadTail + 'transaction rollback..!');
    myLogger.error(req.logHeadTail + 'e.stack => ' + e.stack);
    myLogger.error(req.logHeadTail + 'e => ' + JSON.stringify(e));
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20016140,
        msg: myResultCode[20016140].msg,
      },
    }));
    return;
  }
});

module.exports = applyPermissionGroupUpload;