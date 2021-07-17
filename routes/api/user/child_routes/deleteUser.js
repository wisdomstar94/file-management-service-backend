const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myCrypto = require('../../../librarys/myCrypto');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');
const myBoard = require('../../../librarys/myBoard');
const myRegularExpressCheck = require('../../../librarys/myRegularExpressCheck');
const { Op, Sequelize } = require('sequelize');

const deleteUser = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  await db.insertLog({
    logType: 'LOGTY00000012', // 회원 삭제 시도
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    // value1: JSON.stringify(userId),
    // value2: JSON.stringify(newUserKey),
    // logContent: `
    //   ※ 삭제하려는 회원 ID : value1 값 참조

    //   ※ 새롭게 생성된 회원 식별 키 : value2 값 참조
    // `,
  });

  const isUserDeletePossible = await db.isActivePermission(loginInfo.userKey, 'gQdEs1617688259139el');
  if (!isUserDeletePossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20019509,
        msg: myResultCode[20019509].msg,
      },
    }));
    return;
  }  


  const {
    userKey, // string 또는 string[]
  } = req.body;

  // userKey 체크 : required
  if (typeof userKey !== 'string' && !Array.isArray(userKey)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20019510,
        msg: myResultCode[20019510].msg,
      },
    }));
    return;
  }

  if (typeof userKey === 'string') {
    if (userKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20019520,
          msg: myResultCode[20019520].msg,
        },
      }));
      return;
    }

    if (userKey.length !== 20) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20019530,
          msg: myResultCode[20019530].msg,
        },
      }));
      return;
    }
  }

  if (Array.isArray(userKey)) {
    if (userKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20019540,
          msg: myResultCode[20019540].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < userKey.length; i++) {
      if (typeof userKey[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20019550,
            msg: myResultCode[20019550].msg,
          },
        }));
        return;
      }

      if (userKey[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20019560,
            msg: myResultCode[20019560].msg,
          },
        }));
        return;
      }

      if (userKey[i].length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20019570,
            msg: myResultCode[20019570].msg,
          },
        }));
        return;
      }
    }
  }

  // 삭제 처리 하기 전 해당 회원정보로 등록된 파일 다운로드 URL 정보가 있는지 확인하기
  const fileDownloadUrlResult = await db.FmsFileDownloadUrls.findAll({
    where: {
      downloadTargetUserKey: userKey,
      isDeletedRow: 'N',
    },
  });
  if (fileDownloadUrlResult.length > 0) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20019580,
        msg: myResultCode[20019580].msg,
      },
    }));
    return;
  }

  // 삭제 처리 전 회원 상태 가져오기
  const deleteBeforeUserInfo = await db.FmsUsers.findAll({
    where: {
      userKey: userKey,
    },
  });
  // let userId = undefined;
  // if (deleteBeforeUserInfo !== null) {
  //   userId = deleteBeforeUserInfo.userId;
  // }


  // 회원 정보 삭제 처리
  const modifyResult = await db.FmsUsers.update({
    isDeletedRow: 'Y',
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    updatedIp: req.real_ip,
  }, {
    where: {
      userKey: userKey,
    },
  });

  await db.insertLog({
    logType: 'LOGTY00000013', // 회원 삭제 성공
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    // value1: JSON.stringify(userId),
    // value2: JSON.stringify(newUserKey),
    logContent: `
      ※ 삭제하려는 회원 ID : value1 값 참조

      ※ 삭제 당시 회원 정보 : \`${JSON.stringify(deleteBeforeUserInfo)}\`
    `,
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

module.exports = deleteUser;