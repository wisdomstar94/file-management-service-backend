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

const modifyCompany = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  const isCompanyAllModifyPossible = await db.isActivePermission(loginInfo.userKey, 'kuRI1617685328685PCL');

  
  const {
    companyKey, // string 또는 string[]
    companyName,
    companyCEOName,
    companyCEOTel,
    companyTel,
    companyBusinessNumber,
    companyAddress,
    memo,
    companyStatus,
  } = req.body;

  // companyKey 체크 : required
  if (typeof companyKey !== 'string' && !Array.isArray(companyKey)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20021010,
        msg: myResultCode[20021010].msg,
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
          code: 20021020,
          msg: myResultCode[20021020].msg,
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
          code: 20021030,
          msg: myResultCode[20021030].msg,
        },
      }));
      return;
    }

    const companyKeyResult = await db.FmsCompanys.findOne({
      where: {
        companyKey: companyKey,
        isDeletedRow: 'N',
      },
    });
    if (companyKeyResult === null) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021040,
          msg: myResultCode[20021040].msg,
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
          code: 20021050,
          msg: myResultCode[20021050].msg,
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
            code: 20021060,
            msg: myResultCode[20021060].msg,
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
            code: 20021070,
            msg: myResultCode[20021070].msg,
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
            code: 20021080,
            msg: myResultCode[20021080].msg,
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
          code: 20021090,
          msg: myResultCode[20021090].msg,
        },
      }));
      return;
    }
  }

  // companyName 체크 : optional
  if (companyName !== undefined && typeof companyName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20021100,
        msg: myResultCode[20021100].msg,
      },
    }));
    return;
  }

  if (typeof companyName === 'string') {
    if (!isCompanyAllModifyPossible) {
      const isCompanyNameModifyPossible = await db.isActivePermission(loginInfo.userKey, 'zXw1617685347777EzGZ');
      if (!isCompanyNameModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20021109,
            msg: myResultCode[20021109].msg,
          },
        }));
        return;
      }
    }

    if (companyName.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021110,
          msg: myResultCode[20021110].msg,
        },
      }));
      return;
    }

    if (companyName.length > 100) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021120,
          msg: myResultCode[20021120].msg,
        },
      }));
      return;
    }
  }

  // companyCEOName 체크 : optional
  if (companyCEOName !== null && companyCEOName !== undefined && typeof companyCEOName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20021130,
        msg: myResultCode[20021130].msg,
      },
    }));
    return;
  }

  if (typeof companyCEOName === 'string') {
    if (!isCompanyAllModifyPossible) {
      const isCompanyCEONameModifyPossible = await db.isActivePermission(loginInfo.userKey, 'pi1617685629576AENpM');
      if (!isCompanyCEONameModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20021139,
            msg: myResultCode[20021139].msg,
          },
        }));
        return;
      }
    }

    if (companyCEOName.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021140,
          msg: myResultCode[20021140].msg,
        },
      }));
      return;
    }
    
    if (companyCEOName.length > 100) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021150,
          msg: myResultCode[20021150].msg,
        },
      }));
      return;
    }
  }

  // companyCEOTel 체크 : optional
  if (companyCEOTel !== null && companyCEOTel !== undefined && typeof companyCEOTel !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20021160,
        msg: myResultCode[20021160].msg,
      },
    }));
    return;
  }

  if (typeof companyCEOTel === 'string') {
    if (!isCompanyAllModifyPossible) {
      const isCompanyCEOTelModifyPossible = await db.isActivePermission(loginInfo.userKey, 'n1617685645747YeYsgZ');
      if (!isCompanyCEOTelModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20021169,
            msg: myResultCode[20021169].msg,
          },
        }));
        return;
      }
    }

    if (companyCEOTel.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021170,
          msg: myResultCode[20021170].msg,
        },
      }));
      return;
    }
    
    if (companyCEOTel.length > 15) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021180,
          msg: myResultCode[20021180].msg,
        },
      }));
      return;
    }
  }

  // companyTel 체크 : optional
  if (companyTel !== null && companyTel !== undefined && typeof companyTel !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20021190,
        msg: myResultCode[20021190].msg,
      },
    }));
    return;
  }

  if (typeof companyTel === 'string') {
    if (!isCompanyAllModifyPossible) {
      const isCompanyTelModifyPossible = await db.isActivePermission(loginInfo.userKey, 'picDYTK1617685662336');
      if (!isCompanyTelModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20021199,
            msg: myResultCode[20021199].msg,
          },
        }));
        return;
      }
    }

    if (companyTel.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021200,
          msg: myResultCode[20021200].msg,
        },
      }));
      return;
    }

    if (companyTel.length > 15) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021210,
          msg: myResultCode[20021210].msg,
        },
      }));
      return;
    }
  }

  // companyBusinessNumber 체크 : optional
  if (companyBusinessNumber !== null && companyBusinessNumber !== undefined && typeof companyBusinessNumber !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20021220,
        msg: myResultCode[20021220].msg,
      },
    }));
    return;
  }

  if (typeof companyBusinessNumber === 'string') {
    if (!isCompanyAllModifyPossible) {
      const isCompanyAABAModifyPossible = await db.isActivePermission(loginInfo.userKey, 'aaaaaaaaa');
      if (!isCompanyAABAModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20021229,
            msg: myResultCode[20021229].msg,
          },
        }));
        return;
      }
    }

    if (companyBusinessNumber.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021230,
          msg: myResultCode[20021230].msg,
        },
      }));
      return;
    }

    if (companyBusinessNumber.length > 15) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021240,
          msg: myResultCode[20021240].msg,
        },
      }));
      return;
    }
  }
  
  // companyAddress 체크 : optional
  if (companyAddress !== null && companyAddress !== undefined && typeof companyAddress !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20021250,
        msg: myResultCode[20021250].msg,
      },
    }));
    return;
  }

  if (typeof companyAddress === 'string') {
    if (!isCompanyAllModifyPossible) {
      const isCompanyAddressModifyPossible = await db.isActivePermission(loginInfo.userKey, 'J1617685612715KKtEoM');
      if (!isCompanyAddressModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20021259,
            msg: myResultCode[20021259].msg,
          },
        }));
        return;
      }
    }

    if (companyAddress.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021260,
          msg: myResultCode[20021260].msg,
        },
      }));
      return;
    }

    if (companyAddress.length > 150) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021270,
          msg: myResultCode[20021270].msg,
        },
      }));
      return;
    }
  }
  
  // memo 체크 : optional
  if (memo !== null && memo !== undefined && typeof memo !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20021280,
        msg: myResultCode[20021280].msg,
      },
    }));
    return;
  }

  if (typeof memo === 'string' || memo === null) {
    if (!isCompanyAllModifyPossible) {
      const isCompanyMemoModifyPossible = await db.isActivePermission(loginInfo.userKey, 'FsLLW1617685677061iv');
      if (!isCompanyMemoModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20021289,
            msg: myResultCode[20021289].msg,
          },
        }));
        return;
      }
    }
  }

  if (typeof memo === 'string') {
    if (memo.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021290,
          msg: myResultCode[20021290].msg,
        },
      }));
      return;
    }
  }

  // companyStatus 체크 : optional
  if (companyStatus !== undefined && typeof companyStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20021300,
        msg: myResultCode[20021300].msg,
      },
    }));
    return;
  }

  if (typeof companyStatus === 'string') {
    if (!isCompanyAllModifyPossible) {
      const isCompanyStatusModifyPossible = await db.isActivePermission(loginInfo.userKey, 'wbi1617685695068SGzA');
      if (!isCompanyStatusModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20021309,
            msg: myResultCode[20021309].msg,
          },
        }));
        return;
      }
    }

    if (companyStatus.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021310,
          msg: myResultCode[20021310].msg,
        },
      }));
      return;
    }

    if (companyStatus.length !== 13) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021320,
          msg: myResultCode[20021320].msg,
        },
      }));
      return;
    }

    const companyStatusCheck = await db.FmsCodes.isValidCode('CMPST', companyStatus);
    if (!companyStatusCheck) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20021330,
          msg: myResultCode[20021330].msg,
        },
      }));
      return;
    }
  }
  
  // 회사 정보 업데이트
  const modifyResult = await db.FmsCompanys.update({
    companyName: companyName,
    companyCEOName: companyCEOName,
    companyCEOTel: companyCEOTel,
    companyTel: companyTel,
    companyBusinessNumber: companyBusinessNumber,
    companyAddress: companyAddress,
    memo: memo,
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    updatedIp: req.real_ip,
    // updaterUserKey: loginInfo.userKey,
    companyStatus: companyStatus,
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

module.exports = modifyCompany;