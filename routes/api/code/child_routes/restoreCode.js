const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');

const restoreCode = wrapper(async(req, res, next) => {
  const {
    code, // 복구할(삭제취소할) 코드 (문자 또는 배열)
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
          code: 20003510,
          msg: myResultCode[20003510].msg,
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
          code: 20003520,
          msg: myResultCode[20003520].msg,
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
          code: 20003530,
          msg: myResultCode[20003530].msg,
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
            code: 20003540,
            msg: myResultCode[20003540].msg,
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
            code: 20003550,
            msg: myResultCode[20003550].msg,
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
            code: 20003560,
            msg: myResultCode[20003560].msg,
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
        code: 20003570,
        msg: myResultCode[20003570].msg,
      },
    }));
    return;
  }

  // 코드 데이터 복구 처리
  const updateResult = await db.FmsCodes.update({
    isDeletedRow: 'N',
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

module.exports = restoreCode;