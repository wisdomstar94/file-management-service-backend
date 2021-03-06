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

const createUser = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  await db.insertLog({
    logType: 'LOGTY00000010', // 회원 생성 시도
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    // value1: JSON.stringify(userId),
    // value2: JSON.stringify(userPhone),
    // logContent: ``,
  });

  const isUserCreatePossible = await db.isActivePermission(loginInfo.userKey, 'F1619012225347uuKMhw');
  if (!isUserCreatePossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017009,
        msg: myResultCode[20017009].msg,
      },
    }));
    return;
  }

  const {
    companyKey,
    permissionGroupKey,
    userLevel,
    userId,
    userPassword,
    userName,
    userPhone,
    userMemo,
    userStatus,
  } = req.body;

  // companyKey 체크 : optional
  if (companyKey !== null && companyKey !== undefined && typeof companyKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017010,
        msg: myResultCode[20017010].msg,
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
          code: 20017020,
          msg: myResultCode[20017020].msg,
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
          code: 20017030,
          msg: myResultCode[20017030].msg,
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
          code: 20017040,
          msg: myResultCode[20017040].msg,
        },
      }));
      return;
    }
  }

  // permissionGroupKey 체크 : required
  if (typeof permissionGroupKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017050,
        msg: myResultCode[20017050].msg,
      },
    }));
    return;
  }

  if (permissionGroupKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017060,
        msg: myResultCode[20017060].msg,
      },
    }));
    return;
  }

  if (permissionGroupKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017070,
        msg: myResultCode[20017070].msg,
      },
    }));
    return;
  }

  const permissionGroupKeyResult = await db.FmsPermissionGroups.findOne({
    where: {
      permissionGroupKey: permissionGroupKey,
      isDeletedRow: 'N',
    },
  });
  if (permissionGroupKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017080,
        msg: myResultCode[20017080].msg,
      },
    }));
    return;
  }

  // userLevel 체크 : required 
  if (typeof userLevel !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017081,
        msg: myResultCode[20017081].msg,
      },
    }));
    return;
  }

  if (userLevel.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017082,
        msg: myResultCode[20017082].msg,
      },
    }));
    return;
  }

  if (userLevel.length !== 13) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017083,
        msg: myResultCode[20017083].msg,
      },
    }));
    return;
  }

  const userLevelCheck = await db.FmsCodes.isValidCode('USLEV', userLevel);
  if (!userLevelCheck) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017084,
        msg: myResultCode[20017084].msg,
      },
    }));
    return;
  }

  // userId 체크 : required
  if (typeof userId !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017090,
        msg: myResultCode[20017090].msg,
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
        code: 20017100,
        msg: myResultCode[20017100].msg,
      },
    }));
    return;
  }

  if (myRegularExpressCheck({ type: 'number_only', str: userId })) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017110,
        msg: myResultCode[20017110].msg,
      },
    }));
    return;
  }

  if (!myRegularExpressCheck({ type: 'english_number', str: userId })) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017120,
        msg: myResultCode[20017120].msg,
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
        code: 20017130,
        msg: myResultCode[20017130].msg,
      },
    }));
    return;
  }

  // userPassword 체크 : required
  if (typeof userPassword !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017140,
        msg: myResultCode[20017140].msg,
      },
    }));
    return;
  }

  if (userPassword.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017150,
        msg: myResultCode[20017150].msg,
      },
    }));
    return;
  }

  if (userPassword.length < 6) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017151,
        msg: myResultCode[20017151].msg,
      },
    }));
    return;
  }

  // userName 체크 : required
  if (typeof userName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017160,
        msg: myResultCode[20017160].msg,
      },
    }));
    return;
  }

  if (userName.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017170,
        msg: myResultCode[20017170].msg,
      },
    }));
    return;
  }

  if (userName.length > 50) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017180,
        msg: myResultCode[20017180].msg,
      },
    }));
    return;
  }

  // userPhone 체크 : optional
  if (userPhone !== null && userPhone !== undefined && typeof userPhone !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017190,
        msg: myResultCode[20017190].msg,
      },
    }));
    return;
  }

  if (typeof userPhone === 'string') {
    if (userPhone.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20017200,
          msg: myResultCode[20017200].msg,
        },
      }));
      return;
    }

    if (userPhone.length > 15) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20017210,
          msg: myResultCode[20017210].msg,
        },
      }));
      return;
    }
  }

  // userMemo 체크 : optional
  if (userMemo !== null && userMemo !== undefined && typeof userMemo !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017220,
        msg: myResultCode[20017220].msg,
      },
    }));
    return;
  }

  // userStatus 체크 : required
  if (typeof userStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017230,
        msg: myResultCode[20017230].msg,
      },
    }));
    return;
  }

  if (userStatus.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017240,
        msg: myResultCode[20017240].msg,
      },
    }));
    return;
  }

  if (userStatus.length !== 13) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017250,
        msg: myResultCode[20017250].msg,
      },
    }));
    return;
  }

  const userStatusResult = await db.FmsCodes.isValidCode('USRST', userStatus);
  if (!userStatusResult) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20017260,
        msg: myResultCode[20017260].msg,
      },
    }));
    return;
  }

  // 새로운 회원 생성
  const newUserKey = myGetMakeToken({ strlength: 20 });

  const create = {
    parentUserKey: loginInfo.userKey,
    userKey: newUserKey,
    companyKey: companyKey,
    permissionGroupKey: permissionGroupKey,
    userLevel: userLevel,
    userId: userId,
    userPassword: myCrypto.oneRootEncrypt({ originalValue: userPassword }),
    userName: userName,
    userPhone: userPhone,
    userMemo: userMemo,
    createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    createdIp: req.real_ip,
    userStatus: userStatus,
  };

  const createResult = await db.FmsUsers.create(create);

  await db.insertLog({
    logType: 'LOGTY00000011', // 회원 생성 성공
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    value1: JSON.stringify(userId),
    value2: JSON.stringify(newUserKey),
    logContent: `
      ※ 새롭게 생성된 회원 정보 : \`${JSON.stringify(create)}\`

      ※ 새롭게 생성된 회원 ID : value1 값 참조

      ※ 새롭게 생성된 회원 식별 키 : value2 값 참조
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

module.exports = createUser;