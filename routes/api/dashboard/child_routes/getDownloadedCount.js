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

const getDownloadedCount = wrapper(async(req, res, next) => {
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
    addWhere += `
      AND \`FFDL\`.\`downloadTargetUserKey\` IN(:childUserKey)
    `;
    addWhereValues.childUserKey = await db.FmsUsers.getChildAllUserKeys(loginInfo.userKey);
    // addWhereValues.push({
    //   childUserKey: await db.FmsUsers.getChildAllUserKeys(loginInfo.userKey),
    // });  
  }

  
  const isDashboardDownloadedCountAccessPossible = await db.isActivePermission(loginInfo.userKey, 'TkF1617682723752uKlJ');
  if (!isDashboardDownloadedCountAccessPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20036009,
        msg: myResultCode[20036009].msg,
      },
    }));
    return;
  }

  /*
    파일 다운로드 로그 테이블은 FmsFileDownloadLogsYYYYMM 과 같은 형태로
    월별로 테이블이 분리되는데, 모든 테이블을 전부 조회하게 되면 성능 이슈가 발생할 가능성이 많기 때문에
    특별히 기간에 대한 요청 값이 없으면 우선은 최근 4개월 분량의 테이블들만 조회하도록 로직 작성!
  */
  let {
    targetStartDatetime,
    targetEndDatetime,
  } = req.body;


  // targetStartDatetime 체크 : optional
  if (typeof targetStartDatetime === 'string') {
    if (!myDate(targetStartDatetime).isValid()) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20036010,
          msg: myResultCode[20036010].msg,
        },
      }));
      return;
    }
  }

  // targetEndDatetime 체크 : optional
  if (typeof targetEndDatetime === 'string') {
    if (!myDate(targetEndDatetime).isValid()) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20036020,
          msg: myResultCode[20036020].msg,
        },
      }));
      return;
    }
  }

  if (typeof targetStartDatetime === 'string' && targetEndDatetime === undefined) {
    targetEndDatetime = myDate().format('YYYY-MM-DD 23:59:59');
  } else if (targetStartDatetime === undefined && typeof targetEndDatetime === 'string') {
    targetStartDatetime = myDate(targetEndDatetime).add(-3, 'month').format('YYYY-MM-DD 00:00:00');
  } else {
    targetStartDatetime = myDate().add(-3, 'month').format('YYYY-MM-DD 00:00:00');
    targetEndDatetime = myDate().format('YYYY-MM-DD 23:59:59');
  }

  console.log('targetStartDatetime', targetStartDatetime);
  console.log('targetEndDatetime', targetEndDatetime);

  if (myDate(targetStartDatetime).getTime() > myDate(targetEndDatetime).getTime()) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20036030,
        msg: myResultCode[20036030].msg,
      },
    }));
    return;
  }


  const targetYYYYMM = [];
  let currentDatetime = targetStartDatetime;
  for (let i = 0; i < 1000; i++) {
    // console.log('i', i);
    // console.log('currentDatetime', currentDatetime);
    // console.log('targetEndDatetime', targetEndDatetime);
    if (myDate(currentDatetime).getTime() > myDate(targetEndDatetime).getTime()) {
      break;
    }
    const YYYYMM = myDate(currentDatetime).format('YYYYMM');
    targetYYYYMM.push(YYYYMM);
    currentDatetime = myDate(currentDatetime).add(1, 'month').format('YYYY-MM-DD 00:00:00');
  }
  
  /*
    -- 데이터 예시 --
    targetYYYYMM = [ '202101', '202102', '202103', '202104' ]
  */

  const monthlyInfo = [];

  for (let i = targetYYYYMM.length - 1; i >= 0; i--) {
    const YYYYMM = targetYYYYMM[i]; // ex) 202104
    const targetTableName = `FmsFileDownloadLogs${YYYYMM}`;
    const isExist = await db.isExistTable(targetTableName);
    if (!isExist) {
      continue;
    }

    const result = await sequelize.query(`
        SELECT 

        COUNT(*) AS \`total_count\` 

        FROM \`${process.env.MAIN_DB_DEFAULT_DATABASE}\`.\`${targetTableName}\` AS \`FFDL\` 

        WHERE \`FFDL\`.\`isDeletedRow\` = ${sequelize.escape('N')}
        ${addWhere} 
      `, { 
        replacements: addWhereValues,
        type: QueryTypes.SELECT 
      }
    );

    monthlyInfo.push({
      yyyymm: YYYYMM,
      count: result[0].total_count,
    });
  }
  
  console.log('monthlyInfo', monthlyInfo);

  let totalCount = 0;
  monthlyInfo.map((x) => {
    totalCount += x.count;
  });



  // 오늘 데이터 조회
  let todayTotalCount = 0;
  const todayTableName = `FmsFileDownloadLogs${myDate().format('YYYYMM')}`;
  const isTodayTableNameExist = await db.isExistTable(todayTableName);
  if (isTodayTableNameExist) {
    const result = await sequelize.query(`
        SELECT 

        COUNT(*) AS \`total_count\` 

        FROM \`${process.env.MAIN_DB_DEFAULT_DATABASE}\`.\`${todayTableName}\` AS \`FFDL\` 

        WHERE \`FFDL\`.\`isDeletedRow\` = ${sequelize.escape('N')}
        ${addWhere} 
        AND (\`FFDL\`.\`createdAt\` >= '${myDate().format('YYYY-MM-DD 00:00:00')}' AND \`FFDL\`.\`createdAt\` <= '${myDate().format('YYYY-MM-DD 23:59:59')}')
      `, { 
        replacements: addWhereValues,
        type: QueryTypes.SELECT 
      }
    );
    todayTotalCount = result[0].total_count;
  }



  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      monthlyInfo: monthlyInfo,
      totalCount: totalCount,
      todayTotalCount: todayTotalCount,
    },
  }));
  return;
});

module.exports = getDownloadedCount;
