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

const modifyFileDownloadUrl = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  await db.insertLog({
    logType: 'LOGTY00000023', // 파일 다운로드 URL 수정 시도
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    // value1: JSON.stringify(newFileDownloadUrlKey),
    // value2: JSON.stringify(userPhone),
    // logContent: ``,
  });

  const isFileDownloadUrlAllModifyPossible = await db.isActivePermission(loginInfo.userKey, 'VlEX1619174971861yVJ');

  const {
    fileDownloadUrlKey,
    downloadTargetUserKey,
    // fileKey,
    fileVersionKey,
    // fileDownloadUrlAccessCount,
    fileDownloadPossibleDateTimeStart,
    fileDownloadPossibleDateTimeEnd,
    fileDownloadLimitMaxCount,
    fileDownloadCount,
    fileDownloadUrlAccessConditionInfo,
    fileDownloadUrlStatus,
  } = req.body;


  // fileDownloadUrlKey 체크 : required
  if (typeof fileDownloadUrlKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031010,
        msg: myResultCode[20031010].msg,
      },
    }));
    return;
  }

  if (fileDownloadUrlKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031020,
        msg: myResultCode[20031020].msg,
      },
    }));
    return;
  }

  if (fileDownloadUrlKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031030,
        msg: myResultCode[20031030].msg,
      },
    }));
    return;
  }

  const fileDownloadUrlKeyResult = await db.FmsFileDownloadUrls.findOne({
    where: {
      fileDownloadUrlKey: fileDownloadUrlKey,
    },
  });

  if (fileDownloadUrlKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031035,
        msg: myResultCode[20031035].msg,
      },
    }));
    return;
  }

  // downloadTargetUserKey 체크 : optional
  if (downloadTargetUserKey !== undefined && typeof downloadTargetUserKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031040,
        msg: myResultCode[20031040].msg,
      },
    }));
    return;
  }

  if (typeof downloadTargetUserKey === 'string') {
    if (!isFileDownloadUrlAllModifyPossible) {
      const isFileDownloadUrlTargetUserKeyModifyPossible = await db.isActivePermission(loginInfo.userKey, 'vqINGKr1617691537278');
      if (!isFileDownloadUrlTargetUserKeyModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20031049,
            msg: myResultCode[20031049].msg,
          },
        }));
        return;
      }
    }

    if (downloadTargetUserKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20031050,
          msg: myResultCode[20031050].msg,
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
          code: 20031060,
          msg: myResultCode[20031060].msg,
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
          code: 20031070,
          msg: myResultCode[20031070].msg,
        },
      }));
      return;
    }
  }

  // fileKey 체크 : optional
  // if (fileKey !== undefined && typeof fileKey !== 'string') {
  //   res.status(200).json(myValueLog({
  //     req: req,
  //     obj: {
  //       result: 'failure',
  //       headTail: req.accessUniqueKey,
  //       code: 20031080,
  //       msg: myResultCode[20031080].msg,
  //     },
  //   }));
  //   return;
  // }

  // if (typeof fileKey === 'string') {
  //   if (fileKey.trim() === '') {
  //     res.status(200).json(myValueLog({
  //       req: req,
  //       obj: {
  //         result: 'failure',
  //         headTail: req.accessUniqueKey,
  //         code: 20031090,
  //         msg: myResultCode[20031090].msg,
  //       },
  //     }));
  //     return;
  //   }
    
  //   if (fileKey.length !== 20) {
  //     res.status(200).json(myValueLog({
  //       req: req,
  //       obj: {
  //         result: 'failure',
  //         headTail: req.accessUniqueKey,
  //         code: 20031100,
  //         msg: myResultCode[20031100].msg,
  //       },
  //     }));
  //     return;
  //   }

  //   const fileKeyResult = await db.FmsFiles.findOne({
  //     where: {
  //       fileKey: fileKey,
  //       isDeletedRow: 'N',
  //     },
  //   });
  //   if (fileKeyResult === null) {
  //     res.status(200).json(myValueLog({
  //       req: req,
  //       obj: {
  //         result: 'failure',
  //         headTail: req.accessUniqueKey,
  //         code: 20031110,
  //         msg: myResultCode[20031110].msg,
  //       },
  //     }));
  //     return;
  //   }
  // }

  // fileVersionKey 체크 : optional
  if (fileVersionKey !== undefined && typeof fileVersionKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031120,
        msg: myResultCode[20031120].msg,
      },
    }));
    return;
  }

  if (typeof fileVersionKey === 'string') {
    if (!isFileDownloadUrlAllModifyPossible) {
      const isFileVersionModifyPossible = await db.isActivePermission(loginInfo.userKey, 'jEi1617691551741tSOG');
      if (!isFileVersionModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20031129,
            msg: myResultCode[20031129].msg,
          },
        }));
        return;
      }
    }

    if (fileVersionKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20031130,
          msg: myResultCode[20031130].msg,
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
    //       code: 20031140,
    //       msg: myResultCode[20031140].msg,
    //     },
    //   }));
    //   return;
    // }

    if (fileVersionKey !== 'null') {
      const fileVersionKeyResult = await db.FmsFileVersions.findOne({
        where: {
          fileKey: fileDownloadUrlKeyResult.fileKey,
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
            code: 20031150,
            msg: myResultCode[20031150].msg,
          },
        }));
        return;
      }
    }
  }

  // fileDownloadPossibleDateTimeStart 체크 : optional
  if (fileDownloadPossibleDateTimeStart !== undefined && typeof fileDownloadPossibleDateTimeStart !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031160,
        msg: myResultCode[20031160].msg,
      },
    }));
    return;
  }

  if (typeof fileDownloadPossibleDateTimeStart === 'string') {
    if (!isFileDownloadUrlAllModifyPossible) {
      const isFileDownloadPossibleDateTimeModifyPossible = await db.isActivePermission(loginInfo.userKey, 'GuP1617691566626dvRA');
      if (!isFileDownloadPossibleDateTimeModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20031169,
            msg: myResultCode[20031169].msg,
          },
        }));
        return;
      }
    }

    if (fileDownloadPossibleDateTimeStart.trim() === '' || !myDate(fileDownloadPossibleDateTimeStart).isValid()) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20031170,
          msg: myResultCode[20031170].msg,
        },
      }));
      return;
    }
  }

  // fileDownloadPossibleDateTimeEnd 체크 : optional
  if (fileDownloadPossibleDateTimeEnd !== undefined && typeof fileDownloadPossibleDateTimeEnd !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031180,
        msg: myResultCode[20031180].msg,
      },
    }));
    return;
  }

  if (typeof fileDownloadPossibleDateTimeEnd === 'string') {
    if (!isFileDownloadUrlAllModifyPossible) {
      const isFileDownloadPossibleDateTimeModifyPossible = await db.isActivePermission(loginInfo.userKey, 'GuP1617691566626dvRA');
      if (!isFileDownloadPossibleDateTimeModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20031189,
            msg: myResultCode[20031189].msg,
          },
        }));
        return;
      }
    }

    if (fileDownloadPossibleDateTimeEnd.trim() === '' || !myDate(fileDownloadPossibleDateTimeEnd).isValid()) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20031190,
          msg: myResultCode[20031190].msg,
        },
      }));
      return;
    }
  }

  // fileDownloadPossibleDateTimeStart & fileDownloadPossibleDateTimeEnd 체크
  if (fileDownloadPossibleDateTimeStart !== undefined || fileDownloadPossibleDateTimeEnd !== undefined) {
    if (typeof fileDownloadPossibleDateTimeStart !== 'string') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20031200,
          msg: myResultCode[20031200].msg,
        },
      }));
      return;
    }

    if (typeof fileDownloadPossibleDateTimeEnd !== 'string') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20031210,
          msg: myResultCode[20031210].msg,
        },
      }));
      return;
    }

    if (myDate(fileDownloadPossibleDateTimeStart).getTime() > myDate(fileDownloadPossibleDateTimeEnd).getTime()) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20031220,
          msg: myResultCode[20031220].msg,
        },
      }));
      return;
    }
  }

  // fileDownloadLimitMaxCount 체크 : optional
  if (fileDownloadLimitMaxCount !== undefined && !myCommon.isNumber(fileDownloadLimitMaxCount)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031230,
        msg: myResultCode[20031230].msg,
      },
    }));
    return;
  }

  if (myCommon.isNumber(fileDownloadLimitMaxCount)) {
    if (!isFileDownloadUrlAllModifyPossible) {
      const isFileDownloadLimitMaxCountModifyPossible = await db.isActivePermission(loginInfo.userKey, 'ehV1617691582518czOk');
      if (!isFileDownloadLimitMaxCountModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20031235,
            msg: myResultCode[20031235].msg,
          },
        }));
        return;
      }
    }
  }

  // fileDownloadCount 체크 : optional
  if (fileDownloadCount !== undefined && !myCommon.isNumber(fileDownloadCount)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031240,
        msg: myResultCode[20031240].msg,
      },
    }));
    return;
  }

  if (myCommon.isNumber(fileDownloadCount)) {
    if (!isFileDownloadUrlAllModifyPossible) {
      const isFileDownloadCountModifyPossible = await db.isActivePermission(loginInfo.userKey, 'eqaOCnz1617691599380');
      if (!isFileDownloadCountModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20031249,
            msg: myResultCode[20031249].msg,
          },
        }));
        return;
      }
    }

    if (Number(fileDownloadCount) !== 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20031250,
          msg: myResultCode[20031250].msg,
        },
      }));
      return;
    }
  }

  // fileDownloadUrlAccessConditionInfo 체크 : required
  if (!Array.isArray(fileDownloadUrlAccessConditionInfo)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031260,
        msg: myResultCode[20031260].msg,
      },
    }));
    return;
  }

  const conditionTypeUnique = [];
  const conditionStatusUnique = [];

  if (fileDownloadUrlAccessConditionInfo.length > 0) {
    if (!isFileDownloadUrlAllModifyPossible) {
      const isFileDownloadUrlAccessConditionInfoModifyPossible = await db.isActivePermission(loginInfo.userKey, 'Vm1617691627356GZtNd');
      if (!isFileDownloadUrlAccessConditionInfoModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20031265,
            msg: myResultCode[20031265].msg,
          },
        }));
        return;
      }
    }
  }

  for (let i = 0; i < fileDownloadUrlAccessConditionInfo.length; i++) {
    const item = fileDownloadUrlAccessConditionInfo[i];

    if (!isValidFileDownloadUrlAccessConditionInfo(item)) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20031270,
          msg: myResultCode[20031270].msg,
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
            code: 20031280,
            msg: myResultCode[20031280].msg,
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
            code: 20031290,
            msg: myResultCode[20031290].msg,
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
            code: 20031300,
            msg: myResultCode[20031300].msg,
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
            code: 20031310,
            msg: myResultCode[20031310].msg,
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
            code: 20031320,
            msg: myResultCode[20031320].msg,
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
          code: 20031330,
          msg: myResultCode[20031330].msg,
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
          code: 20031340,
          msg: myResultCode[20031340].msg,
        },
      }));
      return;
    }
  }

  // fileDownloadUrlStatus 체크 : optional
  if (fileDownloadUrlStatus !== undefined && typeof fileDownloadUrlStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031350,
        msg: myResultCode[20031350].msg,
      },
    }));
    return;
  }

  if (typeof fileDownloadUrlStatus === 'string') {
    if (!isFileDownloadUrlAllModifyPossible) {
      const isFileDownloadUrlStatusModifyPossible = await db.isActivePermission(loginInfo.userKey, 'DfCM1617691613278YYD');
      if (!isFileDownloadUrlStatusModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20031359,
            msg: myResultCode[20031359].msg,
          },
        }));
        return;
      }
    }

    if (fileDownloadUrlStatus.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20031360,
          msg: myResultCode[20031360].msg,
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
          code: 20031370,
          msg: myResultCode[20031370].msg,
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
          code: 20031380,
          msg: myResultCode[20031380].msg,
        },
      }));
      return;
    }
  }
  

  

  // transaction start

  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');


  try {
    // 다운로드 URL 정보 업데이트
    const update = {
      downloadTargetUserKey: downloadTargetUserKey,
      // fileKey: fileKey,
      fileVersionKey: fileVersionKey === 'null' ? null : fileVersionKey,
      fileDownloadPossibleDateTimeStart: fileDownloadPossibleDateTimeStart,
      fileDownloadPossibleDateTimeEnd: fileDownloadPossibleDateTimeEnd,
      fileDownloadLimitMaxCount: fileDownloadLimitMaxCount,
      fileDownloadCount: fileDownloadCount,
      updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
      updatedIp: req.real_ip,
      updaterUserKey: loginInfo.userKey,
      fileDownloadUrlStatus: fileDownloadUrlStatus,
    };

    const updateResult = await db.FmsFileDownloadUrls.update(update, {
      where: {
        fileDownloadUrlKey: fileDownloadUrlKey,
      },
      transaction: transaction,
    });
    console.log('updateResult', updateResult);

    // 파일 다운로드 접근 제한 데이터 적용
    for (let i = 0; i < fileDownloadUrlAccessConditionInfo.length; i++) {
      const item = fileDownloadUrlAccessConditionInfo[i];

      let insertValue = item.value;
      if (typeof item.value === 'string' && item.conditionType === 'FDUCT00000003') {
        // insertValue = myCrypto.encrypt({ originalValue: item.value });
      }

      if (item.type === 'new') {
        const newFileAccessConditionKey = myGetMakeToken({ strlength: 20 });

        await db.FmsFileDownloadUrlAccessConditions.create({
          fileAccessConditionKey: newFileAccessConditionKey,
          fileDownloadUrlKey: fileDownloadUrlKey,
          conditionType: item.conditionType,
          key: item.key,
          value: insertValue, 
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
          value: insertValue, 
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
      logType: 'LOGTY00000024', // 파일 다운로드 URL 수정 성공
      createdIp: req.real_ip,
      accessUniqueKey: req.accessUniqueKey,
      userKey: loginInfo.userKey,
      value1: JSON.stringify(fileDownloadUrlKey),
      // value2: JSON.stringify(userPhone),
      logContent: `
        ※ 수정 대상 파일 다운로드 URL의 식별키 : value1 값 참조

        ※ 수정 전 파일 다운로드 URL 정보 : \`${JSON.stringify(fileDownloadUrlKeyResult)}\`

        ※ 수정 후 파일 다운로드 URL 정보 : \`${JSON.stringify(update)}\`

        ※ 적용된 접근 제한 정보 : \`${JSON.stringify(fileDownloadUrlAccessConditionInfo)}\`
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
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20031390,
        msg: myResultCode[20031390].msg,
      },
    }));
    return;
  }
});

module.exports = modifyFileDownloadUrl;
