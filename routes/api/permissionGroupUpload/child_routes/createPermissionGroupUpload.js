const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myLogger = require('../../../librarys/myLogger');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

const createPermissionGroupUpload = wrapper(async(req, res, next) => {
  const {
    permissionGroupKey, // string
    permissionKeyInfo, // [ { permissionKey: '', isActive: '' }, ... ]
  } = req.body;

  // permissionGroupKey 체크 : required
  if (typeof permissionGroupKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 00000000,
        msg: myResultCode[00000000].msg,
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
        code: 00000000,
        msg: myResultCode[00000000].msg,
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
        code: 00000000,
        msg: myResultCode[00000000].msg,
      },
    }));
    return;
  }

  // permissionKeyInfo 체크 : required
  if (!Array.isArray(permissionKeyInfo)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 00000000,
        msg: myResultCode[00000000].msg,
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
        code: 00000000,
        msg: myResultCode[00000000].msg,
      },
    }));
    return;
  }

  // transaction start

  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');

  try {
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
          permissionGroupKey: permissionGroupKey,
          permissionKey: item.permissionKey,
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
            permissionGroupKey: permissionGroupKey,
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
        permissionGroupKey: permissionGroupKey,
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
        code: 00000000,
        msg: myResultCode[00000000].msg,
      },
    }));
    return;
  }
});

module.exports = createPermissionGroupUpload;