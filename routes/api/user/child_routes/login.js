const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const jwt = require('jsonwebtoken');
const myCrypto = require('../../../librarys/myCrypto');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');
const myBoard = require('../../../librarys/myBoard');
const myRegularExpressCheck = require('../../../librarys/myRegularExpressCheck');
const { Op, Sequelize } = require('sequelize');
require('dotenv').config();

const login = wrapper(async(req, res, next) => {
  const {
    userId,
    userPassword,
  } = req.body;

  // userId 체크 : required
  if (typeof userId !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20018010,
        msg: myResultCode[20018010].msg,
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
        code: 20018020,
        msg: myResultCode[20018020].msg,
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
        code: 20018030,
        msg: myResultCode[20018030].msg,
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
        code: 20018040,
        msg: myResultCode[20018040].msg,
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
        code: 20018050,
        msg: myResultCode[20018050].msg,
      },
    }));
    return;
  }

  // user check
  const userInfo = await db.FmsUsers.findOne({
    where: {
      userId: userId,
      userPassword: myCrypto.oneRootEncrypt({ originalValue: userPassword }),
      isDeletedRow: 'N',
    },
    include: [
      {
        model: db.FmsCodes,
      },
    ],
  });
  
  if (userInfo === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20018060,
        msg: myResultCode[20018060].msg,
      },
    }));
    return;
  }

  if (userInfo.userStatus !== 'USRST00000001') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20018070,
        msg: myResultCode[20018070].msg,
      },
    }));
    return;
  }

  // create access token
  const newAccessToken = jwt.sign({
    a: myCrypto.encrypt({ originalValue: userInfo.userKey }), // 회원키
    b: myCrypto.encrypt({ originalValue: userInfo.userId }), // 회원 아이디
    c: myCrypto.encrypt({ originalValue: userInfo.userName }),  // 회원명
    d: myCrypto.encrypt({ originalValue: req.real_ip }) // 로그인 할때의 IP
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_MINUTE, 
    issuer: process.env.PROJECT_NAME,
  });

  // create refresh toekn
  const newJwtRefreshTokenKey = myGetMakeToken({ strlength: 20 });
  const newRefreshToken = jwt.sign({
    a: myCrypto.encrypt({ originalValue: newJwtRefreshTokenKey }), // jwt refresh token key
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE_MINUTE, 
    issuer: process.env.PROJECT_NAME,
  });

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  }));
  return;
});

module.exports = login;