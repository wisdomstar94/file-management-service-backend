const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const jwt = require('jsonwebtoken');
const myCrypto = require('../../../librarys/myCrypto');
const myLogger = require('../../../librarys/myLogger');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');
const myBoard = require('../../../librarys/myBoard');
const myRegularExpressCheck = require('../../../librarys/myRegularExpressCheck');
const { Op, Sequelize } = require('sequelize');
require('dotenv').config();

function isValidFileDownloadUrlAccessConditionInfo(obj) {
  /*
    {
      fileAccessConditionKey: '',
      conditionType: 'FDUCT00000002',
      key: 'myauth',
      value: 'deefd44fgrertet453er4rr34r34r4frdg',
      conditionStatus: 'FDUCS00000001',
      type: 'new'
    }
  */

  if (typeof obj !== 'object') {
    return false;
  }

  if (typeof obj.fileAccessConditionKey !== 'string') {
    return false;
  }

  if (typeof obj.conditionType !== 'string') {
    return false;
  }

  if (typeof obj.key !== 'string') {
    return false;
  }

  if (typeof obj.value !== 'string') {
    return false;
  }

  if (typeof obj.conditionStatus !== 'string') {
    return false;
  }

  if (typeof obj.type !== 'string') {
    return false;
  }

  return true;
}

const modifyFileDownloadUrl = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const {
    fileDownloadUrlKey,
    downloadTargetUserKey,
    fileKey,
    fileVersionKey,
    // fileDownloadUrlAccessCount,
    fileDownloadPossibleDateTimeStart,
    fileDownloadPossibleDateTimeEnd,
    fileDownloadLimitMaxCount,
    fileDownloadCount,
    fileDownloadUrlAccessConditionInfo,
    fileDownloadUrlStatus,
  } = req.body;


  // fileDownloadUrlKey 체크 : required
  if (typeof fileDownloadUrlKey !== 'string') {
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

  if (fileDownloadUrlKey.trim() === '') {
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

  if (fileDownloadUrlKey.length !== 20) {
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

  // downloadTargetUserKey 체크 : optional
  if (downloadTargetUserKey !== undefined && typeof downloadTargetUserKey !== 'string') {
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

  if (typeof downloadTargetUserKey === 'string') {
    if (downloadTargetUserKey.trim() === '') {
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

    if (downloadTargetUserKey.length !== 20) {
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

    const downloadTargetUserKeyResult = await db.FmsUsers.findOne({
      where: {
        userKey: downloadTargetUserKey,
        isDeletedRow: 'N',
      },
    });
    if (downloadTargetUserKeyResult === null) {
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
  }

  // fileKey 체크 : optional
  if (fileKey !== undefined && typeof fileKey !== 'string') {
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

  if (typeof fileKey === 'string') {
    if (fileKey.trim() === '') {
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
    
    if (fileKey.length !== 20) {
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

    const fileKeyResult = await db.FmsFiles.findOne({
      where: {
        fileKey: fileKey,
        isDeletedRow: 'N',
      },
    });
    if (fileKeyResult === null) {
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
  }

  // fileVersionKey 체크 : optional
  if (fileVersionKey !== undefined && typeof fileVersionKey !== 'string') {
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

  if (typeof fileVersionKey === 'string') {
    if (fileVersionKey.trim() === '') {
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

    if (fileVersionKey.length !== 20) {
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

    const fileVersionKeyResult = await db.FmsFileVersions.findOne({
      where: {
        fileKey: fileKey,
        fileVersionKey: fileVersionKey,
        isDeletedRow: 'N',
      },
    });
    if (fileVersionKeyResult === null) {
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
  }

  // fileDownloadPossibleDateTimeStart 체크 : optional
  if (fileDownloadPossibleDateTimeStart !== undefined && typeof fileDownloadPossibleDateTimeStart !== 'string') {
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

  if (typeof fileDownloadPossibleDateTimeStart === 'string') {
    if (fileDownloadPossibleDateTimeStart.trim() === '' || !myDate(fileDownloadPossibleDateTimeStart).isValid()) {
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
  }

  // fileDownloadPossibleDateTimeEnd 체크 : optional
  if (fileDownloadPossibleDateTimeEnd !== undefined && typeof fileDownloadPossibleDateTimeEnd !== 'string') {
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

  if (typeof fileDownloadPossibleDateTimeEnd === 'string') {
    if (fileDownloadPossibleDateTimeEnd.trim() === '' || !myDate(fileDownloadPossibleDateTimeEnd).isValid()) {
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
  }

  // fileDownloadPossibleDateTimeStart & fileDownloadPossibleDateTimeEnd 체크
  if (fileDownloadPossibleDateTimeStart !== undefined || fileDownloadPossibleDateTimeEnd !== undefined) {
    if (typeof fileDownloadPossibleDateTimeStart !== 'string') {
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

    if (typeof fileDownloadPossibleDateTimeEnd !== 'string') {
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

    if (myDate(fileDownloadPossibleDateTimeStart).getTime() > myDate(fileDownloadPossibleDateTimeEnd).getTime()) {
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
  }

  // fileDownloadLimitMaxCount 체크 : optional
  if (fileDownloadLimitMaxCount !== undefined && !myCommon.isNumber(fileDownloadLimitMaxCount)) {
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

  // fileDownloadCount 체크 : optional
  if (fileDownloadCount !== undefined && !myCommon.isNumber(fileDownloadCount)) {
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

  if (myCommon.isNumber(fileDownloadCount)) {
    if (Number(fileDownloadCount) !== 0) {
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
  }

  // fileDownloadUrlAccessConditionInfo 체크 : required
  if (!Array.isArray(fileDownloadUrlAccessConditionInfo)) {
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

  const conditionTypeUnique = [];
  const conditionStatusUnique = [];

  for (let i = 0; i < fileDownloadUrlAccessConditionInfo.length; i++) {
    const item = fileDownloadUrlAccessConditionInfo[i];

    if (!isValidFileDownloadUrlAccessConditionInfo(item)) {
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

    if (item.type === 'new') {
      if (item.fileAccessConditionKey.trim() !== '') {
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
    }

    if (item.type === 'delete') {
      if (item.fileAccessConditionKey.trim() === '') {
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

      if (item.fileAccessConditionKey.length !== 20) {
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
    }

    if (item.type === 'modify') {
      if (item.fileAccessConditionKey.trim() === '') {
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

      if (item.fileAccessConditionKey.length !== 20) {
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
    }

    if (!conditionTypeUnique.includes(item.conditionType)) {
      conditionTypeUnique.push(item.conditionType);
    }

    if (!conditionStatusUnique.includes(item.conditionStatus)) {
      conditionStatusUnique.push(item.conditionStatus);
    }
  }

  for (let i = 0; i < conditionTypeUnique.length; i++) {
    const conditionTypeCheck = await db.FmsCodes.isValidCode('FDUCT', conditionTypeUnique[i]);
    if (!conditionTypeCheck) {
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
  }

  for (let i = 0; i < conditionStatusUnique.length; i++) {
    const conditionStatusCheck = await db.FmsCodes.isValidCode('FDUCS', conditionStatusUnique[i]);
    if (!conditionStatusCheck) {
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
  }

  // fileDownloadUrlStatus 체크 : optional
  if (fileDownloadUrlStatus !== undefined && typeof fileDownloadUrlStatus !== 'string') {
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

  if (typeof fileDownloadUrlStatus === 'string') {
    if (fileDownloadUrlStatus.trim() === '') {
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
    
    if (fileDownloadUrlStatus.length !== 13) {
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

    const fileDownloadUrlStatusCheck = await db.FmsCodes.isValidCode('FDUST', fileDownloadUrlStatus);
    if (!fileDownloadUrlStatusCheck) {
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
  }
  

  

  // transaction start

  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');


  try {
    // 다운로드 URL 정보 업데이트
    const updateResult = await db.FmsFileDownloadUrls.update({
      downloadTargetUserKey: downloadTargetUserKey,
      fileKey: fileKey,
      fileVersionKey: fileVersionKey,
      fileDownloadPossibleDateTimeStart: fileDownloadPossibleDateTimeStart,
      fileDownloadPossibleDateTimeEnd: fileDownloadPossibleDateTimeEnd,
      fileDownloadLimitMaxCount: fileDownloadLimitMaxCount,
      fileDownloadCount: fileDownloadCount,
      updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
      updatedIp: req.real_ip,
      updaterUserKey: loginInfo.userKey,
      fileDownloadUrlStatus: fileDownloadUrlStatus,
    }, {
      where: {
        fileDownloadUrlKey: fileDownloadUrlKey,
      },
      transaction: transaction,
    });
    console.log('updateResult', updateResult);

    // 파일 다운로드 접근 제한 데이터 적용
    for (let i = 0; i < fileDownloadUrlAccessConditionInfo.length; i++) {
      const item = fileDownloadUrlAccessConditionInfo[i];

      if (item.type === 'new') {
        const newFileAccessConditionKey = myGetMakeToken({ strlength: 20 });

        await db.FmsFileDownloadUrlAccessConditions.create({
          fileAccessConditionKey: newFileAccessConditionKey,
          fileDownloadUrlKey: fileDownloadUrlKey,
          conditionType: item.conditionType,
          key: item.key,
          value: item.value, 
          createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
          createdIp: req.real_ip,
          createrUserKey: loginInfo.userKey,
          conditionStatus: item.conditionStatus,
        }, {
          transaction: transaction,
        });
      }

      if (item.type === 'modify') {
        await db.FmsFileDownloadUrlAccessConditions.update({
          conditionType: item.conditionType,
          key: item.key,
          value: item.value, 
          updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
          updatedIp: req.real_ip,
          updaterUserKey: loginInfo.userKey,
          conditionStatus: item.conditionStatus,
        }, {
          where: {
            fileAccessConditionKey: item.fileAccessConditionKey,
          },
          transaction: transaction,
        });
      }

      if (item.type === 'delete') {
        await db.FmsFileDownloadUrlAccessConditions.update({
          updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
          updatedIp: req.real_ip,
          updaterUserKey: loginInfo.userKey,
          isDeletedRow: 'Y',
        }, {
          where: {
            fileAccessConditionKey: item.fileAccessConditionKey,
          },
          transaction: transaction,
        });
      }
    }

    await transaction.commit();
    myLogger.info(req.logHeadTail + 'transaction commit..!');

    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 10001000,
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

module.exports = modifyFileDownloadUrl;
