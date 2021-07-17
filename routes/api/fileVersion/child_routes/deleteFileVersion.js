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

/*
  upload.fields([
    {
      name: 'fileScreenShot',
      maxCount: 50,
    },
    {
      name: 'fileRepresentImage',
      maxCount: 1,
    },
  ])
*/
const deleteFileVersion = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  await db.insertLog({
    logType: 'LOGTY00000037', // 파일 버전 삭제 시도
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    // value1: JSON.stringify(userId),
    // value2: JSON.stringify(userPhone),
    // logContent: ``,
  });

  const isFileVersionDeletePossible = await db.isActivePermission(loginInfo.userKey, 'ouqsLUq1617691194741');
  if (!isFileVersionDeletePossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20064010,
        msg: myResultCode[20064010].msg,
      },
    }));
    return;
  }

  const {
    fileVersionKey,
  } = req.body;

  

  // fileVersionKey 체크 : required
  const realFileVersionKey = [];
  if (typeof fileVersionKey === 'string') {
    if (fileVersionKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20064020,
          msg: myResultCode[20064020].msg,
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
          code: 20064030,
          msg: myResultCode[20064030].msg,
        },
      }));
      return;
    }
  } else if (Array.isArray(fileVersionKey)) {
    if (fileVersionKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20064040,
          msg: myResultCode[20064040].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < fileVersionKey.length; i++) {
      if (typeof fileVersionKey[i] === 'string') {
        realFileVersionKey.push(fileVersionKey[i]);
      }
    }

    if (fileVersionKey.length !== realFileVersionKey.length) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20064050,
          msg: myResultCode[20064050].msg,
        },
      }));
      return;
    }
  } else {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20064060,
        msg: myResultCode[20064060].msg,
      },
    }));
    return;
  }

  // 해당 파일 버전으로 할당된 다운로드 URL 이 있는지 확인하기
  const fileDownloadUrlResult = await db.FmsFileDownloadUrls.findAll({
    where: {
      fileVersionKey: fileVersionKey,
      isDeletedRow: 'N',
    },
  });
  if (fileDownloadUrlResult.length > 0) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20064070,
        msg: myResultCode[20064070].msg,
      },
    }));
    return;
  }

  // transaction 시작
  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');

  try {
    // 파일 버전 삭제 처리하기
    await db.FmsFileVersions.update({
      isDeletedRow: 'Y',
    }, {
      where: {
        fileVersionKey: fileVersionKey,
      },
      transaction: transaction,
    });

    // 4) commit
    await transaction.commit();
    myLogger.info(req.logHeadTail + 'transaction commit..!');

    await db.insertLog({
      logType: 'LOGTY00000038', // 파일 버전 삭제 성공
      createdIp: req.real_ip,
      accessUniqueKey: req.accessUniqueKey,
      userKey: loginInfo.userKey,
      // value1: JSON.stringify(newFileKey),
      // value2: JSON.stringify(userPhone),
      logContent: `
        ※ 삭제된 파일 버전 식별키 : \`${JSON.stringify(fileVersionKey)}\` 
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
        code: 20064080,
        msg: myResultCode[20064080].msg,
      },
    }));
    return;
  }
});

module.exports = deleteFileVersion;
