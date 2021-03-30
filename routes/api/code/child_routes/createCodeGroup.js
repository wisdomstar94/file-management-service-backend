const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');

const createCodeGroup = wrapper(async(req, res, next) => {
  const {
    codeGroup,
    codeGroupName,
    codeGroupDescription,
  } = req.body;

  // codeGroup 유효성 검사
  if (typeof codeGroup !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20001509,
        msg: myResultCode[20001509].msg,
      },
    }));
    return;
  }

  if (codeGroup.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20001590,
        msg: myResultCode[20001590].msg,
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
        code: 20001600,
        msg: myResultCode[20001600].msg,
      },
    }));
    return;
  }

  // 이미 존재하는 codeGroup 인지 체크하기
  const isCodeGroupExsit = await db.FmsCodeGroups.isExist(codeGroup);

  // 이미 존재하는 codeGroup 이면 막기
  if (isCodeGroupExsit) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20001510,
        msg: myResultCode[20001510].msg,
      },
    }));
    return;
  }

  // 존재하지 않는 codeGroup 이면

  // codeGroupName 유효성 검사
  if (typeof codeGroupName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20001520,
        msg: myResultCode[20001520].msg,
      },
    }));
    return;
  }

  if (codeGroupName.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20001530,
        msg: myResultCode[20001530].msg,
      },
    }));
    return;
  }

  if (codeGroupName.length > 100) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20001540,
        msg: myResultCode[20001540].msg,
      },
    }));
    return;
  }


  // 새로운 코드 그룹 생성
  const createResult = await db.FmsCodeGroups.create({
    codeGroup: codeGroup,
    codeGroupName: codeGroupName,
    codeGroupDescription: codeGroupDescription,
    updatedAt: null,
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

module.exports = createCodeGroup;