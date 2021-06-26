const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myCrypto = require('../../../librarys/myCrypto');
const myLogger = require('../../../librarys/myLogger');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');
const myBoard = require('../../../librarys/myBoard');
const myRegularExpressCheck = require('../../../librarys/myRegularExpressCheck');
const { Op, Sequelize } = require('sequelize');

const createCompany = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  await db.insertLog({
    logType: 'LOGTY00000029', // 회사 등록 시도
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    // value1: JSON.stringify(userId),
    // value2: JSON.stringify(userPhone),
    // logContent: ``,
  }); 

  const isCompanyCreatePossible = await db.isActivePermission(loginInfo.userKey, 'UY1619153982779QIVRq');
  if (!isCompanyCreatePossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20020509,
        msg: myResultCode[20020509].msg,
      },
    }));
    return;
  }

  
  const {
    companyName,
    companyCEOName,
    companyCEOTel,
    companyTel,
    companyBusinessNumber,
    companyAddress,
    memo,
    companyStatus,
  } = req.body;

  // companyName 체크 : required
  if (typeof companyName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20020510,
        msg: myResultCode[20020510].msg,
      },
    }));
    return;
  }

  if (companyName.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20020520,
        msg: myResultCode[20020520].msg,
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
        code: 20020530,
        msg: myResultCode[20020530].msg,
      },
    }));
    return;
  }

  // companyCEOName 체크 : optional
  if (companyCEOName !== null && companyCEOName !== undefined && typeof companyCEOName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20020540,
        msg: myResultCode[20020540].msg,
      },
    }));
    return;
  }

  if (typeof companyCEOName === 'string') {
    if (companyCEOName.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20020550,
          msg: myResultCode[20020550].msg,
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
          code: 20020560,
          msg: myResultCode[20020560].msg,
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
        code: 20020570,
        msg: myResultCode[20020570].msg,
      },
    }));
    return;
  }

  if (typeof companyCEOTel === 'string') {
    if (companyCEOTel.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20020580,
          msg: myResultCode[20020580].msg,
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
          code: 20020590,
          msg: myResultCode[20020590].msg,
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
        code: 20020600,
        msg: myResultCode[20020600].msg,
      },
    }));
    return;
  }

  if (typeof companyTel === 'string') {
    if (companyTel.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20020610,
          msg: myResultCode[20020610].msg,
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
          code: 20020620,
          msg: myResultCode[20020620].msg,
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
        code: 20020630,
        msg: myResultCode[20020630].msg,
      },
    }));
    return;
  }

  if (typeof companyBusinessNumber === 'string') {
    if (companyBusinessNumber.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20020640,
          msg: myResultCode[20020640].msg,
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
          code: 20020650,
          msg: myResultCode[20020650].msg,
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
        code: 20020660,
        msg: myResultCode[20020660].msg,
      },
    }));
    return;
  }

  if (typeof companyAddress === 'string') {
    if (companyAddress.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20020670,
          msg: myResultCode[20020670].msg,
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
          code: 20020680,
          msg: myResultCode[20020680].msg,
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
        code: 20020690,
        msg: myResultCode[20020690].msg,
      },
    }));
    return;
  }

  if (typeof memo === 'string') {
    if (memo.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20020700,
          msg: myResultCode[20020700].msg,
        },
      }));
      return;
    }
  }

  // companyStatus 체크 : required
  if (typeof companyStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20020710,
        msg: myResultCode[20020710].msg,
      },
    }));
    return;
  }

  if (companyStatus.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20020720,
        msg: myResultCode[20020720].msg,
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
        code: 20020730,
        msg: myResultCode[20020730].msg,
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
        code: 20020740,
        msg: myResultCode[20020740].msg,
      },
    }));
    return;
  }

  // 트랜잭션 시작
  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');

  // 새로운 회사 생성
  const newCompanyKey = myGetMakeToken({ strlength: 20 });

  const create = {
    companyKey: newCompanyKey,
    companyName: companyName,
    companyCEOName: companyCEOName,
    companyCEOTel: companyCEOTel,
    companyTel: companyTel,
    companyBusinessNumber: companyBusinessNumber,
    companyAddress: companyAddress,
    memo: memo,
    createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    createdIp: req.real_ip,
    // createrUserKey: loginInfo.userKey,
    companyStatus: companyStatus,
  };

  try {
    const createResult = await db.FmsCompanys.create(create, {
      transaction: transaction,
    });

    await db.FmsCompanyInfos.create({
      companyInfoKey: myGetMakeToken({ strlength: 20 }),
      companyKey: newCompanyKey,
      createrUserKey: loginInfo.userKey,
    }, {
      transaction: transaction,
    });

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    myLogger.info(req.logHeadTail + 'transaction rollback..!');
    myLogger.error(req.logHeadTail + 'e.stack => ' + e.stack);
    myLogger.error(req.logHeadTail + 'e => ' + JSON.stringify(e));

    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20020750,
        msg: myResultCode[20020750].msg,
      },
    }));
    return;
  }

  await db.insertLog({
    logType: 'LOGTY00000030', // 회사 등록 성공
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    value1: JSON.stringify(newCompanyKey),
    // value2: JSON.stringify(userPhone),
    logContent: `
      ※ 신규 회사 식별키 : value1 값 참조

      ※ 신규 회사 정보 : \`${JSON.stringify(create)}\`
    `,
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

module.exports = createCompany;