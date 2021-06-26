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

const yyyymmList = wrapper(async(req, res, next) => {
  const result = await db.sequelize.query(`
      SHOW TABLES LIKE 'FmsFileDownloadLogs%';
    `, { 
      // replacements: addWhereValues,
      type: QueryTypes.SELECT, 
    },
  );

  console.log('result', result);

  const yyymmList = [];
    
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
    const tableName = item[Object.keys(item)[0]];
    const onlyYYYYMM = tableName.replace('FmsFileDownloadLogs', '');

    if (onlyYYYYMM === 'YYYYMM') {
      continue;
    }

    yyymmList.unshift(onlyYYYYMM);
  }

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      list: yyymmList,
    },
  }));
  return;
});

module.exports = yyyymmList;
