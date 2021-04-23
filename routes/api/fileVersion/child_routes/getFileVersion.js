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

const getFileVersion = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const isFileVersionListPossible = await db.isActivePermission(loginInfo.userKey, 'XPebmV1619179187706G');
  if (!isFileVersionListPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20033010,
        msg: myResultCode[20033010].msg,
      },
    }));
    return;
  }


  const {
    fileVersionKey, // string 또는 string[]
    fileKey, // string 또는 string[]
    fileLabelName, // string 또는 string[]
    fileVersionName, // string 또는 string[]
    fileVersionCodeStart, // string 또는 string[] 또는 integer 또는 integer[]
    fileVersionCodeEnd, // string 또는 string[] 또는 integer 또는 integer[]
    fileOriginalName, // string 또는 string[]
    fileDownloadName, // string 또는 string[]
    fileVersionMemo, // string 또는 string[]
    fileVersionDescription, // string 또는 string[]
    fileSizeStart, // string 또는 string[]
    fileSizeEnd, // string 또는 string[]
    fileMimeType, // string 또는 string[]
    createrUserKey, // string 또는 string[]
    createrUserName, // string 또는 string[]
    createdAtStart, // string 또는 string[]
    createdAtEnd, // string 또는 string[]
    createdIp, // string 또는 string[]
    updaterUserKey, // string 또는 string[]
    updaterUserName, // string 또는 string[]
    updatedAtStart, // string 또는 string[]
    updatedAtEnd, // string 또는 string[]
    updatedIp, // string 또는 string[]
    fileVersionStatus, // string 또는 string[]

    page, // 요청온 페이지 숫자
    pageViewCount, // 한번에 표시되는 페이징 수
    viewCount, // 한번에 표시되는 게시글 수
  } = req.body;

  let pageReal = Number(page);
  let pageViewCountReal = Number(pageViewCount);
  let viewCountReal = Number(viewCount);

  const where = {};

  const fileWhereOpAndArray = [];
  let fileRequired = false;

  const createrUserWhereOpAndArray = [];
  let createrUserRequired = false;

  const updaterUserWhereOpAndArray = [];
  let updaterUserRequired = false;

  const order = [];
  const OpAndArray = [];



  // loginInfo.userLevel 체크
  if (loginInfo.userLevel !== 'USLEV00000001') {
    OpAndArray.push({
      createrUserKey: loginInfo.userKey,
    });
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
          [Op.in]: fileVersionKeyReal,
        },
      });
    }
  }

  // fileKey 체크 : optional
  if (typeof fileKey === 'string') {
    if (fileKey.trim() !== '' && fileKey.length !== 20) {
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
          [Op.in]: fileKeyReal,
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

  // fileVersionName 체크 : optional
  if (typeof fileVersionName === 'string') {
    if (fileVersionName.trim() !== '') {
      OpAndArray.push({
        fileVersionName: {
          [Op.substring]: myCommon.specialCharEscape(fileVersionName),
        },
      });
    }
  }

  if (Array.isArray(fileVersionName)) {
    const fileVersionNameReal = [];
    for (let i = 0; i < fileVersionName.length; i++) {
      if (typeof fileVersionName[i] !== 'string') {
        continue;
      }

      if (fileVersionName[i].trim() === '') {
        continue;
      }

      fileVersionNameReal.push(fileVersionName[i]);
    }

    if (fileVersionNameReal.length > 0) {
      OpAndArray.push({
        [Op.or]: fileVersionNameReal.map((x) => {
          return {
            fileVersionName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // fileVersionCodeStart 체크 : optional
  if (myCommon.isNumber(fileVersionCodeStart)) {
    OpAndArray.push({
      fileVersionCode: {
        [Op.gte]: Number(fileVersionCodeStart),
      },
    });
  }

  // fileVersionCodeEnd 체크 : optional
  if (myCommon.isNumber(fileVersionCodeEnd)) {
    OpAndArray.push({
      fileVersionCode: {
        [Op.lte]: Number(fileVersionCodeEnd),
      },
    });
  }

  // fileOriginalName 체크 : optional
  if (typeof fileOriginalName === 'string') {
    if (fileOriginalName.trim() !== '') {
      OpAndArray.push({
        fileOriginalName: {
          [Op.substring]: myCommon.specialCharEscape(fileOriginalName),
        },
      });
    }
  }

  if (Array.isArray(fileOriginalName)) {
    const fileOriginalNameReal = [];
    for (let i = 0; i < fileOriginalName.length; i++) {
      if (typeof fileOriginalName[i] !== 'string') {
        continue;
      }

      if (fileOriginalName[i].trim() === '') {
        continue;
      }

      fileOriginalNameReal.push(fileOriginalName[i]);
    }

    if (fileOriginalNameReal.length > 0) {
      OpAndArray.push({
        [Op.or]: fileOriginalNameReal.map((x) => {
          return {
            fileOriginalName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // fileDownloadName 체크 : optional
  if (typeof fileDownloadName === 'string') {
    if (fileDownloadName.trim() !== '') {
      OpAndArray.push({
        fileDownloadName: {
          [Op.substring]: myCommon.specialCharEscape(fileDownloadName),
        },
      });
    }
  }

  if (Array.isArray(fileDownloadName)) {
    const fileDownloadNameReal = [];
    for (let i = 0; i < fileDownloadName.length; i++) {
      if (typeof fileDownloadName[i] !== 'string') {
        continue;
      }

      if (fileDownloadName[i].trim() === '') {
        continue;
      }

      fileDownloadNameReal.push(fileDownloadName[i]);
    }

    if (fileDownloadNameReal.length > 0) {
      OpAndArray.push({
        [Op.or]: fileDownloadNameReal.map((x) => {
          return {
            fileDownloadName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // fileVersionMemo 체크 : optional
  if (typeof fileVersionMemo === 'string') {
    if (fileVersionMemo.trim() !== '') {
      OpAndArray.push({
        fileVersionMemo: {
          [Op.substring]: myCommon.specialCharEscape(fileVersionMemo),
        },
      });
    }
  }

  if (Array.isArray(fileVersionMemo)) {
    const fileVersionMemoReal = [];
    for (let i = 0; i < fileVersionMemo.length; i++) {
      if (typeof fileVersionMemo[i] !== 'string') {
        continue;
      }

      if (fileVersionMemo[i].trim() === '') {
        continue;
      }

      fileVersionMemoReal.push(fileVersionMemo[i]);
    }

    if (fileVersionMemoReal.length > 0) {
      OpAndArray.push({
        [Op.or]: fileVersionMemoReal.map((x) => {
          return {
            fileVersionMemo: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // fileVersionDescription 체크 : optional
  if (typeof fileVersionDescription === 'string') {
    if (fileVersionDescription.trim() !== '') {
      OpAndArray.push({
        fileVersionDescription: {
          [Op.substring]: myCommon.specialCharEscape(fileVersionDescription),
        },
      });
    }
  }

  if (Array.isArray(fileVersionDescription)) {
    const fileVersionDescriptionReal = [];
    for (let i = 0; i < fileVersionDescription.length; i++) {
      if (typeof fileVersionDescription[i] !== 'string') {
        continue;
      }

      if (fileVersionDescription[i].trim() === '') {
        continue;
      }

      fileVersionDescriptionReal.push(fileVersionDescription[i]);
    }

    if (fileVersionDescriptionReal.length > 0) {
      OpAndArray.push({
        [Op.or]: fileVersionDescriptionReal.map((x) => {
          return {
            fileVersionDescription: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // fileSizeStart 체크 : optional
  if (myCommon.isNumber(fileSizeStart)) {
    OpAndArray.push({
      fileSize: {
        [Op.gte]: Number(fileSizeStart),
      },
    });
  }

  // fileSizeEnd 체크 : optional
  if (myCommon.isNumber(fileSizeEnd)) {
    OpAndArray.push({
      fileSize: {
        [Op.lte]: Number(fileSizeEnd),
      },
    });
  }

  // fileMimeType 체크 : optional
  if (typeof fileMimeType === 'string') {
    if (fileMimeType.trim() !== '') {
      OpAndArray.push({
        fileMimeType: {
          [Op.substring]: myCommon.specialCharEscape(fileMimeType),
        },
      });
    }
  }

  if (Array.isArray(fileMimeType)) {
    const fileMimeTypeReal = [];
    for (let i = 0; i < fileMimeType.length; i++) {
      if (typeof fileMimeType[i] !== 'string') {
        continue;
      }

      if (fileMimeType[i].trim() === '') {
        continue;
      }

      fileMimeTypeReal.push(fileMimeType[i]);
    }

    if (fileMimeTypeReal.length > 0) {
      OpAndArray.push({
        [Op.or]: fileMimeTypeReal.map((x) => {
          return {
            fileMimeType: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // createrUserKey 체크 : optional
  if (typeof createrUserKey === 'string') {
    if (createrUserKey.trim() !== '' && createrUserKey.length === 20) {
      OpAndArray.push({
        createrUserKey: {
          [Op.eq]: createrUserKey,
        },
      });
    }
  }

  if (Array.isArray(createrUserKey)) {
    const createrUserKeyReal = [];
    for (let i = 0; i < createrUserKey.length; i++) {
      if (typeof createrUserKey[i] !== 'string') {
        continue;
      }

      if (createrUserKey[i].trim() === '') {
        continue;
      }

      if (createrUserKey[i].length !== 20) {
        continue;
      }

      createrUserKeyReal.push(createrUserKey[i]);
    }

    if (createrUserKeyReal.length > 0) {
      OpAndArray.push({
        createrUserKey: {
          [Op.in]: createrUserKeyReal,
        },
      });
    }
  }
  
  // createrUserName 체크 : optional
  if (typeof createrUserName === 'string') {
    if (createrUserName.trim() !== '') {
      createrUserWhereOpAndArray.push({
        userName: {
          [Op.substring]: myCommon.specialCharEscape(createrUserName),
        },
      });
    }
  }

  if (Array.isArray(createrUserName)) {
    const createrUserNameReal = [];
    for (let i = 0; i < createrUserName.length; i++) {
      if (typeof createrUserName[i] !== 'string') {
        continue;
      }

      if (createrUserName[i].trim() === '') {
        continue;
      }

      createrUserNameReal.push(createrUserName[i]);
    }

    if (createrUserNameReal.length > 0) {
      createrUserWhereOpAndArray.push({
        [Op.or]: createrUserNameReal.map((x) => {
          return {
            userName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // createdAtStart 체크 : optional
  if (typeof createdAtStart === 'string') {
    if (myDate(createdAtStart).isValid()) {
      OpAndArray.push({
        createdAt: {
          [Op.gte]: createdAtStart,
        },
      });
    }
  }

  // createdAtEnd 체크 : optional
  if (typeof createdAtEnd === 'string') {
    if (myDate(createdAtEnd).isValid()) {
      OpAndArray.push({
        createdAt: {
          [Op.lte]: createdAtEnd,
        },
      });
    }
  }

  // createdIp 체크 : optional
  if (typeof createdIp === 'string') {
    if (createdIp.trim() !== '') {
      OpAndArray.push({
        createdIp: {
          [Op.substring]: myCommon.specialCharEscape(createdIp),
        },
      });
    }
  }

  if (Array.isArray(createdIp)) {
    const createdIpReal = [];
    for (let i = 0; i < createdIp.length; i++) {
      if (typeof createdIp[i] !== 'string') {
        continue;
      }

      if (createdIp[i].trim() === '') {
        continue;
      }

      createdIpReal.push(createdIp[i]);
    }

    if (createdIpReal.length > 0) {
      OpAndArray.push({
        [Op.or]: createdIpReal.map((x) => {
          return {
            createdIp: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // updaterUserKey 체크 : optional
  if (typeof updaterUserKey === 'string') {
    if (updaterUserKey.trim() !== '' && updaterUserKey.length === 20) {
      OpAndArray.push({
        updaterUserKey: {
          [Op.eq]: updaterUserKey,
        },
      });
    }
  }

  if (Array.isArray(updaterUserKey)) {
    const updaterUserKeyReal = [];
    for (let i = 0; i < updaterUserKey.length; i++) {
      if (typeof updaterUserKey[i] !== 'string') {
        continue;
      }

      if (updaterUserKey[i].trim() === '') {
        continue;
      }

      if (updaterUserKey[i].length !== 20) {
        continue;
      }

      updaterUserKeyReal.push(updaterUserKey[i]);
    }

    if (updaterUserKeyReal.length > 0) {
      OpAndArray.push({
        updaterUserKey: {
          [Op.in]: updaterUserKeyReal,
        },
      });
    }
  }

  // updaterUserName 체크 : optional
  if (typeof updaterUserName === 'string') {
    if (updaterUserName.trim() !== '') {
      updaterUserWhereOpAndArray.push({
        userName: {
          [Op.substring]: myCommon.specialCharEscape(updaterUserName),
        },
      });
    }
  }

  if (Array.isArray(updaterUserName)) {
    const updaterUserNameReal = [];
    for (let i = 0; i < updaterUserName.length; i++) {
      if (typeof updaterUserName[i] !== 'string') {
        continue;
      }

      if (updaterUserName[i].trim() === '') {
        continue;
      }

      updaterUserNameReal.push(updaterUserName[i]);
    }

    if (updaterUserNameReal.length > 0) {
      updaterUserWhereOpAndArray.push({
        [Op.or]: updaterUserNameReal.map((x) => {
          return {
            userName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // updatedAtStart 체크 : optional
  if (typeof updatedAtStart === 'string') {
    if (myDate(updatedAtStart).isValid()) {
      OpAndArray.push({
        updatedAt: {
          [Op.gte]: updatedAtStart,
        },
      });
    }
  }

  // updatedAtEnd 체크 : optional
  if (typeof updatedAtEnd === 'string') {
    if (myDate(updatedAtEnd).isValid()) {
      OpAndArray.push({
        updatedAt: {
          [Op.lte]: updatedAtEnd,
        },
      });
    }
  }

  // updatedIp 체크 : optional
  if (typeof updatedIp === 'string') {
    if (updatedIp.trim() !== '') {
      OpAndArray.push({
        updatedIp: {
          [Op.substring]: myCommon.specialCharEscape(updatedIp),
        },
      });
    }
  }

  if (Array.isArray(updatedIp)) {
    const updatedIpReal = [];
    for (let i = 0; i < updatedIp.length; i++) {
      if (typeof updatedIp[i] !== 'string') {
        continue;
      }

      if (updatedIp[i].trim() === '') {
        continue;
      }

      updatedIpReal.push(updatedIp[i]);
    }

    if (updatedIpReal.length > 0) {
      OpAndArray.push({
        [Op.or]: updatedIpReal.map((x) => {
          return {
            updatedIp: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // fileVersionStatus 체크 : optional
  if (typeof fileVersionStatus === 'string') {
    if (fileVersionStatus.trim() !== '' && fileVersionStatus.length === 13) {
      OpAndArray.push({
        fileVersionStatus: {
          [Op.eq]: fileVersionStatus,
        },
      });
    }
  }

  if (Array.isArray(fileVersionStatus)) {
    const fileVersionStatusReal = [];
    for (let i = 0; i < fileVersionStatus.length; i++) {
      if (typeof fileVersionStatus[i] !== 'string') {
        continue;
      }

      if (fileVersionStatus[i].trim() === '') {
        continue;
      }

      if (fileVersionStatus[i].length !== 13) {
        continue;
      }

      fileVersionStatusReal.push(fileVersionStatus[i]);
    }

    if (fileVersionStatusReal.length > 0) {
      OpAndArray.push({
        fileVersionStatus: {
          [Op.in]: fileVersionStatusReal,
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
  if (fileWhereOpAndArray.length > 0) {
    fileRequired = true;
  }
  if (createrUserWhereOpAndArray.length > 0) {
    createrUserRequired = true;
  }
  if (updaterUserWhereOpAndArray.length > 0) {
    updaterUserRequired = true;
  }
  where[Op.and] = OpAndArray;
  where.isDeletedRow = 'N';
  order.push(['fileKey', 'DESC']);
  order.push(['createdAt', 'DESC']);

  // 전체 리스트 가져오기 (전체 갯수)
  const totalResult = await db.FmsFileVersions.findAndCountAll({
    where: where,
    order: order,
    include: [
      {
        as: 'FmsFiles',
        model: db.FmsFiles,
        attributes: ['fileKey', 'fileLabelName'],
        required: fileRequired,
        where: {
          [Op.and]: fileWhereOpAndArray,
        },
      },
      {
        as: 'FmsCreaterUsers',
        model: db.FmsUsers,
        attributes: ['userKey', 'userName'],
        required: createrUserRequired,
        where: {
          [Op.and]: createrUserWhereOpAndArray,
        },
      },
      {
        as: 'FmsUpdaterUsers',
        model: db.FmsUsers,
        attributes: ['userKey', 'userName'],
        required: updaterUserRequired,
        where: {
          [Op.and]: updaterUserWhereOpAndArray,
        },
      },
      {
        as: 'FmsFileVersionStatusCodes',
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

  const list = await db.FmsFileVersions.findAll({
    attributes: [
      'fileVersionKey', 'fileKey', 'fileVersionName', 'fileVersionCode', 'fileOriginalName', 'fileDownloadName',
      'fileVersionMemo', 'fileVersionDescription', 'filePath', 'fileSize', 'fileMimeType', 'createrUserKey', 
      'createdAt', 'createdIp', 'updaterUserKey', 'updatedAt', 'updatedIp', 'fileVersionStatus',
    ],
    where: where,
    order: order,
    include: [
      {
        as: 'FmsFiles',
        model: db.FmsFiles,
        attributes: ['fileKey', 'fileLabelName'],
        required: fileRequired,
        where: {
          [Op.and]: fileWhereOpAndArray,
        },
      },
      {
        as: 'FmsCreaterUsers',
        model: db.FmsUsers,
        attributes: ['userKey', 'userName'],
        required: createrUserRequired,
        where: {
          [Op.and]: createrUserWhereOpAndArray,
        },
      },
      {
        as: 'FmsUpdaterUsers',
        model: db.FmsUsers,
        attributes: ['userKey', 'userName'],
        required: updaterUserRequired,
        where: {
          [Op.and]: updaterUserWhereOpAndArray,
        },
      },
      {
        as: 'FmsFileVersionStatusCodes',
        model: db.FmsCodes,
        attributes: ['code', 'codeName'],
      },
    ],
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

module.exports = getFileVersion;
