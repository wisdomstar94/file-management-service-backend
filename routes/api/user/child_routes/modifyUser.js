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

const modifyUser = wrapper(async(req, res, next) => {
  const {
    userKey, // string 또는 string[]
    companyKey,
    permissionGroupKey,
    userLevel,
    // userId,
    userPassword,
    userName,
    userPhone,
    userMemo,
    userStatus,
  } = req.body;

  // userKey 체크 : required
  if (typeof userKey !== 'string' && !Array.isArray(userKey)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20018510,
        msg: myResultCode[20018510].msg,
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
          code: 20018520,
          msg: myResultCode[20018520].msg,
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
          code: 20018530,
          msg: myResultCode[20018530].msg,
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
          code: 20018540,
          msg: myResultCode[20018540].msg,
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
            code: 20018550,
            msg: myResultCode[20018550].msg,
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
            code: 20018560,
            msg: myResultCode[20018560].msg,
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
            code: 20018570,
            msg: myResultCode[20018570].msg,
          },
        }));
        return;
      }
    }
  }

  // companyKey 체크 : optional
  if (companyKey !== null && companyKey !== undefined && typeof companyKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20018580,
        msg: myResultCode[20018580].msg,
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
          code: 20018590,
          msg: myResultCode[20018590].msg,
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
          code: 20018600,
          msg: myResultCode[20018600].msg,
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
          code: 20018610,
          msg: myResultCode[20018610].msg,
        },
      }));
      return;
    }
  }

  // permissionGroupKey 체크
  if (permissionGroupKey !== undefined && typeof permissionGroupKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20018620,
        msg: myResultCode[20018620].msg,
      },
    }));
    return;
  }

  if (typeof permissionGroupKey === 'string') {
    if (permissionGroupKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20018630,
          msg: myResultCode[20018630].msg,
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
          code: 20018640,
          msg: myResultCode[20018640].msg,
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
          code: 20018650,
          msg: myResultCode[20018650].msg,
        },
      }));
      return;
    }
  }

  // userLevel 체크 : optional
  if (userLevel !== undefined && typeof userLevel !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20018651,
        msg: myResultCode[20018651].msg,
      },
    }));
    return;
  }

  if (typeof userLevel === 'string') {
    if (userLevel.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20018652,
          msg: myResultCode[20018652].msg,
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
          code: 20018653,
          msg: myResultCode[20018653].msg,
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
          code: 20018654,
          msg: myResultCode[20018654].msg,
        },
      }));
      return;
    }
  }

  // userPassword 체크 : optional
  if (userPassword !== undefined && typeof userPassword !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20018660,
        msg: myResultCode[20018660].msg,
      },
    }));
    return;
  }

  if (typeof userPassword === 'string') {
    if (userPassword.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20018670,
          msg: myResultCode[20018670].msg,
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
          code: 20018680,
          msg: myResultCode[20018680].msg,
        },
      }));
      return;
    }
  }

  // userName 체크 : optional
  if (userName !== undefined && typeof userName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20018690,
        msg: myResultCode[20018690].msg,
      },
    }));
    return;
  }

  if (typeof userName === 'string') {
    if (userName.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20018700,
          msg: myResultCode[20018700].msg,
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
          code: 20018710,
          msg: myResultCode[20018710].msg,
        },
      }));
      return;
    }
  }

  // userPhone 체크 : optional
  if (userPhone !== null && userPhone !== undefined && typeof userPhone !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20018720,
        msg: myResultCode[20018720].msg,
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
          code: 20018730,
          msg: myResultCode[20018730].msg,
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
          code: 20018740,
          msg: myResultCode[20018740].msg,
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
        code: 20018750,
        msg: myResultCode[20018750].msg,
      },
    }));
    return;
  }

  // userStatus 체크 : optional
  if (userStatus !== undefined && typeof userStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20018760,
        msg: myResultCode[20018760].msg,
      },
    }));
    return;
  }

  if (typeof userStatus === 'string') {
    if (userStatus.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20018770,
          msg: myResultCode[20018770].msg,
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
          code: 20018780,
          msg: myResultCode[20018780].msg,
        },
      }));
      return;
    }

    const userStatusCheck = await db.FmsCodes.isValidCode('USRST', userStatus);
    if (!userStatusCheck) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20018790,
          msg: myResultCode[20018790].msg,
        },
      }));
      return;
    }
  }

  // 회원 정보 업데이트
  const modifyResult = await db.FmsUsers.update({
    companyKey: companyKey,
    permissionGroupKey: permissionGroupKey,
    userLevel: userLevel,
    userPassword: userPassword === undefined ? userPassword : myCrypto.oneRootEncrypt({ originalValue: userPassword }),
    userName: userName,
    userPhone: userPhone,
    userMemo: userMemo,
    userStatus: userStatus,
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

module.exports = modifyUser;