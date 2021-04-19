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

  const {
    fileDownloadUrlKey,
    downloadTargetUserKey,
    downloadTargetUserId,
    downloadTargetUserName,
    fileKey,
    fileLabelName,
    fileVersionKey,
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

  const includes = [];










  // fileDownloadUrlKey 체크 : optional
  if (typeof fileDownloadUrlKey === 'string') {
    if (fileDownloadUrlKey.trim() !== '' && fileDownloadUrlKey.length === 20) {
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
      OpAndArray.push({
        fileVersionKey: {
          [Op.in]: fileVersionKey,
        },
      });
    }
  }

  // fileDownloadUrlAccessCountStart 체크 : optional
  if (myCommon.isNumber(fileDownloadUrlAccessCountStart)) {
    OpAndArray.push({
      fileDownloadUrlAccessCount: {
        [Op.gte]: Number(fileDownloadUrlAccessCountStart),
      },
    });
  }

  // fileDownloadUrlAccessCountEnd 체크 : optional
  if (myCommon.isNumber(fileDownloadUrlAccessCountEnd)) {
    OpAndArray.push({
      fileDownloadUrlAccessCount: {
        [Op.lte]: Number(fileDownloadUrlAccessCountEnd),
      },
    });
  }

  // fileDownloadPossibleDateTimeStart 체크 : optional
  if (typeof fileDownloadPossibleDateTimeStart === 'string') {
    if (myDate(fileDownloadPossibleDateTimeStart).isValid()) {
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
      OpAndArray.push({
        fileDownloadPossibleDateTimeEnd: {
          [Op.lte]: fileDownloadPossibleDateTimeEnd.split(' ')[0] + ' 23:59:59',
        },
      });
    }
  }

  // fileDownloadLimitMaxCountStart 체크 : optional
  if (myCommon.isNumber(fileDownloadLimitMaxCountStart)) {
    OpAndArray.push({
      fileDownloadLimitMaxCount: {
        [Op.gte]: Number(fileDownloadLimitMaxCountStart),
      },
    });
  }

  // fileDownloadLimitMaxCountEnd 체크 : optional
  if (myCommon.isNumber(fileDownloadLimitMaxCountEnd)) {
    OpAndArray.push({
      fileDownloadLimitMaxCount: {
        [Op.lte]: Number(fileDownloadLimitMaxCountEnd),
      },
    });
  }

  // fileDownloadCountStart 체크 : optional
  if (myCommon.isNumber(fileDownloadCountStart)) {
    OpAndArray.push({
      fileDownloadCount: {
        [Op.gte]: Number(fileDownloadCountStart),
      },
    });
  }

  // fileDownloadCountEnd 체크 : optional
  if (myCommon.isNumber(fileDownloadCountEnd)) {
    OpAndArray.push({
      fileDownloadCount: {
        [Op.lte]: Number(fileDownloadCountEnd),
      },
    });
  }

  // fileDownloadUrlAccessConditionType 체크 : optional
  // 서브 쿼리 들어가야 함...
  if (typeof fileDownloadUrlAccessConditionType === 'string') {
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

  includes.push({
    as: 'FmsFileDownloadUrlTargetUsers',
    model: db.FmsUsers,
    attributes: ['userKey', 'userId', 'userName'],
    required: targetUserRequired,
    where: {
      [Op.and]: targetUserWhereOpAndArray,
    },
  });
  includes.push({
    as: 'FmsTargetFiles',
    model: db.FmsFiles,
    attributes: ['fileKey', 'fileLabelName'],
    required: fileRequired,
    where: {
      [Op.and]: fileWhereOpAndArray,
    },
  });
  includes.push({
    as: 'FmsTargetFileVersions',
    model: db.FmsFileVersions,
    attributes: ['fileVersionKey', 'fileKey', 'fileVersionName', 'fileVersionCode'],
    required: fileVersionRequired,
    where: {
      [Op.and]: fileVersionWhereOpAndArray,
    },
  });
  includes.push({
    as: 'FmsCreaterUsers',
    model: db.FmsUsers,
    attributes: ['userKey', 'userId', 'userName'],
    required: createrUserRequired,
    where: {
      [Op.and]: createrUserWhereOpAndArray,
    },
  });
  includes.push({
    as: 'FmsUpdaterUsers',
    model: db.FmsUsers,
    attributes: ['userKey', 'userId', 'userName'],
    required: updaterUserRequired,
    where: {
      [Op.and]: updaterUserWhereOpAndArray,
    },
  });



  // 전체 리스트 가져오기 (전체 갯수)
  const totalResult = await db.FmsFileDownloadUrls.findAndCountAll({
    where: where,
    order: order,
    include: includes,
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

  const list = await db.FmsFileDownloadUrls.findAll({
    attributes: [
      'fileDownloadUrlKey', 'downloadTargetUserKey', 'fileKey', 'fileVersionKey',
      'fileDownloadUrlAccessCount', 'fileDownloadPossibleDateTimeStart', 'fileDownloadPossibleDateTimeEnd', 
      'fileDownloadLimitMaxCount', 'fileDownloadCount', 'createdAt', 'createdIp', 'createrUserKey', 
      'updatedAt', 'updatedIp', 'updaterUserKey', 'fileDownloadUrlStatus',
    ],
    where: where,
    order: order,
    include: includes,
    offset: getPageInfo.startIndex,
    limit: getPageInfo.pageLength,
  });

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
