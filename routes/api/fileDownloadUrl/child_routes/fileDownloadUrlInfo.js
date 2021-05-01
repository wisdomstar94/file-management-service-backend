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

const fileDownloadUrlInfo = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const isFileDownloadUrlDetailInfoAccessPossible = await db.isActivePermission(loginInfo.userKey, 'LuKd1619833701072JIk');
  if (!isFileDownloadUrlDetailInfoAccessPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20048009,
        msg: myResultCode[20048009].msg,
      },
    }));
    return;
  }


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
        code: 20048010,
        msg: myResultCode[20048010].msg,
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
        code: 20048020,
        msg: myResultCode[20048020].msg,
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
        code: 20048030,
        msg: myResultCode[20048030].msg,
      },
    }));
    return;
  }





  const fileDownloadUrlInfo = await db.FmsFileDownloadUrls.findOne({
    // attributes: FmsFileDownloadUrlsAttributes,
    attributes: [
      'fileDownloadUrlKey', 'downloadTargetUserKey', 'fileKey', 'fileVersionKey',
      'fileDownloadUrlAccessCount', 'fileDownloadPossibleDateTimeStart', 'fileDownloadPossibleDateTimeEnd', 
      'fileDownloadLimitMaxCount', 'fileDownloadCount', 'createdAt', 'createdIp', 'createrUserKey', 
      'updatedAt', 'updatedIp', 'updaterUserKey', 'fileDownloadUrlStatus',
    ],
    where: {
      fileDownloadUrlKey: fileDownloadUrlKey,
      isDeletedRow: 'N',
    },
    include: [
      {
        as: 'FmsFileDownloadUrlTargetUsers',
        model: db.FmsUsers,
        // attributes: FmsFileDownloadUrlTargetUsersAttributes,
        attributes: ['userKey', 'userId', 'userName'],
        required: true,
      },
      {
        as: 'FmsTargetFiles',
        model: db.FmsFiles,
        // attributes: FmsTargetFilesAttributes,
        attributes: ['fileKey', 'fileLabelName'],
        required: true,
      },
      {
        as: 'FmsTargetFileVersions',
        model: db.FmsFileVersions,
        // attributes: FmsTargetFileVersionsAttributes,
        attributes: ['fileVersionKey', 'fileKey', 'fileVersionName', 'fileVersionCode'],
        required: true,
      },
      {
        as: 'FmsCreaterUsers',
        model: db.FmsUsers,
        // attributes: FmsCreaterUsersAttributes,
        attributes: ['userKey', 'userId', 'userName'],
        required: true,
      },
      {
        as: 'FmsUpdaterUsers',
        model: db.FmsUsers,
        // attributes: FmsUpdaterUsersAttributes,
        attributes: ['userKey', 'userId', 'userName'],
        required: false,
      },
      {
        as: 'FmsFileDownloadUrlStatusCodes',
        model: db.FmsCodes,
        // attributes: FmsFileDownloadUrlStatusCodesAttributes,
        attributes: ['code', 'codeName'],
        required: true,
      },
    ],
  });

  let conditionInfo = null;
  if (fileDownloadUrlInfo !== null) {
    conditionInfo = await db.FmsFileDownloadUrlAccessConditions.findAll({
      attributes: [
        'fileAccessConditionKey', 'fileDownloadUrlKey', 'conditionType', 'key', 'value',
        'createdAt', 'createrUserKey', 'updatedAt', 'updaterUserKey',
        'conditionStatus',
      ],
      where: {
        fileDownloadUrlKey: fileDownloadUrlInfo.fileDownloadUrlKey,
        isDeletedRow: 'N',
      },
      order: [
        ['createdAt', 'DESC']
      ],
      include: [
        {
          as: 'FmsFileDownloadAccessConditionTypeCodes',
          model: db.FmsCodes,
          attributes: ['code', 'codeName'],
        },
      ],
      group: ['conditionType'],
    });
  }


  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      fileDownloadUrlInfo: fileDownloadUrlInfo,
      conditionInfo: conditionInfo,
    },
  }));
  return;
});

module.exports = fileDownloadUrlInfo;
