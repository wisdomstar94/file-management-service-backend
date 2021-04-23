const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');

const deleteCode = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  if (loginInfo.userLevel !== 'USLEV00000001') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20003009,
        msg: myResultCode[20003009].msg,
      },
    }));
    return;
  }


  const {
    code, // 삭제할 코드 (문자 또는 배열)
  } = req.body;

  // code 유효성 검사
  if (typeof code === 'string') {
    // 문자열인 경우
    if (code.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20003010,
          msg: myResultCode[20003010].msg,
        },
      }));
      return;
    }

    if (code.length !== 13) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20003020,
          msg: myResultCode[20003020].msg,
        },
      }));
      return;
    }
  } else if (Array.isArray(code)) {
    // 배열인 경우
    if (code.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20003030,
          msg: myResultCode[20003030].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < code.length; i++) {
      if (typeof code[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20003040,
            msg: myResultCode[20003040].msg,
          },
        }));
        return;
      }

      if (code[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20003050,
            msg: myResultCode[20003050].msg,
          },
        }));
        return;
      }

      if (code[i].length !== 13) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20003060,
            msg: myResultCode[20003060].msg,
          },
        }));
        return;
      }
    }
  } else {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20003070,
        msg: myResultCode[20003070].msg,
      },
    }));
    return;
  }

  // 코드 데이터 삭제 처리
  const updateResult = await db.FmsCodes.update({
    isDeletedRow: 'Y',
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    where: {
      code: code,
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

module.exports = deleteCode;