const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');

const getCode = wrapper(async(req, res, next) => {
  const {
    codeGroup, // 조회할 코드그룹 (문자열 또는 배열)
  } = req.body;

  if (typeof codeGroup === 'string') {
    if (codeGroup.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20004010,
          msg: myResultCode[20004010].msg,
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
          code: 20004020,
          msg: myResultCode[20004020].msg,
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
          code: 20004030,
          msg: myResultCode[20004030].msg,
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
            code: 20004040,
            msg: myResultCode[20004040].msg,
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
            code: 20004050,
            msg: myResultCode[20004050].msg,
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
            code: 20004060,
            msg: myResultCode[20004060].msg,
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
        code: 20004070,
        msg: myResultCode[20004070].msg,
      },
    }));
    return;
  }

  
  // 조회
  const list = await db.FmsCodes.findAll({
    attributes: [
      'seq', 'codeGroup', 'code', 'codeName', 'codeDescription', 'codeValue1', 'codeValue2', 'sortNo', 
      [db.Sequelize.fn('date_format', db.Sequelize.col('FmsCodes.createdAt'), '%Y-%m-%d %H:%i:%s'), 'createdAt'], 'updatedAt',
    ],
    where: {
      codeGroup: codeGroup,
      isDeletedRow: 'N',
    },
    order: [
      ['codeGroup', 'ASC'],
      ['sortNo', 'ASC'],
      ['createdAt', 'ASC'],
    ],
    include: [
      {
        model: db.FmsCodeGroups,
        attributes: ['codeGroupName'],
      },
    ],
  });

  
  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      list: list,
    },
  }));
  return;
});

module.exports = getCode;