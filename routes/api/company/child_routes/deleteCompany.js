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

const deleteCompany = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  const isCompanyDeletePossible = await db.isActivePermission(loginInfo.userKey, 'FJIyt1617685724474xG');
  if (!isCompanyDeletePossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20022009,
        msg: myResultCode[20022009].msg,
      },
    }));
    return;
  }


  
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
        code: 20022010,
        msg: myResultCode[20022010].msg,
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
          code: 20022020,
          msg: myResultCode[20022020].msg,
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
          code: 20022030,
          msg: myResultCode[20022030].msg,
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
          code: 20022040,
          msg: myResultCode[20022040].msg,
        },
      }));
      return;
    }
    if (companyKeyResult.isDeletedRow === 'Y') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20022050,
          msg: myResultCode[20022050].msg,
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
          code: 20022060,
          msg: myResultCode[20022060].msg,
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
            code: 20022070,
            msg: myResultCode[20022070].msg,
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
            code: 20022080,
            msg: myResultCode[20022080].msg,
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
            code: 20022090,
            msg: myResultCode[20022090].msg,
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
        isDeletedRow: 'N',
      },
    });
    if (companyKeysResult.count !== companyKey.length) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20022100,
          msg: myResultCode[20022100].msg,
        },
      }));
      return;
    }
  }
  
  // 회사 정보 업데이트
  const modifyResult = await db.FmsCompanys.update({
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    updatedIp: req.real_ip,
    // updaterUserKey: loginInfo.userKey,
    isDeletedRow: 'Y',
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

module.exports = deleteCompany;