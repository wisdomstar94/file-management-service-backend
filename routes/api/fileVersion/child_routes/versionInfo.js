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

const versionInfo = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const isFileVersionDetailInfoAccessPossible = await db.isActivePermission(loginInfo.userKey, 'x1619829793213YmZdtK');
  if (!isFileVersionDetailInfoAccessPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20047009,
        msg: myResultCode[20047009].msg,
      },
    }));
    return;
  }


  const {
    fileVersionKey,
  } = req.body;


  // fileVersionKey 체크 : required
  if (typeof fileVersionKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20047010,
        msg: myResultCode[20047010].msg,
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
        code: 20047020,
        msg: myResultCode[20047020].msg,
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
        code: 20047030,
        msg: myResultCode[20047030].msg,
      },
    }));
    return;
  }

  const fileVersionInfo = await db.FmsFileVersions.findOne({
    // attributes: FmsFileVersionsAttributes,
    attributes: [
      'fileVersionKey', 'fileKey', 'fileVersionName', 'fileVersionCode', 'fileOriginalName', 'fileDownloadName',
      'fileVersionMemo', 'fileVersionDescription', 'filePath', 'fileSize', 'fileMimeType', 'createrUserKey', 
      'createdAt', 'createdIp', 'updaterUserKey', 'updatedAt', 'updatedIp', 'fileVersionStatus',
    ],
    where: {
      fileVersionKey: fileVersionKey,
      isDeletedRow: 'N',
    },
    include: [
      {
        as: 'FmsFiles',
        model: db.FmsFiles,
        // attributes: FmsFilesAttributes,
        attributes: ['fileKey', 'fileLabelName'],
        required: true,
      },
      {
        as: 'FmsCreaterUsers',
        model: db.FmsUsers,
        // attributes: FmsCreaterUsersAttributes,
        attributes: ['userKey', 'userName'],
        required: true,
      },
      {
        as: 'FmsUpdaterUsers',
        model: db.FmsUsers,
        // attributes: FmsUpdaterUsersAttributes,
        attributes: ['userKey', 'userName'],
        required: false,
      },
      {
        as: 'FmsFileVersionStatusCodes',
        model: db.FmsCodes,
        // attributes: FmsFileVersionStatusCodesAttributes,
        required: true,
        attributes: ['code', 'codeName'],
      },
    ],
  });

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      fileVersionInfo: fileVersionInfo,
    },
  }));
  return;
});

module.exports = versionInfo;
