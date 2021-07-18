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
const myIPChecker = require('../../../librarys/myIPChecker');
require('dotenv').config();

const downloadCheck = wrapper(async(req, res, next) => {
  const {
    fileDownloadUrlKey,
  } = req.body;
  

  // fileDownloadUrlKey 체크 : required
  if (typeof fileDownloadUrlKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20058010,
        msg: myResultCode[20058010].msg,
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
        code: 20058020,
        msg: myResultCode[20058020].msg,
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
        code: 20058030,
        msg: myResultCode[20058030].msg,
      },
    }));
    return;
  }

  const fileDownloadUrlKeyResult = await db.FmsFileDownloadUrls.findOne({
    where: {
      fileDownloadUrlKey: fileDownloadUrlKey,
      isDeletedRow: 'N',
    },
    include: [
      // {
      //   as: 'FmsFileDownloadUrlTargetUsers',
      //   model: db.FmsUsers,
      //   // attributes: FmsFileDownloadUrlTargetUsersAttributes,
      //   attributes: ['userKey', 'userId', 'userName'],
      //   required: true,
      // },
      // {
      //   as: 'FmsTargetFiles',
      //   model: db.FmsFiles,
      //   // attributes: FmsTargetFilesAttributes,
      //   attributes: ['fileKey', 'fileLabelName', 'fileStatus'],
      //   required: true,
      // },
      // {
      //   as: 'FmsTargetFileVersions',
      //   model: db.FmsFileVersions,
      //   // attributes: FmsTargetFileVersionsAttributes,
      //   attributes: ['fileVersionKey', 'fileKey', 'fileVersionName', 'fileVersionCode', 'fileDownloadName', 'filePath', 'fileSize', 'fileVersionStatus'],
      //   required: false,
      // },
      // {
      //   as: 'FmsCreaterUsers',
      //   model: db.FmsUsers,
      //   // attributes: FmsCreaterUsersAttributes,
      //   attributes: ['userKey', 'userId', 'userName'],
      //   required: true,
      // },
      // {
      //   as: 'FmsUpdaterUsers',
      //   model: db.FmsUsers,
      //   // attributes: FmsUpdaterUsersAttributes,
      //   attributes: ['userKey', 'userId', 'userName'],
      //   required: false,
      // },
      // {
      //   as: 'FmsFileDownloadUrlStatusCodes',
      //   model: db.FmsCodes,
      //   // attributes: FmsFileDownloadUrlStatusCodesAttributes,
      //   attributes: ['code', 'codeName'],
      //   required: true,
      // },
    ],
  });

  if (fileDownloadUrlKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20058040,
        msg: myResultCode[20058040].msg,
      },
    }));
    return;
  }

  if (fileDownloadUrlKeyResult.fileDownloadUrlStatus !== 'FDUST00000001') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20058050,
        msg: myResultCode[20058050].msg,
      },
    }));
    return;
  }

  // downloadjwt 발급! 4초 동안만 유효하도록..
  myLogger.info(req.logHeadTail + 'downloadjwt 발급! ');
  const downloadjwt = jwt.sign({
    a: myCrypto.encrypt({ originalValue: fileDownloadUrlKey }),
  }, process.env.JWT_FILE_DOWNLOAD_URL_SECRET, {
    expiresIn: '4s', 
    issuer: 'FileManageMentService',
  });
  // res.clearCookie('downloadjwt');
  // res.cookie('downloadjwt', downloadjwt, {
  //   maxAge: 4000,
  // });

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      downloadjwt: downloadjwt,
    },
  }));
  return;
});

module.exports = downloadCheck;
