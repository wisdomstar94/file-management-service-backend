const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');

const createCode = wrapper(async(req, res, next) => {
  const {
    codeGroup,
    code,
    codeName,
    codeDescription,
    codeValue1,
    codeValue2,
    sortNo,
  } = req.body;

  // codeGroup 유효성 검사
  if (typeof codeGroup !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002010,
        msg: myResultCode[20002010].msg,
      },
    }));
    return;
  }

  // 존재하는 codeGroup 인지 체크하기
  const isCodeGroupExsit = await db.FmsCodeGroups.isExist(codeGroup);

  // 존재하지 않는 codeGroup 이면 막기
  if (!isCodeGroupExsit) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002020,
        msg: myResultCode[20002020].msg,
      },
    }));
    return;
  }

  // code 유효성 검사
  if (typeof code !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002030,
        msg: myResultCode[20002030].msg,
      },
    }));
    return;
  }

  if (code.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002040,
        msg: myResultCode[20002040].msg,
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
        code: 20002050,
        msg: myResultCode[20002050].msg,
      },
    }));
    return;
  }

  // 해당 code가 이미 등록 되었는지 확인
  const isCodeExsit = await db.FmsCodes.isExist(code);
  console.log('isCodeExsit', isCodeExsit);
  if (isCodeExsit === true) {
    // 이미 등록된 code 이면 막기
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002055,
        msg: myResultCode[20002055].msg,
      },
    }));
    return;
  }

  // codeName 유효성 검사
  if (typeof codeName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002060,
        msg: myResultCode[20002060].msg,
      },
    }));
    return;
  }

  if (codeName.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002070,
        msg: myResultCode[20002070].msg,
      },
    }));
    return;
  }

  if (codeName.length > 50) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002080,
        msg: myResultCode[20002080].msg,
      },
    }));
    return;
  }

  // codeDescription 유효성 검사
  if (typeof codeDescription === 'string') {
    if (codeDescription.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20002090,
          msg: myResultCode[20002090].msg,
        },
      }));
      return;
    }

    if (codeDescription.length > 100) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20002100,
          msg: myResultCode[20002100].msg,
        },
      }));
      return;
    }
  }

  // codeValue1 유효성 검사
  if (typeof codeValue1 === 'string') {
    if (codeValue1.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20002110,
          msg: myResultCode[20002110].msg,
        },
      }));
      return;
    }

    if (codeValue1.length > 100) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20002120,
          msg: myResultCode[20002120].msg,
        },
      }));
      return;
    }
  }

  // codeValue2 유효성 검사
  if (typeof codeValue2 === 'string') {
    if (codeValue2.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20002130,
          msg: myResultCode[20002130].msg,
        },
      }));
      return;
    }

    if (codeValue2.length > 100) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20002140,
          msg: myResultCode[20002140].msg,
        },
      }));
      return;
    }
  }

  // 새로운 코드 생성
  const createResult = await db.FmsCodes.create({
    codeGroup: codeGroup,
    code: code,
    codeName: codeName,
    codeDescription: codeDescription,
    codeValue1: codeValue1,
    codeValue2: codeValue2,
    sortNo: sortNo,
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

module.exports = createCode;