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

const downloadPasswordCheck = wrapper(async(req, res, next) => {
  const {
    fileDownloadUrlKey,
    password,
  } = req.body;
  

  // fileDownloadUrlKey 체크 : required
  if (typeof fileDownloadUrlKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20050010,
        msg: myResultCode[20050010].msg,
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
        code: 20050020,
        msg: myResultCode[20050020].msg,
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
        code: 20050030,
        msg: myResultCode[20050030].msg,
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
        code: 20050040,
        msg: myResultCode[20050040].msg,
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
        code: 20050050,
        msg: myResultCode[20050050].msg,
      },
    }));
    return;
  }

  // condition 정보 가져오기
  const FmsFileDownloadUrlAccessConditionsResult = await db.FmsFileDownloadUrlAccessConditions.findAll({
    where: {
      fileDownloadUrlKey: fileDownloadUrlKey,
      isDeletedRow: 'N',
      conditionType: 'FDUCT00000003',
    },
    order: [
      ['createdAt', 'DESC'],
    ],
  });

  if (FmsFileDownloadUrlAccessConditionsResult.length === 0) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20050060,
        msg: myResultCode[20050060].msg,
      },
    }));
    return;
  }

  // password 체크 : required
  if (typeof password !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20050070,
        msg: myResultCode[20050070].msg,
      },
    }));
    return;
  }

  if (password.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20050080,
        msg: myResultCode[20050080].msg,
      },
    }));
    return;
  }

  if (password !== myCrypto.decrypt({ hashedValue: FmsFileDownloadUrlAccessConditionsResult[0].value })) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20050090,
        msg: myResultCode[20050090].msg,
      },
    }));
    return;
  }

  // passwordjwt 발급! 5초 동안만 유효하도록..
  myLogger.info(req.logHeadTail + 'passwordjwt 발급! ');
  const passwordjwt = jwt.sign({
    a: myCrypto.encrypt({ originalValue: fileDownloadUrlKey }),
  }, process.env.JWT_FILE_DOWNLOAD_URL_SECRET, {
    expiresIn: '5s', 
    issuer: 'FileManageMentService',
  });
  res.cookie('passwordjwt', passwordjwt, {
    maxAge: 5000,
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
});

module.exports = downloadPasswordCheck;
