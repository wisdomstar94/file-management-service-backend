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

const restoreCompany = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  
  const {
    companyKey, // string 또는 string[]
  } = req.body;

  // companyKey 체크 : required
  if (typeof companyKey !== 'string' && !Array.isArray(companyKey)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20022510,
        msg: myResultCode[20022510].msg,
      },
    }));
    return;
  }

  if (typeof companyKey === 'string') {
    if (companyKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20022520,
          msg: myResultCode[20022520].msg,
        },
      }));
      return;
    }

    if (companyKey.length !== 20) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20022530,
          msg: myResultCode[20022530].msg,
        },
      }));
      return;
    }

    const companyKeyResult = await db.FmsCompanys.findOne({
      where: {
        companyKey: companyKey,
      },
    });
    if (companyKeyResult === null) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20022540,
          msg: myResultCode[20022540].msg,
        },
      }));
      return;
    }
    if (companyKeyResult.isDeletedRow === 'N') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20022550,
          msg: myResultCode[20022550].msg,
        },
      }));
      return;
    }
  }

  if (Array.isArray(companyKey)) {
    if (companyKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20022560,
          msg: myResultCode[20022560].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < companyKey.length; i++) {
      if (typeof companyKey[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20022570,
            msg: myResultCode[20022570].msg,
          },
        }));
        return;
      }

      if (companyKey[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20022580,
            msg: myResultCode[20022580].msg,
          },
        }));
        return;
      }

      if (companyKey[i].length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20022590,
            msg: myResultCode[20022590].msg,
          },
        }));
        return;
      }
    }

    const companyKeysResult = await db.FmsCompanys.findAndCountAll({
      where: {
        companyKey: {
          [Op.in]: companyKey,
        },
        isDeletedRow: 'Y',
      },
    });
    if (companyKeysResult.count !== companyKey.length) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20022600,
          msg: myResultCode[20022600].msg,
        },
      }));
      return;
    }
  }
  
  // 회사 정보 업데이트
  const modifyResult = await db.FmsCompanys.update({
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    updatedIp: req.real_ip,
    updaterUserKey: loginInfo.userKey,
    isDeletedRow: 'N',
  }, {
    where: {
      companyKey: companyKey,
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

module.exports = restoreCompany;