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


function isUserGroupingListExist(userGroupingList, downloadTargetUserKey) {
  let isExist = false;

  for (let i = 0; i < userGroupingList.length; i++) {
    if (userGroupingList[i].downloadTargetUserKey === downloadTargetUserKey) {
      isExist = true;
      break;
    }
  }

  return isExist;
}

function getUserGroupingTargetUserKeyIndex(userGroupingList, downloadTargetUserKey) {
  let index = 0;

  for (let i = 0; i < userGroupingList.length; i++) {
    if (userGroupingList[i].downloadTargetUserKey === downloadTargetUserKey) {
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
    if (fileDownloadUrlKeyGroupingList[i].downloadTargetUserKey === fileDownloadUrlKey) {
      index = i;
      break;
    }
  }

  return index;
}

const statistics = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const isAllUserControl = await db.isActivePermission(loginInfo.userKey, 'IEjNkA1619012061260L');

  let addWhere = ``;
  const addWhereValues = {};

  if (!isAllUserControl) {
    const childUserKey = await db.FmsUsers.getChildAllUserKeys(loginInfo.userKey);

    addWhere += `
      AND \`FFDL\`.\`downloadTargetUserKey\` IN(:childUserKey) 
    `;
    addWhereValues.childUserKey = childUserKey;
  }



  const {
    targetDateTime,
  } = req.body;

  if (typeof targetDateTime !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20051010,
        msg: myResultCode[20051010].msg,
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
        code: 20051020,
        msg: myResultCode[20051020].msg,
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
        code: 20051030,
        msg: myResultCode[20051030].msg,
      },
    }));
    return;
  }
  
  const targetYYYYMM = myDate(targetDateTime).format('YYYYMM');
  const targetTableName = `FmsFileDownloadLogs${targetYYYYMM}`;

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
      ${addWhere}
    `, { 
      replacements: addWhereValues,
      type: QueryTypes.SELECT, 
    },
  );
  // ORDER BY \`FFDL\`.\`downloadTargetUserKey\` DESC, \`FFDL\`.\`fileLabelNameLogAt\` DESC, \`FFDL\`.\`fileVersionNameLogAt\` DESC

  console.log('result', result);


  const userGroupingList = [];
  
  for (let i = 0; i < result.length; i++) {
    const item = result[i];

    if (!isUserGroupingListExist(userGroupingList, item.downloadTargetUserKey)) {
      userGroupingList.push({
        downloadTargetUserKey: item.downloadTargetUserKey,
        downloadTargetUserId: item.userId,
        downloadTargetUserCompanyName: item.companyName,
        fileDownloadUrlKeyGroupingList: [],
      });
    }

    const targetUserGroupingIndex = getUserGroupingTargetUserKeyIndex(userGroupingList, item.downloadTargetUserKey);
    if (!isFileDownloadUrlKeyGroupingExist(userGroupingList[targetUserGroupingIndex].fileDownloadUrlKeyGroupingList, item.fileDownloadUrlKey)) {
      userGroupingList[targetUserGroupingIndex].fileDownloadUrlKeyGroupingList.push({
        fileDownloadUrlKey: item.fileDownloadUrlKey,
        downloadCount: 0,
      });
    }
    
    const targetDownloadUrlKeyIndex = getFileDownloadUrlKeyGroupingIndex(userGroupingList[targetUserGroupingIndex].fileDownloadUrlKeyGroupingList, item.fileDownloadUrlKey);
    userGroupingList[targetUserGroupingIndex].fileDownloadUrlKeyGroupingList[targetDownloadUrlKeyIndex].downloadCount++;
  }
  
  console.log('userGroupingList', userGroupingList);

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      userGroupingList: userGroupingList,
    },
  }));
  return;
});

module.exports = statistics;
