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

const getFileDownloadUrl = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const isFileDownloadUrlListPossible = await db.isActivePermission(loginInfo.userKey, 'KA1617691210754FxPXn');
  if (!isFileDownloadUrlListPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20030010,
        msg: myResultCode[20030010].msg,
      },
    }));
    return;
  }

  const isFileDownloadUrlAllSearchPossible = await db.isActivePermission(loginInfo.userKey, 'FV1617691241638WOtiK');


  const {
    fileDownloadUrlKey,
    downloadTargetUserKey,
    downloadTargetUserId,
    downloadTargetUserName,
    fileKey,
    fileLabelName,
    fileVersionKey,
    createdAtStart,
    createdAtEnd,
    fileDownloadUrlAccessCountStart,
    fileDownloadUrlAccessCountEnd,
    fileDownloadPossibleDateTimeStart,
    fileDownloadPossibleDateTimeEnd,
    fileDownloadLimitMaxCountStart,
    fileDownloadLimitMaxCountEnd,
    fileDownloadCountStart,
    fileDownloadCountEnd,
    fileDownloadUrlAccessConditionType,
    fileDownloadUrlStatus,

    page, // 요청온 페이지 숫자
    pageViewCount, // 한번에 표시되는 페이징 수
    viewCount, // 한번에 표시되는 게시글 수
  } = req.body;

  let pageReal = Number(page);
  let pageViewCountReal = Number(pageViewCount);
  let viewCountReal = Number(viewCount);

  const where = {};

  const targetUserWhereOpAndArray = [];
  let targetUserRequired = false;

  const fileWhereOpAndArray = [];
  let fileRequired = false;

  const fileVersionWhereOpAndArray = [];
  let fileVersionRequired = false;

  const createrUserWhereOpAndArray = [];
  let createrUserRequired = false;

  const updaterUserWhereOpAndArray = [];
  let updaterUserRequired = false;

  const order = [];
  const OpAndArray = [];

  // const includes = [];










  // fileDownloadUrlKey 체크 : optional
  if (typeof fileDownloadUrlKey === 'string') {
    if (fileDownloadUrlKey.trim() !== '' && fileDownloadUrlKey.length === 20) {
      if (!isFileDownloadUrlAllSearchPossible) {
        const isFileDownloadUrlKeySearchPossible = await db.isActivePermission(loginInfo.userKey, 'PkWkVjK1617691256386');
        if (!isFileDownloadUrlKeySearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20046010,
              msg: myResultCode[20046010].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        fileDownloadUrlKey: {
          [Op.eq]: fileDownloadUrlKey,
        },
      });
    }
  }

  if (Array.isArray(fileDownloadUrlKey)) {
    const fileDownloadUrlKeyReal = [];

    for (let i = 0; i < fileDownloadUrlKey.length; i++) {
      if (typeof fileDownloadUrlKey[i] !== 'string') {
        continue;
      }

      if (fileDownloadUrlKey[i].trim() === '') {
        continue;
      }

      if (fileDownloadUrlKey[i].length !== 20) {
        continue;
      }

      fileDownloadUrlKeyReal.push(fileDownloadUrlKey[i]);
    }

    if (fileDownloadUrlKeyReal.length > 0) {
      if (!isFileDownloadUrlAllSearchPossible) {
        const isFileDownloadUrlKeySearchPossible = await db.isActivePermission(loginInfo.userKey, 'PkWkVjK1617691256386');
        if (!isFileDownloadUrlKeySearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20046020,
              msg: myResultCode[20046020].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        fileDownloadUrlKey: {
          [Op.in]: fileDownloadUrlKey,
        },
      });
    }
  }

  // downloadTargetUserKey 체크 : optional
  if (typeof downloadTargetUserKey === 'string') {
    if (downloadTargetUserKey.trim() !== '' && downloadTargetUserKey.length === 20) {
      OpAndArray.push({
        downloadTargetUserKey: {
          [Op.eq]: downloadTargetUserKey,
        },
      });
    }
  }

  if (Array.isArray(downloadTargetUserKey)) {
    const downloadTargetUserKeyReal = [];

    for (let i = 0; i < downloadTargetUserKey.length; i++) {
      if (typeof downloadTargetUserKey[i] !== 'string') {
        continue;
      }

      if (downloadTargetUserKey[i].trim() === '') {
        continue;
      }

      if (downloadTargetUserKey[i].length !== 20) {
        continue;
      }

      downloadTargetUserKeyReal.push(downloadTargetUserKey[i]);
    }

    if (downloadTargetUserKeyReal.length > 0) {
      OpAndArray.push({
        downloadTargetUserKey: {
          [Op.in]: downloadTargetUserKey,
        },
      });
    }
  }

  // downloadTargetUserId 체크 : optional
  if (typeof downloadTargetUserId === 'string') {
    if (downloadTargetUserId.trim() !== '') {
      targetUserWhereOpAndArray.push({
        userId: {
          [Op.substring]: myCommon.specialCharEscape(downloadTargetUserId),
        },
      });
    }
  }

  if (Array.isArray(downloadTargetUserId)) {
    const downloadTargetUserIdReal = [];

    for (let i = 0; i < downloadTargetUserId.length; i++) {
      if (typeof downloadTargetUserId[i] !== 'string') {
        continue;
      }

      if (downloadTargetUserId[i].trim() === '') {
        continue;
      }

      downloadTargetUserIdReal.push(downloadTargetUserId[i]);
    }

    if (downloadTargetUserIdReal.length > 0) {
      targetUserWhereOpAndArray.push({
        [Op.or]: downloadTargetUserIdReal.map((x) => {
          return {
            userId: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // downloadTargetUserName 체크 : optional
  if (typeof downloadTargetUserName === 'string') {
    if (downloadTargetUserName.trim() !== '') {
      targetUserWhereOpAndArray.push({
        userName: {
          [Op.substring]: myCommon.specialCharEscape(downloadTargetUserName),
        },
      });
    }
  }

  if (Array.isArray(downloadTargetUserName)) {
    const downloadTargetUserNameReal = [];

    for (let i = 0; i < downloadTargetUserName.length; i++) {
      if (typeof downloadTargetUserName[i] !== 'string') {
        continue;
      }

      if (downloadTargetUserName[i].trim() === '') {
        continue;
      }

      downloadTargetUserNameReal.push(downloadTargetUserName[i]);
    }

    if (downloadTargetUserNameReal.length > 0) {
      targetUserWhereOpAndArray.push({
        [Op.or]: downloadTargetUserNameReal.map((x) => {
          return {
            userName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // fileKey 체크 : optional
  if (typeof fileKey === 'string') {
    if (fileKey.trim() !== '' && fileKey.length === 20) {
      OpAndArray.push({
        fileKey: {
          [Op.eq]: fileKey,
        },
      });
    }
  }

  if (Array.isArray(fileKey)) {
    const fileKeyReal = [];

    for (let i = 0; i < fileKey.length; i++) {
      if (typeof fileKey[i] !== 'string') {
        continue;
      }

      if (fileKey[i].trim() === '') {
        continue;
      }

      if (fileKey[i].length !== 20) {
        continue;
      }

      fileKeyReal.push(fileKey[i]);
    }

    if (fileKeyReal.length > 0) {
      OpAndArray.push({
        fileKey: {
          [Op.in]: fileKey,
        },
      });
    }
  }

  // fileLabelName 체크 : optional
  if (typeof fileLabelName === 'string') {
    if (fileLabelName.trim() !== '') {
      fileWhereOpAndArray.push({
        fileLabelName: {
          [Op.substring]: myCommon.specialCharEscape(fileLabelName),
        },
      });
    }
  }

  if (Array.isArray(fileLabelName)) {
    const fileLabelNameReal = [];

    for (let i = 0; i < fileLabelName.length; i++) {
      if (typeof fileLabelName[i] !== 'string') {
        continue;
      }

      if (fileLabelName[i].trim() === '') {
        continue;
      }

      fileLabelNameReal.push(fileLabelName[i]);
    }

    if (fileLabelNameReal.length > 0) {
      fileWhereOpAndArray.push({
        [Op.or]: fileLabelNameReal.map((x) => {
          return {
            fileLabelName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // fileVersionKey 체크 : optional
  if (typeof fileVersionKey === 'string') {
    if (fileVersionKey.trim() !== '' && fileVersionKey.length === 20) {
      if (!isFileDownloadUrlAllSearchPossible) {
        const isFileDownloadUrlFileVersionSearchPossible = await db.isActivePermission(loginInfo.userKey, 'AgJmIv1619349258683c');
        if (!isFileDownloadUrlFileVersionSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20046030,
              msg: myResultCode[20046030].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        fileVersionKey: {
          [Op.eq]: fileVersionKey,
        },
      });
    }
  }

  if (Array.isArray(fileVersionKey)) {
    const fileVersionKeyReal = [];

    for (let i = 0; i < fileVersionKey.length; i++) {
      if (typeof fileVersionKey[i] !== 'string') {
        continue;
      }

      if (fileVersionKey[i].trim() === '') {
        continue;
      }

      if (fileVersionKey[i].length !== 20) {
        continue;
      }

      fileVersionKeyReal.push(fileVersionKey[i]);
    }

    if (fileVersionKeyReal.length > 0) {
      if (!isFileDownloadUrlAllSearchPossible) {
        const isFileDownloadUrlFileVersionSearchPossible = await db.isActivePermission(loginInfo.userKey, 'AgJmIv1619349258683c');
        if (!isFileDownloadUrlFileVersionSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20046040,
              msg: myResultCode[20046040].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        fileVersionKey: {
          [Op.in]: fileVersionKey,
        },
      });
    }
  }

  // createdAtStart 체크 : optional
  if (typeof createdAtStart === 'string') {
    if (myDate(createdAtStart).isValid()) {
      if (!isFileAllSearchPossible) {
        const isFileCreatedAtSearchPossible = await db.isActivePermission(loginInfo.userKey, 'KbbF1617691303153rpx');
        if (!isFileCreatedAtSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20046042,
              msg: myResultCode[20046042].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        createdAt:{
          [Op.gte]: createdAtStart,
        },
      });
    }
  }

  // createdAtEnd 체크 : optional
  if (typeof createdAtEnd === 'string') {
    if (myDate(createdAtEnd).isValid()) {
      if (!isFileAllSearchPossible) {
        const isFileCreatedAtSearchPossible = await db.isActivePermission(loginInfo.userKey, 'KbbF1617691303153rpx');
        if (!isFileCreatedAtSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20046043,
              msg: myResultCode[20046043].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        createdAt:{
          [Op.lte]: createdAtEnd,
        },
      });
    }
  }

  // fileDownloadUrlAccessCountStart 체크 : optional
  if (myCommon.isNumber(fileDownloadUrlAccessCountStart)) {
    if (!isFileDownloadUrlAllSearchPossible) {
      const isFileDownloadUrlAccessCountSearchPossible = await db.isActivePermission(loginInfo.userKey, 'JgPbu1619349344177QQ');
      if (!isFileDownloadUrlAccessCountSearchPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20046050,
            msg: myResultCode[20046050].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      fileDownloadUrlAccessCount: {
        [Op.gte]: Number(fileDownloadUrlAccessCountStart),
      },
    });
  }

  // fileDownloadUrlAccessCountEnd 체크 : optional
  if (myCommon.isNumber(fileDownloadUrlAccessCountEnd)) {
    if (!isFileDownloadUrlAllSearchPossible) {
      const isFileDownloadUrlAccessCountSearchPossible = await db.isActivePermission(loginInfo.userKey, 'JgPbu1619349344177QQ');
      if (!isFileDownloadUrlAccessCountSearchPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20046060,
            msg: myResultCode[20046060].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      fileDownloadUrlAccessCount: {
        [Op.lte]: Number(fileDownloadUrlAccessCountEnd),
      },
    });
  }

  // fileDownloadPossibleDateTimeStart 체크 : optional
  if (typeof fileDownloadPossibleDateTimeStart === 'string') {
    if (myDate(fileDownloadPossibleDateTimeStart).isValid()) {
      if (!isFileDownloadUrlAllSearchPossible) {
        const isFileDownloadUrlDownloadPossibleDateTimeSearchPossible = await db.isActivePermission(loginInfo.userKey, 'xD1617691288301xOsvB');
        if (!isFileDownloadUrlDownloadPossibleDateTimeSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20046070,
              msg: myResultCode[20046070].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        fileDownloadPossibleDateTimeStart: {
          [Op.gte]: fileDownloadPossibleDateTimeStart.split(' ')[0] + ' 00:00:00',
        },
      });
    }
  }

  // fileDownloadPossibleDateTimeEnd 체크 : optional
  if (typeof fileDownloadPossibleDateTimeEnd === 'string') {
    if (myDate(fileDownloadPossibleDateTimeEnd).isValid()) {
      if (!isFileDownloadUrlAllSearchPossible) {
        const isFileDownloadUrlDownloadPossibleDateTimeSearchPossible = await db.isActivePermission(loginInfo.userKey, 'xD1617691288301xOsvB');
        if (!isFileDownloadUrlDownloadPossibleDateTimeSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20046080,
              msg: myResultCode[20046080].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        fileDownloadPossibleDateTimeEnd: {
          [Op.lte]: fileDownloadPossibleDateTimeEnd.split(' ')[0] + ' 23:59:59',
        },
      });
    }
  }

  // fileDownloadLimitMaxCountStart 체크 : optional
  if (myCommon.isNumber(fileDownloadLimitMaxCountStart)) {
    if (!isFileDownloadUrlAllSearchPossible) {
      const isFileDownloadUrlDownloadLimitMaxCountSearchPossible = await db.isActivePermission(loginInfo.userKey, 'q1617691273028DpJblt');
      if (!isFileDownloadUrlDownloadLimitMaxCountSearchPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20046090,
            msg: myResultCode[20046090].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      fileDownloadLimitMaxCount: {
        [Op.gte]: Number(fileDownloadLimitMaxCountStart),
      },
    });
  }

  // fileDownloadLimitMaxCountEnd 체크 : optional
  if (myCommon.isNumber(fileDownloadLimitMaxCountEnd)) {
    if (!isFileDownloadUrlAllSearchPossible) {
      const isFileDownloadUrlDownloadLimitMaxCountSearchPossible = await db.isActivePermission(loginInfo.userKey, 'q1617691273028DpJblt');
      if (!isFileDownloadUrlDownloadLimitMaxCountSearchPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20046100,
            msg: myResultCode[20046100].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      fileDownloadLimitMaxCount: {
        [Op.lte]: Number(fileDownloadLimitMaxCountEnd),
      },
    });
  }

  // fileDownloadCountStart 체크 : optional
  if (myCommon.isNumber(fileDownloadCountStart)) {
    if (!isFileDownloadUrlAllSearchPossible) {
      const isFileDownloadUrlDownloadCountSearchPossible = await db.isActivePermission(loginInfo.userKey, 'VJLb1619349481831LuX');
      if (!isFileDownloadUrlDownloadCountSearchPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20046110,
            msg: myResultCode[20046110].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      fileDownloadCount: {
        [Op.gte]: Number(fileDownloadCountStart),
      },
    });
  }

  // fileDownloadCountEnd 체크 : optional
  if (myCommon.isNumber(fileDownloadCountEnd)) {
    if (!isFileDownloadUrlAllSearchPossible) {
      const isFileDownloadUrlDownloadCountSearchPossible = await db.isActivePermission(loginInfo.userKey, 'VJLb1619349481831LuX');
      if (!isFileDownloadUrlDownloadCountSearchPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20046120,
            msg: myResultCode[20046120].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      fileDownloadCount: {
        [Op.lte]: Number(fileDownloadCountEnd),
      },
    });
  }

  // fileDownloadUrlAccessConditionType 체크 : optional
  // 서브 쿼리 들어가야 함...
  if (typeof fileDownloadUrlAccessConditionType === 'string') {
    if (!isFileDownloadUrlAllSearchPossible) {
      const isFileDownloadUrlAccessConditionTypeSearchPossible = await db.isActivePermission(loginInfo.userKey, 'mdoI1617691317329jJl');
      if (!isFileDownloadUrlAccessConditionTypeSearchPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20046130,
            msg: myResultCode[20046130].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      fileDownloadUrlKey: {
        [Op.eq]: db.Sequelize.literal(`(
          SELECT 

          \`FmsFileDownloadUrlAccessConditions\`.\`fileDownloadUrlKey\`

          FROM \`FmsFileDownloadUrlAccessConditions\` AS \`FmsFileDownloadUrlAccessConditions\` 

          WHERE \`FmsFileDownloadUrlAccessConditions\`.\`fileDownloadUrlKey\` = \`FmsFileDownloadUrls\`.\`fileDownloadUrlKey\` 
          AND \`FmsFileDownloadUrlAccessConditions\`.\`conditionType\` = ${db.sequelize.escape(fileDownloadUrlAccessConditionType)}

          LIMIT 1
        )`),
      },
    });
  }

  if (Array.isArray(fileDownloadUrlAccessConditionType)) {
    const fileDownloadUrlAccessConditionTypeReal = [];

    for (let i = 0; i < fileDownloadUrlAccessConditionType.length; i++) {
      if (typeof fileDownloadUrlAccessConditionType[i] !== 'string') {
        continue;
      }

      if (fileDownloadUrlAccessConditionType[i].trim() === '') {
        continue;
      }

      if (fileDownloadUrlAccessConditionType[i].length !== 13) {
        continue;
      }

      fileDownloadUrlAccessConditionTypeReal.push(db.sequelize.escape(fileDownloadUrlAccessConditionType[i]));
    }

    if (fileDownloadUrlAccessConditionTypeReal.length > 0) {
      if (!isFileDownloadUrlAllSearchPossible) {
        const isFileDownloadUrlAccessConditionTypeSearchPossible = await db.isActivePermission(loginInfo.userKey, 'mdoI1617691317329jJl');
        if (!isFileDownloadUrlAccessConditionTypeSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20046140,
              msg: myResultCode[20046140].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        fileDownloadUrlKey: {
          [Op.eq]: db.Sequelize.literal(`(
            SELECT 
  
            \`FmsFileDownloadUrlAccessConditions\`.\`fileDownloadUrlKey\`
  
            FROM \`FmsFileDownloadUrlAccessConditions\` AS \`FmsFileDownloadUrlAccessConditions\` 
  
            WHERE \`FmsFileDownloadUrlAccessConditions\`.\`fileDownloadUrlKey\` = \`FmsFileDownloadUrls\`.\`fileDownloadUrlKey\` 
            AND \`FmsFileDownloadUrlAccessConditions\`.\`conditionType\` IN (${fileDownloadUrlAccessConditionTypeReal.join(',')})
  
            LIMIT 1
          )`),
        },
      });
    }
  }

  // fileDownloadUrlStatus 체크 : optional
  if (typeof fileDownloadUrlStatus === 'string') {
    if (fileDownloadUrlStatus.trim() !== '' && fileDownloadUrlStatus.length === 13) {
      if (!isFileDownloadUrlAllSearchPossible) {
        const isFileDownloadUrlStatusSearchPossible = await db.isActivePermission(loginInfo.userKey, 'Nd1617691331094UeXXb');
        if (!isFileDownloadUrlStatusSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20046150,
              msg: myResultCode[20046150].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        fileDownloadUrlStatus: {
          [Op.eq]: fileDownloadUrlStatus,
        },
      });
    }
  }

  if (Array.isArray(fileDownloadUrlStatus)) {
    const fileDownloadUrlStatusReal = [];

    for (let i = 0; i < fileDownloadUrlStatus.length; i++) {
      if (typeof fileDownloadUrlStatus[i] !== 'string') {
        continue;
      }

      if (fileDownloadUrlStatus[i].trim() === '') {
        continue;
      }

      if (fileDownloadUrlStatus[i].length !== 13) {
        continue;
      }

      fileDownloadUrlStatusReal.push(fileDownloadUrlStatus[i]);
    }

    if (fileDownloadUrlStatusReal.length > 0) {
      if (!isFileDownloadUrlAllSearchPossible) {
        const isFileDownloadUrlStatusSearchPossible = await db.isActivePermission(loginInfo.userKey, 'Nd1617691331094UeXXb');
        if (!isFileDownloadUrlStatusSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20046160,
              msg: myResultCode[20046160].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        fileDownloadUrlStatus: {
          [Op.in]: fileDownloadUrlStatus,
        },
      });
    }
  }














  // page 체크
  if (page === undefined) {
    pageReal = 1;
  }

  if (typeof page === 'string') {
    if (page.trim() === '') {
      pageReal = 1;
    }

    if (isNaN(Number(page))) {
      pageReal = 1;
    }
  }

  // pageViewCount 체크
  if (pageViewCount === undefined) {
    pageViewCountReal = 10;
  }

  if (typeof pageViewCount === 'string') {
    if (pageViewCount.trim() === '') {
      pageViewCountReal = 10;
    }

    if (isNaN(Number(pageViewCount))) {
      pageViewCountReal = 10;
    }
  }

  // viewCount 체크
  if (viewCount === undefined) {
    viewCountReal = 10;
  }

  if (typeof viewCount === 'string') {
    if (viewCount.trim() === '') {
      viewCountReal = 10;
    }

    if (isNaN(Number(viewCount))) {
      viewCountReal = 10;
    }
  }

  // 리스트 가져오기
  /*
    include (join) 대상에 대한 조건이 없다면, OUTER JOIN
    include (join) 대상에 대한 조건이 있다면, INNER JOIN
  */
  if (targetUserWhereOpAndArray.length > 0 ){
    targetUserRequired = true;
  }
  if (fileWhereOpAndArray.length > 0) {
    fileRequired = true;
  }
  if (fileVersionWhereOpAndArray.length > 0) {
    fileVersionRequired = true;
  }
  if (createrUserWhereOpAndArray.length > 0) {
    createrUserRequired = true;
  }
  if (updaterUserWhereOpAndArray.length > 0) {
    updaterUserRequired = true;
  }
  where[Op.and] = OpAndArray;
  where.isDeletedRow = 'N';
  order.push(['createdAt', 'DESC']);

  // includes.push({
  //   as: 'FmsFileDownloadUrlTargetUsers',
  //   model: db.FmsUsers,
  //   attributes: ['userKey', 'userId', 'userName'],
  //   required: targetUserRequired,
  //   where: {
  //     [Op.and]: targetUserWhereOpAndArray,
  //   },
  // });
  // includes.push({
  //   as: 'FmsTargetFiles',
  //   model: db.FmsFiles,
  //   attributes: ['fileKey', 'fileLabelName'],
  //   required: fileRequired,
  //   where: {
  //     [Op.and]: fileWhereOpAndArray,
  //   },
  // });
  // includes.push({
  //   as: 'FmsTargetFileVersions',
  //   model: db.FmsFileVersions,
  //   attributes: ['fileVersionKey', 'fileKey', 'fileVersionName', 'fileVersionCode'],
  //   required: fileVersionRequired,
  //   where: {
  //     [Op.and]: fileVersionWhereOpAndArray,
  //   },
  // });
  // includes.push({
  //   as: 'FmsCreaterUsers',
  //   model: db.FmsUsers,
  //   attributes: ['userKey', 'userId', 'userName'],
  //   required: createrUserRequired,
  //   where: {
  //     [Op.and]: createrUserWhereOpAndArray,
  //   },
  // });
  // includes.push({
  //   as: 'FmsUpdaterUsers',
  //   model: db.FmsUsers,
  //   attributes: ['userKey', 'userId', 'userName'],
  //   required: updaterUserRequired,
  //   where: {
  //     [Op.and]: updaterUserWhereOpAndArray,
  //   },
  // });



  // 전체 리스트 가져오기 (전체 갯수)
  const totalResult = await db.FmsFileDownloadUrls.findAndCountAll({
    where: where,
    order: order,
    include: [
      {
        as: 'FmsFileDownloadUrlTargetUsers',
        model: db.FmsUsers,
        attributes: ['userKey', 'userId', 'userName'],
        required: targetUserRequired,
        where: {
          [Op.and]: targetUserWhereOpAndArray,
        },
      },
      {
        as: 'FmsTargetFiles',
        model: db.FmsFiles,
        attributes: ['fileKey', 'fileLabelName'],
        required: fileRequired,
        where: {
          [Op.and]: fileWhereOpAndArray,
        },
      },
      {
        as: 'FmsTargetFileVersions',
        model: db.FmsFileVersions,
        attributes: ['fileVersionKey', 'fileKey', 'fileVersionName', 'fileVersionCode'],
        required: fileVersionRequired,
        where: {
          [Op.and]: fileVersionWhereOpAndArray,
        },
      },
      {
        as: 'FmsCreaterUsers',
        model: db.FmsUsers,
        attributes: ['userKey', 'userId', 'userName'],
        required: createrUserRequired,
        where: {
          [Op.and]: createrUserWhereOpAndArray,
        },
      },
      {
        as: 'FmsUpdaterUsers',
        model: db.FmsUsers,
        attributes: ['userKey', 'userId', 'userName'],
        required: updaterUserRequired,
        where: {
          [Op.and]: updaterUserWhereOpAndArray,
        },
      },
      {
        as: 'FmsFileDownloadUrlStatusCodes',
        model: db.FmsCodes,
        attributes: ['code', 'codeName'],
      },
    ],
  });
  const totalCount = totalResult.count;

  // (1)
  const getPageGroupInfo = myBoard.getPageGroupInfo({
    req: req,
    page: pageReal,
    pageViewCount: pageViewCountReal,
    viewCount: viewCountReal,
  });
  /*
    getPageGroupInfo.pageStartNumber
    getPageGroupInfo.pageEndNumber
    getPageGroupInfo.startIndex
    getPageGroupInfo.pageLength
  */

  // (2)
  const getBoardCountInfo = myBoard.getBoardCountInfo({
    req: req,
    page: pageReal,
    pageViewCount: pageViewCountReal,
    viewCount: viewCountReal,
    pageGroupTotalCount: 0,
    totalCount: totalCount,
    pageStartNumber: getPageGroupInfo.pageStartNumber,
    pageEndNumber: getPageGroupInfo.pageEndNumber,
  });
  /*
    getBoardCountInfo.showPages
    getBoardCountInfo.isPrevExist
    getBoardCountInfo.isNextExist
    getBoardCountInfo.prevPage
    getBoardCountInfo.nextPage
    getBoardCountInfo.lastPageNum
  */

  // (3)
  const getPageInfo = myBoard.getPageInfo({
    req: req,
    page: pageReal,
    pageViewCount: pageViewCountReal,
    viewCount: viewCountReal,
  });
  /*
    getPageInfo.startIndex
    getPageInfo.pageLength 
  */

  const activePermissionKeys = await db.isActivePermissions(loginInfo.userKey, [
    'wN1617691374902fVQZj', // fileDownloadUrlKey
    'Oo1617691389632JKoWM', // 타겟 계정 ID
    'f1617691404392ERzflF', // 버전명
    'QyRNVuf1617691418624', // URL 접근 총 횟수
    'dI1617691432796fQpqX', // 다운로드 제한 기간
    'cLEUrrW1617691447795', // 다운로드 제한 횟수
    'PD1617691464911EKhTL', // 현재 다운로드 된 수
    'CVWk1617691479896GIj', // URL 생성일
    'bezBsTe1617691493886', // URL 상태
    'lpIglo1617691523078e', // 다운로드 (접근)제한 표시
  ]);
  const FmsFileDownloadUrlsAttributes = ['seq'];
  const FmsFileDownloadUrlTargetUsersAttributes = [];
  const FmsTargetFilesAttributes = [];
  const FmsTargetFileVersionsAttributes = [];
  const FmsCreaterUsersAttributes = [];
  const FmsUpdaterUsersAttributes = [];
  const FmsFileDownloadUrlStatusCodesAttributes = [];

  activePermissionKeys.includes('wN1617691374902fVQZj') ? FmsFileDownloadUrlsAttributes.push('fileDownloadUrlKey') : null;
  if (activePermissionKeys.includes('Oo1617691389632JKoWM')) {
    FmsFileDownloadUrlsAttributes.push('downloadTargetUserKey');
    FmsFileDownloadUrlTargetUsersAttributes.push('userKey');
    FmsFileDownloadUrlTargetUsersAttributes.push('userId');
  }
  if (activePermissionKeys.includes('f1617691404392ERzflF')) {
    FmsFileDownloadUrlsAttributes.push('fileVersionKey');
    FmsTargetFileVersionsAttributes.push('fileVersionKey');
    FmsTargetFileVersionsAttributes.push('fileVersionName');
  }
  activePermissionKeys.includes('QyRNVuf1617691418624') ? FmsFileDownloadUrlsAttributes.push('fileDownloadUrlAccessCount') : null;
  if (activePermissionKeys.includes('dI1617691432796fQpqX')) {
    FmsFileDownloadUrlsAttributes.push('fileDownloadPossibleDateTimeStart');
    FmsFileDownloadUrlsAttributes.push('fileDownloadPossibleDateTimeEnd');
  }
  activePermissionKeys.includes('cLEUrrW1617691447795') ? FmsFileDownloadUrlsAttributes.push('fileDownloadLimitMaxCount') : null;
  activePermissionKeys.includes('PD1617691464911EKhTL') ? FmsFileDownloadUrlsAttributes.push('fileDownloadCount') : null;
  activePermissionKeys.includes('CVWk1617691479896GIj') ? FmsFileDownloadUrlsAttributes.push('createdAt') : null;
  if (activePermissionKeys.includes('bezBsTe1617691493886')) {
    FmsFileDownloadUrlsAttributes.push('fileDownloadUrlStatus');
    FmsFileDownloadUrlStatusCodesAttributes.push('code');
    FmsFileDownloadUrlStatusCodesAttributes.push('codeName');
  }

  const list = await db.FmsFileDownloadUrls.findAll({
    attributes: FmsFileDownloadUrlsAttributes,
    // attributes: [
    //   'fileDownloadUrlKey', 'downloadTargetUserKey', 'fileKey', 'fileVersionKey',
    //   'fileDownloadUrlAccessCount', 'fileDownloadPossibleDateTimeStart', 'fileDownloadPossibleDateTimeEnd', 
    //   'fileDownloadLimitMaxCount', 'fileDownloadCount', 'createdAt', 'createdIp', 'createrUserKey', 
    //   'updatedAt', 'updatedIp', 'updaterUserKey', 'fileDownloadUrlStatus',
    // ],
    where: where,
    order: order,
    include: [
      {
        as: 'FmsFileDownloadUrlTargetUsers',
        model: db.FmsUsers,
        attributes: FmsFileDownloadUrlTargetUsersAttributes,
        // attributes: ['userKey', 'userId', 'userName'],
        required: targetUserRequired,
        where: {
          [Op.and]: targetUserWhereOpAndArray,
        },
      },
      {
        as: 'FmsTargetFiles',
        model: db.FmsFiles,
        attributes: FmsTargetFilesAttributes,
        // attributes: ['fileKey', 'fileLabelName'],
        required: fileRequired,
        where: {
          [Op.and]: fileWhereOpAndArray,
        },
      },
      {
        as: 'FmsTargetFileVersions',
        model: db.FmsFileVersions,
        attributes: FmsTargetFileVersionsAttributes,
        // attributes: ['fileVersionKey', 'fileKey', 'fileVersionName', 'fileVersionCode'],
        required: fileVersionRequired,
        where: {
          [Op.and]: fileVersionWhereOpAndArray,
        },
      },
      {
        as: 'FmsCreaterUsers',
        model: db.FmsUsers,
        attributes: FmsCreaterUsersAttributes,
        // attributes: ['userKey', 'userId', 'userName'],
        required: createrUserRequired,
        where: {
          [Op.and]: createrUserWhereOpAndArray,
        },
      },
      {
        as: 'FmsUpdaterUsers',
        model: db.FmsUsers,
        attributes: FmsUpdaterUsersAttributes,
        // attributes: ['userKey', 'userId', 'userName'],
        required: updaterUserRequired,
        where: {
          [Op.and]: updaterUserWhereOpAndArray,
        },
      },
      {
        as: 'FmsFileDownloadUrlStatusCodes',
        model: db.FmsCodes,
        attributes: FmsFileDownloadUrlStatusCodesAttributes,
        // attributes: ['code', 'codeName'],
      },
    ],
    offset: getPageInfo.startIndex,
    limit: getPageInfo.pageLength,
  });

  if (activePermissionKeys.includes('lpIglo1617691523078e')) {
    for (let i = 0; i < list.length; i++) {
      // console.log('list['+i+']', list[i]);
      if (typeof list[i].dataValues.fileDownloadUrlKey !== 'string') {
        continue;
      }

      const conditions = await db.FmsFileDownloadUrlAccessConditions.findAll({
        attributes: ['conditionType'],
        where: {
          fileDownloadUrlKey: list[i].dataValues.fileDownloadUrlKey,
          isDeletedRow: 'N',
        },
        include: [
          {
            as: 'FmsFileDownloadAccessConditionTypeCodes',
            model: db.FmsCodes,
            attributes: ['code', 'codeName'],
          },
        ],
        group: ['conditionType'],
      });

      list[i].dataValues.conditions = conditions;
    }
  }

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      list: list,
      totalCount: totalCount,
      getBoardCountInfo: getBoardCountInfo,
    },
  }));
  return;
});

module.exports = getFileDownloadUrl;
