const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');

const modifyCodeGroup = wrapper(async(req, res, next) => {
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
        code: 20004509,
        msg: myResultCode[20004509].msg,
      },
    }));
    return;
  }


  const {
    codeGroup, // 수정할 코드 그룹
    codeGroupName, // 코드 그룹명을 codeGroupName 으로 수정
    codeGroupDescription, // 코드 그룹 설명을 codeGroupDescription 으로 수정
  } = req.body;

  // codeGroup 체크 : required
  if (typeof codeGroup !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20004510,
        msg: myResultCode[20004510].msg,
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
        code: 20004520,
        msg: myResultCode[20004520].msg,
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
        code: 20004530,
        msg: myResultCode[20004530].msg,
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
        code: 20004540,
        msg: myResultCode[20004540].msg,
      },
    }));
    return;
  }

  // 존재하지 않는 codeGroup 이면

  
  // codeGroupName 체크 : optional
  if (codeGroupName !== undefined && typeof codeGroupName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20004559,
        msg: myResultCode[20004559].msg,
      },
    }));
    return;
  }

  if (codeGroupName === 'string') {
    if (codeGroupName.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20004560,
          msg: myResultCode[20004560].msg,
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
          code: 20004570,
          msg: myResultCode[20004570].msg,
        },
      }));
      return;
    }
  }

  // codeGroupDescription 체크 : optional
  if (codeGroupDescription !== null && codeGroupDescription !== undefined && typeof codeGroupDescription !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20004580,
        msg: myResultCode[20004580].msg,
      },
    }));
    return;
  }

  if (typeof codeGroupDescription === 'string') {
    if (codeGroupDescription.length > 100) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20004590,
          msg: myResultCode[20004590].msg,
        },
      }));
      return;
    }
  }



  // 코드 그룹 데이터 수정
  const createResult = await db.FmsCodeGroups.update({
    codeGroupName: codeGroupName,
    codeGroupDescription: codeGroupDescription,
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

module.exports = modifyCodeGroup;