const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
const myCrypto = require('../librarys/myCrypto');
const myLogger = require('../librarys/myLogger');
const myValueLog = require('../librarys/myValueLog');
const myResultCode = require('../librarys/myResultCode');
const db = require('../../models');
require('dotenv').config();

const jwtTokenCheck = async(req, res, next) => {
  const accessToken = req.cookies.accesstoken;
  const refreshToken = req.cookies.refreshtoken;

  // accessToken 검증
  let isAccessTokenValid = false;
  try {
    req.accessTokenDecoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    isAccessTokenValid = true;
  } catch (e) {
    isAccessTokenValid = false;
  }

  // accessToken이 유효하지 않으면
  if (!isAccessTokenValid) {
    // refreshToken 검증
    let isRefreshTokenValid = false;
    try {
      req.refreshTokenDecoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      isRefreshTokenValid = true;
    } catch (e) {
      isRefreshTokenValid = false;
    }

    // refreshToken이 유효하지 않으면
    if (!isRefreshTokenValid) {
      res.status(401).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20001010,
          msg: myResultCode[20001010].msg,
        },
      }));
      return;
    }

    // refreshToken이 유효하면 refreshToken 안에 있는 jwtRefreshTokenKey 가 유효한 Key인지 DB에서 조회하기
    const jwtRefreshTokenKey = myCrypto.decrypt({ hashedValue: req.refreshTokenDecoded.a });

    // refreshToken 안에 있는 jwtRefreshTokenKey 가 문자열이 아니면 막기
    if (typeof jwtRefreshTokenKey !== 'string') {
      res.status(401).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20001011,
          msg: myResultCode[20001011].msg,
        },
      }));
      return;
    }

    const jwtRefreshTokenKeyInfo = await db.FmsJwtRefreshTokens.getKeyInfo(jwtRefreshTokenKey);
    // 조회된 내용이 없으면 막기
    if (jwtRefreshTokenKeyInfo === null) {
      res.status(401).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20001012,
          msg: myResultCode[20001012].msg,
        },
      }));
      return;
    }

    // 유효한 jwtRefreshTokenKey 이면
    // 회원 정보 조회
    const findedUserInfo = await db.FmsUsers.findUserKey(jwtRefreshTokenKeyInfo.userKey);

    // 조회된 회원 정보가 없으면 막기
    if (findedUserInfo === null) {
      res.status(401).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20001013,
          msg: myResultCode[20001013].msg,
        },
      }));
      return;
    }

    // 조회된 회원 정보가 있으면
    // accessToken 재발급
    const newAccessToken = jwt.sign({
      a: myCrypto.encrypt({ originalValue: findedUserInfo.userKey }), // 회원키
      b: myCrypto.encrypt({ originalValue: findedUserInfo.userId }), // 회원 아이디
      c: myCrypto.encrypt({ originalValue: findedUserInfo.userName }),  // 회원명
      d: myCrypto.encrypt({ originalValue: req.real_ip }) // 로그인 할때의 IP
    }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_MINUTE, 
      issuer: process.env.PROJECT_NAME,
    });

    res.cookie('accesstoken', newAccessToken, { expires: new Date(Date.now() + 600000), httpOnly: true });

    res.status(401).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20001014,
        msg: myResultCode[20001014].msg,
        // newAccessToken: newAccessToken,
      },
    }));
    return;
  }

  // accessToken이 유효하면
  req.loginInfo = {};
  req.loginInfo.userKey = myCrypto.decrypt({ hashedValue: req.accessTokenDecoded.a });
  req.loginInfo.userId = myCrypto.decrypt({ hashedValue: req.accessTokenDecoded.b });
  req.loginInfo.userName = myCrypto.decrypt({ hashedValue: req.accessTokenDecoded.c });
  req.loginInfo.ip = myCrypto.decrypt({ hashedValue: req.accessTokenDecoded.d });
  next();
};

module.exports = jwtTokenCheck;
