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

const getUploadedFileCount = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const isAllUserControl = await db.isActivePermission(loginInfo.userKey, 'IEjNkA1619012061260L');

  const isDashboardUploadedFileCountAccessPossible = await db.isActivePermission(loginInfo.userKey, 'VHI1617682787237PDYt');
  if (!isDashboardUploadedFileCountAccessPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20037010,
        msg: myResultCode[20037010].msg,
      },
    }));
    return;
  }



  const fileWhereOpAndArray = [];
  const fileTodayWhereOpAndArray = [];

  const fileVersionWhereOpAndArray = [];
  const fileVersionWTodayhereOpAndArray = [];

  // console.log('isAllUserControl', isAllUserControl);
  if (!isAllUserControl) {
    const childUserKey = await db.FmsUsers.getChildAllUserKeys(loginInfo.userKey);

    // console.log('childUserKey', childUserKey);

    fileWhereOpAndArray.push({
      createrUserKey: {
        [Op.in]: childUserKey,
      },
    });
    fileTodayWhereOpAndArray.push({
      createrUserKey: {
        [Op.in]: childUserKey,
      },
    });

    fileVersionWhereOpAndArray.push({
      createrUserKey: {
        [Op.in]: childUserKey,
      },
    });
    fileVersionWTodayhereOpAndArray.push({
      createrUserKey: {
        [Op.in]: childUserKey,
      },
    });
  }


  fileTodayWhereOpAndArray.push({
    createdAt: {
      [Op.gte]: myDate().format('YYYY-MM-DD 00:00:00'),
    },
  });
  fileTodayWhereOpAndArray.push({
    createdAt: {
      [Op.lte]: myDate().format('YYYY-MM-DD 23:59:59'),
    },
  });

  fileVersionWTodayhereOpAndArray.push({
    createdAt: {
      [Op.gte]: myDate().format('YYYY-MM-DD 00:00:00'),
    },
  });
  fileVersionWTodayhereOpAndArray.push({
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
          code: 20037020,
          msg: myResultCode[20037020].msg,
        },
      }));
      return;
    }

    fileWhereOpAndArray.push({
      createdAt: {
        [Op.gte]: searchStartDatetime,
      },
    });

    fileVersionWhereOpAndArray.push({
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
          code: 20037030,
          msg: myResultCode[20037030].msg,
        },
      }));
      return;
    }

    fileWhereOpAndArray.push({
      createdAt: {
        [Op.lte]: searchEndDatetime,
      },
    });

    fileVersionWhereOpAndArray.push({
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
          code: 20037040,
          msg: myResultCode[20037040].msg,
        },
      }));
      return;
    }
  }


  // 해당하는 기간에 맞는 데이터 가져오기
  const fileResult = await db.FmsFiles.findAndCountAll({
    where: {
      [Op.and]: fileWhereOpAndArray,
      isDeletedRow: 'N',
    },
  });
  const fileTotalCount = fileResult.count;

  const fileVersionResult = await db.FmsFileVersions.findAndCountAll({
    where: {
      [Op.and]: fileVersionWhereOpAndArray,
      isDeletedRow: 'N',
    },
  });
  const fileVersionTotalCount = fileVersionResult.count;

  // 오늘 데이터 가져오기
  const fileTodayResult = await db.FmsFiles.findAndCountAll({
    where: {
      [Op.and]: fileTodayWhereOpAndArray,
      isDeletedRow: 'N',
    },
  });
  const fileTodayCount = fileTodayResult.count;

  const fileTodayVersionResult = await db.FmsFileVersions.findAndCountAll({
    where: {
      [Op.and]: fileVersionWTodayhereOpAndArray,
      isDeletedRow: 'N',
    },
  });
  const fileTodayVersionCount = fileTodayVersionResult.count;


  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      fileTotalCount: fileTotalCount,
      fileVersionTotalCount: fileVersionTotalCount,
      fileTodayCount: fileTodayCount,
      fileTodayVersionCount: fileTodayVersionCount,
    },
  }));
  return;
});

module.exports = getUploadedFileCount;
