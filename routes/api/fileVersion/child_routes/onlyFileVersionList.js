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

const onlyFileVersionList = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const {
    fileKey,
  } = req.body;

  const where = {};
  const order = [];
  const OpAndArray = [];

  // fileKey 체크 : required
  if (typeof fileKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20059010,
        msg: myResultCode[20059010].msg,
      },
    }));
    return;
  }

  if (fileKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20059020,
        msg: myResultCode[20059020].msg,
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
        code: 20059030,
        msg: myResultCode[20059030].msg,
      },
    }));
    return;
  }


  OpAndArray.push({
    fileKey: {
      [Op.eq]: fileKey,
    },
  });

  OpAndArray.push({
    fileVersionStatus: {
      [Op.eq]: 'FVSTS00000001'
    },
  });

  OpAndArray.push({
    isDeletedRow: {
      [Op.eq]: 'N',
    },
  });

  where[Op.and] = OpAndArray;

  // order.push(['fileVersionName', 'DESC']);
  // order.push(['createdAt', 'DESC']);
  order.push(['fileVersionCode', 'DESC']);

  const FmsFileVersionsAttributes = [
    'fileVersionKey', 'fileKey', 'fileVersionName', 'fileVersionCode', 
    // 'createdAt'
  ];

  const list = await db.FmsFileVersions.findAll({
    attributes: FmsFileVersionsAttributes,
    // attributes: [
    //   'fileVersionKey', 'fileKey', 'fileVersionName', 'fileVersionCode', 'fileOriginalName', 'fileDownloadName',
    //   'fileVersionMemo', 'fileVersionDescription', 'filePath', 'fileSize', 'fileMimeType', 'createrUserKey', 
    //   'createdAt', 'createdIp', 'updaterUserKey', 'updatedAt', 'updatedIp', 'fileVersionStatus',
    // ],
    where: where,
    order: order,
  });

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      list: list,
    },
  }));
  return;
});

module.exports = onlyFileVersionList;
