const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');

const restoreCodeGroup = wrapper(async(req, res, next) => {
  const {
    codeGroup, // 복구할 코드 그룹 (문자열 또는 배열)
  } = req.body;


  if (typeof codeGroup === 'string') {
    if (codeGroup.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20005510,
          msg: myResultCode[20005510].msg,
        },
      }));
      return;
    }

    if (codeGroup.length !== 5) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20005520,
          msg: myResultCode[20005520].msg,
        },
      }));
      return;
    }
  } else if (Array.isArray(codeGroup)) {
    if (codeGroup.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20005530,
          msg: myResultCode[20005530].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < codeGroup.length; i++) {
      if (typeof codeGroup[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20005540,
            msg: myResultCode[20005540].msg,
          },
        }));
        return;
      }

      if (codeGroup[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20005550,
            msg: myResultCode[20005550].msg,
          },
        }));
        return;
      }

      if (codeGroup[i].length !== 5) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20005560,
            msg: myResultCode[20005560].msg,
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
        code: 20005570,
        msg: myResultCode[20005570].msg,
      },
    }));
    return;
  }

  
  // 코드 그룹 복구 처리
  const updateResult = await db.FmsCodeGroups.update({
    isDeletedRow: 'N',
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    where: {
      codeGroup: codeGroup,
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

module.exports = restoreCodeGroup;