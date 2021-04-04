const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');

const deleteCodeGroup = wrapper(async(req, res, next) => {
  const {
    codeGroup, // 삭제할 코드 그룹 (string 또는 string[])
  } = req.body;


  if (typeof codeGroup === 'string') {
    if (codeGroup.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20005010,
          msg: myResultCode[20005010].msg,
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
          code: 20005020,
          msg: myResultCode[20005020].msg,
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
          code: 20005030,
          msg: myResultCode[20005030].msg,
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
            code: 20005040,
            msg: myResultCode[20005040].msg,
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
            code: 20005050,
            msg: myResultCode[20005050].msg,
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
            code: 20005060,
            msg: myResultCode[20005060].msg,
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
        code: 20005070,
        msg: myResultCode[20005070].msg,
      },
    }));
    return;
  }

  
  // 코드 그룹 삭제 처리
  const deleteResult = await db.FmsCodeGroups.update({
    isDeletedRow: 'Y',
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

module.exports = deleteCodeGroup;