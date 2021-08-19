const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
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
const myIPChecker = require('../../../librarys/myIPChecker');
const myGetDownloadFilename = require('../../../librarys/myGetDownloadFilename').myGetDownloadFilename;
require('dotenv').config();

const fileAdmin = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  // loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const isDownloadPossible = await db.isActivePermission(loginInfo.userKey, 'wLaZVRy1629376506306');
  if (!isDownloadPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20068009,
        msg: myResultCode[20068009].msg,
      },
    }));
    return;
  }




  const fileVersionKey = req.params.fileVersionKey;

  // fileVersionKey 체크 : required
  if (typeof fileVersionKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20068010,
        msg: myResultCode[20068010].msg,
      },
    }));
    return;
  }

  if (fileVersionKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20068020,
        msg: myResultCode[20068020].msg,
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
        code: 20068030,
        msg: myResultCode[20068030].msg,
      },
    }));
    return;
  }

  // 버전 정보 가져오기
  const fileVersionInfo = await db.FmsFileVersions.findOne({
    where: {
      // fileKey: fileDownloadUrlKeyResult.fileKey,
      fileVersionKey: fileVersionKey,
      isDeletedRow: 'N',
    },
  });
  

  if (fileVersionInfo === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20068040,
        msg: myResultCode[20068040].msg,
      },
    }));
    return;
  }

  // 파일 존재 유무 파악
  if (!fs.existsSync(fileVersionInfo.filePath)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20068050,
        msg: myResultCode[20068050].msg,
      },
    }));
    return;
  }

  // 다운로드 진행
  try {
    const filename = fileVersionInfo.fileDownloadName;
    const mimetype = mime.getType(fileVersionInfo.filePath);
    
    res.setHeader('Content-disposition', 'attachment; filename=' + myGetDownloadFilename({ req: req, filename: filename }));
    res.setHeader('Content-type', mimetype);
  
    let filestream = fs.createReadStream(fileVersionInfo.filePath);
    filestream.pipe(res);
    return;
  } catch (e) {
    myLogger.error(req.logHeadTail + 'e.stack => ' + e.stack);
    myLogger.error(req.logHeadTail + 'e => ' + JSON.stringify(e));
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20068060,
        msg: myResultCode[20068060].msg,
      },
    }));
    return;
  }
});

module.exports = fileAdmin;
