const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const jwt = require('jsonwebtoken');
const myCrypto = require('../../../librarys/myCrypto');
const myLogger = require('../../../librarys/myLogger');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');
const myBoard = require('../../../librarys/myBoard');
const myRegularExpressCheck = require('../../../librarys/myRegularExpressCheck');
const { Op, Sequelize } = require('sequelize');
require('dotenv').config();

function isValidFileDownloadUrlAccessConditionInfo(obj) {
  /*
    {
      fileAccessConditionKey: '',
      conditionType: 'FDUCT00000002',
      key: 'myauth',
      value: 'deefd44fgrertet453er4rr34r34r4frdg',
      conditionStatus: 'FDUCS00000001',
      type: 'new'
    }
  */

  if (typeof obj !== 'object') {
    return false;
  }

  if (typeof obj.fileAccessConditionKey !== 'string') {
    return false;
  }

  if (typeof obj.conditionType !== 'string') {
    return false;
  }

  if (typeof obj.key !== 'string') {
    return false;
  }

  if (typeof obj.value !== 'string') {
    return false;
  }

  if (typeof obj.conditionStatus !== 'string') {
    return false;
  }

  if (typeof obj.type !== 'string') {
    return false;
  }

  return true;
}

const createFileDownloadUrl = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  await db.insertLog({
    logType: 'LOGTY00000021', // 파일 다운로드 URL 등록 시도
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    // value1: JSON.stringify(userId),
    // value2: JSON.stringify(userPhone),
    // logContent: ``,
  });

  const isFileDownloadUrlCreatePossible = await db.isActivePermission(loginInfo.userKey, 'VvFc1617691345521eAM');
  if (!isFileDownloadUrlCreatePossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027009,
        msg: myResultCode[20027009].msg,
      },
    }));
    return;
  }

  const {
    downloadTargetUserKey,
    fileKey,
    fileVersionKey,
    // fileDownloadUrlAccessCount,
    fileDownloadPossibleDateTimeStart,
    fileDownloadPossibleDateTimeEnd,
    fileDownloadLimitMaxCount,
    // fileDownloadCount,
    fileDownloadUrlAccessConditionInfo,
    fileDownloadUrlStatus,
  } = req.body;


  // downloadTargetUserKey 체크 : required
  if (typeof downloadTargetUserKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027010,
        msg: myResultCode[20027010].msg,
      },
    }));
    return;
  }

  if (downloadTargetUserKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027020,
        msg: myResultCode[20027020].msg,
      },
    }));
    return;
  }

  if (downloadTargetUserKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027030,
        msg: myResultCode[20027030].msg,
      },
    }));
    return;
  }

  const downloadTargetUserKeyResult = await db.FmsUsers.findOne({
    where: {
      userKey: downloadTargetUserKey,
      isDeletedRow: 'N',
    },
  });
  if (downloadTargetUserKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027040,
        msg: myResultCode[20027040].msg,
      },
    }));
    return;
  }

  // fileKey 체크 : required
  if (typeof fileKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027050,
        msg: myResultCode[20027050].msg,
      },
    }));
    return;
  }

  if (fileKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027060,
        msg: myResultCode[20027060].msg,
      },
    }));
    return;
  }

  if (fileKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027070,
        msg: myResultCode[20027070].msg,
      },
    }));
    return;
  }

  const fileKeyResult = await db.FmsFiles.findOne({
    where: {
      fileKey: fileKey,
      isDeletedRow: 'N',
    },
  });
  if (fileKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027080,
        msg: myResultCode[20027080].msg,
      },
    }));
    return;
  }

  // fileVersionKey 체크 : required
  if (typeof fileVersionKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027090,
        msg: myResultCode[20027090].msg,
      },
    }));
    return;
  }

  if (fileVersionKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027100,
        msg: myResultCode[20027100].msg,
      },
    }));
    return;
  }

  // if (fileVersionKey.length !== 20) {
  //   res.status(200).json(myValueLog({
  //     req: req,
  //     obj: {
  //       result: 'failure',
  //       headTail: req.accessUniqueKey,
  //       code: 20027110,
  //       msg: myResultCode[20027110].msg,
  //     },
  //   }));
  //   return;
  // }

  if (fileVersionKey !== 'recent') {
    const fileVersionKeyResult = await db.FmsFileVersions.findOne({
      where: {
        fileKey: fileKey, 
        fileVersionKey: fileVersionKey,
        isDeletedRow: 'N',
      },
    });
    if (fileVersionKeyResult === null) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20027120,
          msg: myResultCode[20027120].msg,
        },
      }));
      return;
    }
  }

  // fileDownloadPossibleDateTimeStart 체크 : required
  if (typeof fileDownloadPossibleDateTimeStart !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027130,
        msg: myResultCode[20027130].msg,
      },
    }));
    return;
  }

  if (fileDownloadPossibleDateTimeStart.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027140,
        msg: myResultCode[20027140].msg,
      },
    }));
    return;
  }

  if (!myDate(fileDownloadPossibleDateTimeStart).isValid()) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027150,
        msg: myResultCode[20027150].msg,
      },
    }));
    return;
  }

  // fileDownloadPossibleDateTimeEnd 체크 : required
  if (typeof fileDownloadPossibleDateTimeEnd !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027160,
        msg: myResultCode[20027160].msg,
      },
    }));
    return;
  }

  if (fileDownloadPossibleDateTimeEnd.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027170,
        msg: myResultCode[20027170].msg,
      },
    }));
    return;
  }

  if (!myDate(fileDownloadPossibleDateTimeEnd).isValid()) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027180,
        msg: myResultCode[20027180].msg,
      },
    }));
    return;
  }

  // fileDownloadPossibleDateTimeStart & fileDownloadPossibleDateTimeEnd 체크 : required
  if (myDate(fileDownloadPossibleDateTimeStart).getTime() > myDate(fileDownloadPossibleDateTimeEnd).getTime()) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027190,
        msg: myResultCode[20027190].msg,
      },
    }));
    return;
  }

  // fileDownloadLimitMaxCount 체크 : required
  if (!myCommon.isNumber(fileDownloadLimitMaxCount)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027200,
        msg: myResultCode[20027200].msg,
      },
    }));
    return;
  }

  // fileDownloadUrlAccessConditionInfo 체크 : required
  /*
    -- fileDownloadUrlAccessConditionInfo -- 
    [
      {
        fileAccessConditionKey: '',
        conditionType: 'FDUCT00000002',
        key: 'myauth',
        value: 'deefd44fgrertet453er4rr34r34r4frdg',
        conditionStatus: 'FDUCS00000001',
        type: 'new'
      },
      {
        fileAccessConditionKey: 'd5e7ra4d7fgtr41c4d1f',
        conditionType: 'FDUCT00000003',
        key: '',
        value: '112233!@#',
        conditionStatus: 'FDUCS00000001',
        type: 'delete'
      },
      {
        fileAccessConditionKey: 'aa474dfbvcazaa1a1aa5',
        conditionType: 'FDUCT00000001',
        key: '',
        value: '102.12.2.5/24',
        conditionStatus: 'FDUCS00000001',
        type: 'modify'
      },
    ]
  */
  if (!Array.isArray(fileDownloadUrlAccessConditionInfo)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027210,
        msg: myResultCode[20027210].msg,
      },
    }));
    return;
  }

  const conditionTypeUnique = [];
  const conditionStatusUnique = [];

  for (let i = 0; i < fileDownloadUrlAccessConditionInfo.length; i++) {
    const item = fileDownloadUrlAccessConditionInfo[i];

    if (!isValidFileDownloadUrlAccessConditionInfo(item)) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20027220,
          msg: myResultCode[20027220].msg,
        },
      }));
      return;
    }

    if (item.type === 'new') {
      if (item.fileAccessConditionKey.trim() !== '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20027230,
            msg: myResultCode[20027230].msg,
          },
        }));
        return;
      }
    }

    if (item.type === 'delete') {
      if (item.fileAccessConditionKey.trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20027240,
            msg: myResultCode[20027240].msg,
          },
        }));
        return;
      }

      if (item.fileAccessConditionKey.length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20027250,
            msg: myResultCode[20027250].msg,
          },
        }));
        return;
      }
    }

    if (item.type === 'modify') {
      if (item.fileAccessConditionKey.trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20027260,
            msg: myResultCode[20027260].msg,
          },
        }));
        return;
      }

      if (item.fileAccessConditionKey.length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20027270,
            msg: myResultCode[20027270].msg,
          },
        }));
        return;
      }
    }

    if (!conditionTypeUnique.includes(item.conditionType)) {
      conditionTypeUnique.push(item.conditionType);
    }

    if (!conditionStatusUnique.includes(item.conditionStatus)) {
      conditionStatusUnique.push(item.conditionStatus);
    }
  }

  for (let i = 0; i < conditionTypeUnique.length; i++) {
    const conditionTypeCheck = await db.FmsCodes.isValidCode('FDUCT', conditionTypeUnique[i]);
    if (!conditionTypeCheck) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20027271,
          msg: myResultCode[20027271].msg,
        },
      }));
      return;
    }
  }

  for (let i = 0; i < conditionStatusUnique.length; i++) {
    const conditionStatusCheck = await db.FmsCodes.isValidCode('FDUCS', conditionStatusUnique[i]);
    if (!conditionStatusCheck) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20027272,
          msg: myResultCode[20027272].msg,
        },
      }));
      return;
    }
  }

  

  // fileDownloadUrlStatus 체크 : required
  if (typeof fileDownloadUrlStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027280,
        msg: myResultCode[20027280].msg,
      },
    }));
    return;
  }

  if (fileDownloadUrlStatus.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027290,
        msg: myResultCode[20027290].msg,
      },
    }));
    return;
  }

  if (fileDownloadUrlStatus.length !== 13) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027300,
        msg: myResultCode[20027300].msg,
      },
    }));
    return;
  }

  const fileDownloadUrlStatusCheck = await db.FmsCodes.isValidCode('FDUST', fileDownloadUrlStatus);
  if (!fileDownloadUrlStatusCheck) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20027310,
        msg: myResultCode[20027310].msg,
      },
    }));
    return;
  }


  // transaction start

  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');


  try {
    // 새로운 파일 다운로드 URL 생성
    const newFileDownloadUrlKey = myGetMakeToken({ strlength: 20 });

    const create = {
      fileDownloadUrlKey: newFileDownloadUrlKey,
      downloadTargetUserKey: downloadTargetUserKey,
      fileKey: fileKey,
      fileVersionKey: fileVersionKey === 'recent' ? null : fileVersionKey,
      fileDownloadUrlAccessCount: 0,
      fileDownloadPossibleDateTimeStart: fileDownloadPossibleDateTimeStart,
      fileDownloadPossibleDateTimeEnd: fileDownloadPossibleDateTimeEnd,
      fileDownloadLimitMaxCount: fileDownloadLimitMaxCount,
      fileDownloadCount: 0,
      createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
      createdIp: req.real_ip,
      createrUserKey: loginInfo.userKey,
      fileDownloadUrlStatus: fileDownloadUrlStatus,
    };

    const createResult = await db.FmsFileDownloadUrls.create(create, {
      transaction: transaction,
    });
    console.log('createResult', createResult);

    // 파일 다운로드 접근 제한 데이터 적용
    for (let i = 0; i < fileDownloadUrlAccessConditionInfo.length; i++) {
      const item = fileDownloadUrlAccessConditionInfo[i];

      if (item.type === 'new') {
        const newFileAccessConditionKey = myGetMakeToken({ strlength: 20 });

        await db.FmsFileDownloadUrlAccessConditions.create({
          fileAccessConditionKey: newFileAccessConditionKey,
          fileDownloadUrlKey: newFileDownloadUrlKey,
          conditionType: item.conditionType,
          key: item.key,
          value: item.value, 
          createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
          createdIp: req.real_ip,
          createrUserKey: loginInfo.userKey,
          conditionStatus: item.conditionStatus,
        }, {
          transaction: transaction,
        });
      }

      if (item.type === 'modify') {
        await db.FmsFileDownloadUrlAccessConditions.update({
          conditionType: item.conditionType,
          key: item.key,
          value: item.value, 
          updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
          updatedIp: req.real_ip,
          updaterUserKey: loginInfo.userKey,
          conditionStatus: item.conditionStatus,
        }, {
          where: {
            fileAccessConditionKey: item.fileAccessConditionKey,
          },
          transaction: transaction,
        });
      }

      if (item.type === 'delete') {
        await db.FmsFileDownloadUrlAccessConditions.update({
          updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
          updatedIp: req.real_ip,
          updaterUserKey: loginInfo.userKey,
          isDeletedRow: 'Y',
        }, {
          where: {
            fileAccessConditionKey: item.fileAccessConditionKey,
          },
          transaction: transaction,
        });
      }
    }

    await transaction.commit();
    myLogger.info(req.logHeadTail + 'transaction commit..!');

    await db.insertLog({
      logType: 'LOGTY00000022', // 파일 다운로드 URL 등록 성공
      createdIp: req.real_ip,
      accessUniqueKey: req.accessUniqueKey,
      userKey: loginInfo.userKey,
      value1: JSON.stringify(newFileDownloadUrlKey),
      // value2: JSON.stringify(userPhone),
      logContent: `
        ※ 새로운 파일 다운로드 URL 식별 키 : value1 값 참조

        ※ 새로운 파일 다운로드 URL 정보 : \`${JSON.stringify(create)}\`

        ※ 접근 제한 정보 : \`${JSON.stringify(fileDownloadUrlAccessConditionInfo)}\`
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
  } catch (e) {
    await transaction.rollback();
    myLogger.info(req.logHeadTail + 'transaction rollback..!');
    myLogger.error(req.logHeadTail + 'e.stack => ' + e.stack);
    myLogger.error(req.logHeadTail + 'e => ' + JSON.stringify(e));
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20027320,
        msg: myResultCode[20027320].msg,
      },
    }));
    return;
  }
});

module.exports = createFileDownloadUrl;
