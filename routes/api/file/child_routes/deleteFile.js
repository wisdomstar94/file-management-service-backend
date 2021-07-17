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
const deleteFile = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  await db.insertLog({
    logType: 'LOGTY00000035', // 파일 삭제 시도
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    // value1: JSON.stringify(userId),
    // value2: JSON.stringify(userPhone),
    // logContent: ``,
  });

  const isFileDeletePossible = await db.isActivePermission(loginInfo.userKey, 'sSqwa1626509636330ck');
  if (!isFileDeletePossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20063010,
        msg: myResultCode[20063010].msg,
      },
    }));
    return;
  }

  const {
    fileKey,
  } = req.body;

  

  // fileKey 체크 : required
  const realFileKey = [];
  if (typeof fileKey === 'string') {
    if (fileKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20063020,
          msg: myResultCode[20063020].msg,
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
          code: 20063030,
          msg: myResultCode[20063030].msg,
        },
      }));
      return;
    }
  } else if (Array.isArray(fileKey)) {
    if (fileKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20063040,
          msg: myResultCode[20063040].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < fileKey.length; i++) {
      if (typeof fileKey[i] === 'string') {
        realFileKey.push(fileKey[i]);
      }
    }

    if (fileKey.length !== realFileKey.length) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20063050,
          msg: myResultCode[20063050].msg,
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
        code: 20063060,
        msg: myResultCode[20063060].msg,
      },
    }));
    return;
  }



  // transaction 시작
  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');

  try {
    // 파일 삭제 처리하기
    await db.FmsFiles.update({
      isDeletedRow: 'Y',
    }, {
      where: {
        fileKey: fileKey,
      },
      transaction: transaction,
    });

    // 4) commit
    await transaction.commit();
    myLogger.info(req.logHeadTail + 'transaction commit..!');

    await db.insertLog({
      logType: 'LOGTY00000036', // 파일 삭제 성공
      createdIp: req.real_ip,
      accessUniqueKey: req.accessUniqueKey,
      userKey: loginInfo.userKey,
      // value1: JSON.stringify(newFileKey),
      // value2: JSON.stringify(userPhone),
      logContent: `
        ※ 삭제된 파일 식별키 : \`${JSON.stringify(fileKey)}\` 
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
        code: 20063070,
        msg: myResultCode[20063070].msg,
      },
    }));
    return;
  }
});

module.exports = deleteFile;
