const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');

const modifyCode = wrapper(async(req, res, next) => {
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
        code: 20002509,
        msg: myResultCode[20002509].msg,
      },
    }));
    return;
  }



  const {
    codeGroup, 
    code, // 수정할 코드
    codeName, // 코드명이 codeName 으로 변경
    codeDescription, // 코드 설명이 codeDescription 으로 변경
    codeValue1, // 코드 필요값1이 codeValue1 으로 변경
    codeValue2, // 코드 필요값2가 codeValue2 으로 변경
    sortNo,
  } = req.body;

  // codeGroup 유효성 검사
  // if (typeof codeGroup !== 'string') {
  //   res.status(200).json(myValueLog({
  //     req: req,
  //     obj: {
  //       result: 'failure',
  //       headTail: req.accessUniqueKey,
  //       code: 20002010,
  //       msg: myResultCode[20002010].msg,
  //     },
  //   }));
  //   return;
  // }

  // // 존재하는 codeGroup 인지 체크하기
  // const isCodeGroupExsit = await db.FmsCodeGroups.isExist(codeGroup);

  // // 존재하지 않는 codeGroup 이면 막기
  // if (!isCodeGroupExsit) {
  //   res.status(200).json(myValueLog({
  //     req: req,
  //     obj: {
  //       result: 'failure',
  //       headTail: req.accessUniqueKey,
  //       code: 20002020,
  //       msg: myResultCode[20002020].msg,
  //     },
  //   }));
  //   return;
  // }

  // code 체크 : required
  if (typeof code !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002510,
        msg: myResultCode[20002510].msg,
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
        code: 20002520,
        msg: myResultCode[20002520].msg,
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
        code: 20002530,
        msg: myResultCode[20002530].msg,
      },
    }));
    return;
  }

  // 해당 code가 존재하는지 확인
  const isCodeExsit = await db.FmsCodes.isExist(code);
  if (isCodeExsit === null) {
    // 등록 되지 않은 code 이면 막기
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002540,
        msg: myResultCode[20002540].msg,
      },
    }));
    return;
  }

  // codeName 체크 : optional
  if (codeName !== undefined && typeof codeName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002559,
        msg: myResultCode[20002559].msg,
      },
    }));
    return;
  }

  if (typeof codeName === 'string') {
    if (codeName.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20002560,
          msg: myResultCode[20002560].msg,
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
          code: 20002570,
          msg: myResultCode[20002570].msg,
        },
      }));
      return;
    }
  }

  // codeDescription 체크 : optional
  if (codeDescription !== null && codeDescription !== undefined && typeof codeDescription !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002579,
        msg: myResultCode[20002579].msg,
      },
    }));
    return;
  }

  if (typeof codeDescription === 'string') {
    if (codeDescription.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20002580,
          msg: myResultCode[20002580].msg,
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
          code: 20002590,
          msg: myResultCode[20002590].msg,
        },
      }));
      return;
    }
  }

  // codeValue1 유효성 검사 : optional
  if (codeValue1 !== null && codeValue1 !== undefined && typeof codeValue1 !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002659,
        msg: myResultCode[20002659].msg,
      },
    }));
    return;
  }

  if (typeof codeValue1 === 'string') {
    if (codeValue1.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20002600,
          msg: myResultCode[20002600].msg,
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
          code: 20002610,
          msg: myResultCode[20002610].msg,
        },
      }));
      return;
    }
  }

  // codeValue2 체크 : optional
  if (codeValue2 !== null && codeValue2 !== undefined && typeof codeValue2 !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20002619,
        msg: myResultCode[20002619].msg,
      },
    }));
    return;
  }

  if (typeof codeValue2 === 'string') {
    if (codeValue2.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20002620,
          msg: myResultCode[20002620].msg,
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
          code: 20002630,
          msg: myResultCode[20002630].msg,
        },
      }));
      return;
    }
  }

  // 코드 데이터 수정
  const updateResult = await db.FmsCodes.update({
    codeName: codeName,
    codeDescription: codeDescription,
    codeValue1: codeValue1,
    codeValue2: codeValue2,
    sortNo: sortNo,
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

module.exports = modifyCode;