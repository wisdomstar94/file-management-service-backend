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

  const isDashboardFileDownloadUrlAccessPossible = await db.isActivePermission(loginInfo.userKey, 'ZnSKbN1617682902715D');
  if (!isDashboardFileDownloadUrlAccessPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20039010,
        msg: myResultCode[20039010].msg,
      },
    }));
    return;
  }

  const isAllUserControl = await db.isActivePermission(loginInfo.userKey, 'IEjNkA1619012061260L');


  const whereOpAndArray = [];
  const whereTodayOpAndArray = [];

  if (!isAllUserControl) {
    const childUserKey = await db.FmsUsers.getChildAllUserKeys(loginInfo.userKey);

    // console.log('childUserKey', childUserKey);

    whereOpAndArray.push({
      createrUserKey: {
        [Op.in]: childUserKey,
      },
    });
    whereTodayOpAndArray.push({
      createrUserKey: {
        [Op.in]: childUserKey,
      },
    });
  }


  whereTodayOpAndArray.push({
    createdAt: {
      [Op.gte]: myDate().format('YYYY-MM-DD 00:00:00'),
    },
  });
  whereTodayOpAndArray.push({
    createdAt: {
      [Op.lte]: myDate().format('YYYY-MM-DD 23:59:59'),
    },
  });



  const {
    searchStartDatetime,
    searchEndDatetime,
  } = req.body;

  // searchStartDatetime 체크 : optional
  if (typeof searchStartDatetime === 'string') {
    if (!myDate(searchStartDatetime).isValid()) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20039020,
          msg: myResultCode[20039020].msg,
        },
      }));
      return;
    }

    whereOpAndArray.push({
      createdAt: {
        [Op.gte]: searchStartDatetime,
      },
    });
  }

  // searchEndDatetime 체크 : optional
  if (typeof searchEndDatetime === 'string') {
    if (!myDate(searchEndDatetime).isValid()) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20039030,
          msg: myResultCode[20039030].msg,
        },
      }));
      return;
    }

    whereOpAndArray.push({
      createdAt: {
        [Op.lte]: searchEndDatetime,
      },
    });
  }

  
  if (typeof searchStartDatetime === 'string' && typeof searchEndDatetime === 'string') {
    if (myDate(searchStartDatetime).getTime() > myDate(searchEndDatetime).getTime()) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20039040,
          msg: myResultCode[20039040].msg,
        },
      }));
      return;
    }
  }


  const fileDownloadUrlList = await db.FmsFileDownloadUrls.findAll({
    attributes: [
      'fileDownloadUrlAccessCount',
    ],
    where: {
      [Op.and]: whereOpAndArray,
      isDeletedRow: 'N',
    },
  });

  let totalAccessCount = 0;
  fileDownloadUrlList.map((x) => {
    totalAccessCount += x.fileDownloadUrlAccessCount;
  });

  // 오늘 데이터 가져오기
  const fileTodayDownloadUrlList = await db.FmsFileDownloadUrls.findAll({
    attributes: [
      'fileDownloadUrlAccessCount',
    ],
    where: {
      [Op.and]: whereTodayOpAndArray,
      isDeletedRow: 'N',
    },
  });

  let todayTotalAccessCount = 0;
  fileTodayDownloadUrlList.map((x) => {
    todayTotalAccessCount += x.fileDownloadUrlAccessCount;
  });




  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      totalAccessCount: totalAccessCount,
      todayTotalAccessCount: todayTotalAccessCount,
    },
  }));
  return;
});

module.exports = getFileDownloadUrlAccessCount;
