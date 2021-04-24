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
const { sequelize } = require('../../../../models');
require('dotenv').config();

const getFileDownloadUrlAccessCount = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const isDashboardFileDownloadCountWithDatelyAccessPossible = await db.isActivePermission(loginInfo.userKey, 'Y1617682922450jLJDvQ');
  if (!isDashboardFileDownloadCountWithDatelyAccessPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20040010,
        msg: myResultCode[20040010].msg,
      },
    }));
    return;
  }

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
    targetDatetime,
  } = req.body;

  // targetDatetime 체크 : required
  if (typeof targetDatetime !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20040020,
        msg: myResultCode[20040020].msg,
      },
    }));
    return;
  }

  if (!myDate(targetDatetime).isValid()) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20040030,
        msg: myResultCode[20040030].msg,
      },
    }));
    return;
  }


  const dately = myDate(targetDatetime).getDately();
  const datelyInfo = [];
  for (let i = 0; i < dately.length; i++) {
    datelyInfo.push({
      date: dately[i],
    });
  }
  const tagetTableName = `FmsFileDownloadLogs${myDate(targetDatetime).format('YYYYMM')}`;
  
  const isExistTable = await db.isExistTable(tagetTableName);
  if (isExistTable) {
    for (let i = 0; i < datelyInfo.length; i++) {
      const date = datelyInfo[i].date;
      const startDatetime = date + ' 00:00:00';
      const endDatetime = date + ' 23:59:59';

      const result = await sequelize.query(`
          SELECT 

          COUNT(*) AS \`total_count\` 

          FROM \`${process.env.MAIN_DB_DEFAULT_DATABASE}\`.\`${tagetTableName}\` AS \`FFDL\` 

          WHERE \`FFDL\`.\`isDeletedRow\` = ${sequelize.escape('N')}
          ${addWhere} 
          AND (\`FFDL\`.\`createdAt\` >= '${startDatetime}' AND \`FFDL\`.\`createdAt\` <= '${endDatetime}')
        `, { 
          replacements: addWhereValues,
          type: QueryTypes.SELECT 
        }
      );

      datelyInfo[i].count = result[0].total_count;
    }
  }

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      datelyInfo: datelyInfo,
    },
  }));
  return;
});

module.exports = getFileDownloadUrlAccessCount;
