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
const deleteFileDownloadUrl = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  await db.insertLog({
    logType: 'LOGTY00000039', // 파일 다운로드 URL 삭제 시도
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    // value1: JSON.stringify(userId),
    // value2: JSON.stringify(userPhone),
    // logContent: ``,
  });

  const isFileDownloadUrlDeletePossible = await db.isActivePermission(loginInfo.userKey, 'd1617691641464Ptmvjx');
  if (!isFileDownloadUrlDeletePossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20065010,
        msg: myResultCode[20065010].msg,
      },
    }));
    return;
  }

  const {
    fileDownloadUrlKey,
  } = req.body;

  

  // fileDownloadUrlKey 체크 : required
  const realFileDownloadUrlKey = [];
  if (typeof fileDownloadUrlKey === 'string') {
    if (fileDownloadUrlKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20065020,
          msg: myResultCode[20065020].msg,
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
          code: 20065030,
          msg: myResultCode[20065030].msg,
        },
      }));
      return;
    }
  } else if (Array.isArray(fileDownloadUrlKey)) {
    if (fileDownloadUrlKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20065040,
          msg: myResultCode[20065040].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < fileDownloadUrlKey.length; i++) {
      if (typeof fileDownloadUrlKey[i] === 'string') {
        realFileDownloadUrlKey.push(fileDownloadUrlKey[i]);
      }
    }

    if (fileDownloadUrlKey.length !== realFileDownloadUrlKey.length) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20065050,
          msg: myResultCode[20065050].msg,
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
        code: 20065060,
        msg: myResultCode[20065060].msg,
      },
    }));
    return;
  }

  // transaction 시작
  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');

  try {
    // 파일 다운로드 URL 삭제 처리하기
    await db.FmsFileDownloadUrls.update({
      isDeletedRow: 'Y',
    }, {
      where: {
        fileDownloadUrlKey: fileDownloadUrlKey,
      },
      transaction: transaction,
    });

    // 4) commit
    await transaction.commit();
    myLogger.info(req.logHeadTail + 'transaction commit..!');

    await db.insertLog({
      logType: 'LOGTY00000040', // 파일 다운로드 URL 삭제 성공
      createdIp: req.real_ip,
      accessUniqueKey: req.accessUniqueKey,
      userKey: loginInfo.userKey,
      // value1: JSON.stringify(newFileKey),
      // value2: JSON.stringify(userPhone),
      logContent: `
        ※ 삭제된 파일 다운로드 URL 식별키 : \`${JSON.stringify(fileDownloadUrlKey)}\` 
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
        code: 20065080,
        msg: myResultCode[20065080].msg,
      },
    }));
    return;
  }
});

module.exports = deleteFileDownloadUrl;
