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
const { Op, Sequelize, QueryTypes } = require('sequelize');
const myIPChecker = require('../../../librarys/myIPChecker');
require('dotenv').config();

function getDateIndex(datelyList, date) {
  let index = 0;

  for (let i = 0; i < datelyList.length; i++) {
    if (datelyList[i].date === date) {
      index = i;
      break;
    }
  }

  return index;
}

function isFileDownloadUrlKeyGroupingExist(fileDownloadUrlKeyGroupingList, fileDownloadUrlKey) {
  let isExist = false;

  for (let i = 0; i < fileDownloadUrlKeyGroupingList.length; i++) {
    if (fileDownloadUrlKeyGroupingList[i].fileDownloadUrlKey === fileDownloadUrlKey) {
      isExist = true;
      break;
    }
  }

  return isExist;
}

function getFileDownloadUrlKeyGroupingIndex(fileDownloadUrlKeyGroupingList, fileDownloadUrlKey) {
  let index = 0;

  for (let i = 0; i < fileDownloadUrlKeyGroupingList.length; i++) {
    if (fileDownloadUrlKeyGroupingList[i].fileDownloadUrlKey === fileDownloadUrlKey) {
      index = i;
      break;
    }
  }

  return index;
}

const statisticsDetailInfo = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  let addWhere = ``;
  const addWhereValues = {};



  const {
    targetDateTime,
    downloadTargetUserKey,
  } = req.body;

  if (typeof targetDateTime !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20052010,
        msg: myResultCode[20052010].msg,
      },
    }));
    return;
  }

  if (targetDateTime.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20052020,
        msg: myResultCode[20052020].msg,
      },
    }));
    return;
  }

  if (!myDate(targetDateTime).isValid()) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20052030,
        msg: myResultCode[20052030].msg,
      },
    }));
    return;
  }

  // downloadTargetUserKey 체크 : required
  if (typeof downloadTargetUserKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20052040,
        msg: myResultCode[20052040].msg,
      },
    }));
    return;
  }

  if (downloadTargetUserKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20052050,
        msg: myResultCode[20052050].msg,
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
        code: 20052060,
        msg: myResultCode[20052060].msg,
      },
    }));
    return;
  }

  const downloadTargetUserKeyResult = await db.FmsUsers.findOne({
    where: {
      userKey: downloadTargetUserKey,
    },
  });
  if (downloadTargetUserKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20052070,
        msg: myResultCode[20052070].msg,
      },
    }));
    return;
  }


  
  const targetYYYYMM = myDate(targetDateTime).format('YYYYMM');
  const targetTableName = `FmsFileDownloadLogs${targetYYYYMM}`;

  addWhereValues.downloadTargetUserKey = downloadTargetUserKey;

  const result = await db.sequelize.query(`
      SELECT 

      \`FFDL\`.*, 
      \`FU\`.\`userId\` AS \`userId\`, 
      \`FC\`.\`companyName\` AS \`companyName\` 

      FROM \`${process.env.MAIN_DB_DEFAULT_DATABASE}\`.\`${targetTableName}\` AS \`FFDL\` 

      LEFT JOIN \`${process.env.MAIN_DB_DEFAULT_DATABASE}\`.\`FmsUsers\` AS \`FU\` 
      ON \`FU\`.\`userKey\` = \`FFDL\`.\`downloadTargetUserKey\` 

      LEFT JOIN \`${process.env.MAIN_DB_DEFAULT_DATABASE}\`.\`FmsCompanys\` AS \`FC\` 
      ON \`FC\`.\`companyKey\` = \`FU\`.\`companyKey\` 

      WHERE 1 = 1 
      AND \`FFDL\`.\`downloadTargetUserKey\` = :downloadTargetUserKey
      ${addWhere}

      ORDER BY \`FFDL\`.\`createdAt\` DESC 
    `, { 
      replacements: addWhereValues,
      type: QueryTypes.SELECT, 
    },
  );
  // ORDER BY \`FFDL\`.\`downloadTargetUserKey\` DESC, \`FFDL\`.\`fileLabelNameLogAt\` DESC, \`FFDL\`.\`fileVersionNameLogAt\` DESC

  console.log('result', result);

  const dately = myDate(targetDateTime).getDately();
  const datelyList = [];
  for (let i = 0; i < dately.length; i++) {
    datelyList.push({
      date: dately[i],
      fileDownloadUrlKeyGroupingList: [],
    });
  }

  for (let i = 0; i < result.length; i++) {
    const item = result[i];
    const date = myDate(item.createdAt).format('YYYY-MM-DD');
    const datelyIndex = getDateIndex(datelyList, date);

    if (!isFileDownloadUrlKeyGroupingExist(datelyList[datelyIndex].fileDownloadUrlKeyGroupingList, item.fileDownloadUrlKey)) {
      datelyList[datelyIndex].fileDownloadUrlKeyGroupingList.push({
        fileDownloadUrlKey: item.fileDownloadUrlKey,
        downloadedCount: 0,
      });
    }

    const fileDownloadUrlKeyGroupingIndex = getFileDownloadUrlKeyGroupingIndex(datelyList[datelyIndex].fileDownloadUrlKeyGroupingList, item.fileDownloadUrlKey);
    datelyList[datelyIndex].fileDownloadUrlKeyGroupingList[fileDownloadUrlKeyGroupingIndex].downloadedCount++;
  }


  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      datelyList: datelyList,
    },
  }));
  return;
});

module.exports = statisticsDetailInfo;
