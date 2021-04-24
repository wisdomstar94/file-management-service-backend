const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myCrypto = require('../../../librarys/myCrypto');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');
const myBoard = require('../../../librarys/myBoard');
const myRegularExpressCheck = require('../../../librarys/myRegularExpressCheck');
const { Op, Sequelize } = require('sequelize');

const idDuplicateCheck = wrapper(async(req, res, next) => {
  const {
    userId,
  } = req.body;

  // userId 체크 : required
  if (typeof userId !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20034010,
        msg: myResultCode[20034010].msg,
      },
    }));
    return;
  }

  if (userId.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20034020,
        msg: myResultCode[20034020].msg,
      },
    }));
    return;
  }

  if (userId.length > 50) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20034030,
        msg: myResultCode[20034030].msg,
      },
    }));
    return;
  }


  const userIdResult = await db.FmsUsers.findOne({
    where: {
      userId: userId,
    },
  });

  let isDuplicate = true;

  if (userIdResult === null) {
    isDuplicate = false;
  }


  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      isDuplicate: isDuplicate,
    },
  }));
  return;
});

module.exports = idDuplicateCheck;