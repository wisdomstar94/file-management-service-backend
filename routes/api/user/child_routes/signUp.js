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

const signUp = wrapper(async(req, res, next) => {
  const {
    userId,
    userPassword,
    userName,
    userPhone,
  } = req.body;


  // userId 체크 : required
  if (typeof userId !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20035010,
        msg: myResultCode[20035010].msg,
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
        code: 20035020,
        msg: myResultCode[20035020].msg,
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
        code: 20035030,
        msg: myResultCode[20035030].msg,
      },
    }));
    return;
  }

  const userIdResult = await db.FmsUsers.findOne({
    where: {
      userId: userId,
    },
  });
  if (userIdResult !== null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20035035,
        msg: myResultCode[20035035].msg,
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
        code: 20035040,
        msg: myResultCode[20035040].msg,
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
        code: 20035050,
        msg: myResultCode[20035050].msg,
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
        code: 20035060,
        msg: myResultCode[20035060].msg,
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
        code: 20035070,
        msg: myResultCode[20035070].msg,
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
        code: 20035080,
        msg: myResultCode[20035080].msg,
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
        code: 20035090,
        msg: myResultCode[20035090].msg,
      },
    }));
    return;
  }

  // userPhone 체크 : required
  if (typeof userPhone !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20035100,
        msg: myResultCode[20035100].msg,
      },
    }));
    return;
  }

  if (userPhone.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20035110,
        msg: myResultCode[20035110].msg,
      },
    }));
    return;
  }

  if (isNaN(userPhone)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20035120,
        msg: myResultCode[20035120].msg,
      },
    }));
    return;
  }

  if (userPhone.length < 10) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20035130,
        msg: myResultCode[20035130].msg,
      },
    }));
    return;
  }


  // 새로운 회원 생성
  const newUserKey = myGetMakeToken({ strlength: 20 });

  const createResult = await db.FmsUsers.create({
    userKey: newUserKey,
    companyKey: null,
    permissionGroupKey: 'n1617928953612VCcOnS',
    userLevel: 'USLEV00000002',
    userId: userId,
    userPassword: myCrypto.oneRootEncrypt({ originalValue: userPassword }),
    userName: userName,
    userPhone: userPhone,
    userMemo: null,
    createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    createdIp: req.real_ip,
    userStatus: 'USRST00000001',
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

module.exports = signUp;