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

const deleteUser = wrapper(async(req, res, next) => {
  const {
    userKey, // string 또는 string[]
  } = req.body;

  // userKey 체크 : required
  if (typeof userKey !== 'string' && !Array.isArray(userKey)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20019510,
        msg: myResultCode[20019510].msg,
      },
    }));
    return;
  }

  if (typeof userKey === 'string') {
    if (userKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20019520,
          msg: myResultCode[20019520].msg,
        },
      }));
      return;
    }

    if (userKey.length !== 20) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20019530,
          msg: myResultCode[20019530].msg,
        },
      }));
      return;
    }
  }

  if (Array.isArray(userKey)) {
    if (userKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20019540,
          msg: myResultCode[20019540].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < userKey.length; i++) {
      if (typeof userKey[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20019550,
            msg: myResultCode[20019550].msg,
          },
        }));
        return;
      }

      if (userKey[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20019560,
            msg: myResultCode[20019560].msg,
          },
        }));
        return;
      }

      if (userKey[i].length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20019570,
            msg: myResultCode[20019570].msg,
          },
        }));
        return;
      }
    }
  }

  // 회원 정보 삭제 처리
  const modifyResult = await db.FmsUsers.update({
    isDeletedRow: 'Y',
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    updatedIp: req.real_ip,
  }, {
    where: {
      userKey: userKey,
    },
  });

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
    },
  }));
  return;
});

module.exports = deleteUser;