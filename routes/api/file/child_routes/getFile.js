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

const getFile = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const isFileListModifyPossible = await db.isActivePermission(loginInfo.userKey, 'XQSP1617689945699vvv');
  if (!isFileListModifyPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20029010,
        msg: myResultCode[20029010].msg,
      },
    }));
    return;
  }

  const isAllUserControl = await db.isActivePermission(loginInfo.userKey, 'IEjNkA1619012061260L');

  const {
    fileKey, 
    fileLabelName,
    fileMemo,
    fileDescription,
    fileStoreVersionHistoryOpen,
    fileStoreDescriptionOpen,
    createdAtStart,
    createdAtEnd,
    createdIp,
    createrUserKey,
    createrUserId,
    createrUserName,
    updatedAtStart,
    updatedAtEnd,
    updatedIp,
    updaterUserKey,
    updaterUserId,
    updaterUserName,
    fileStatus,

    page, // 요청온 페이지 숫자
    pageViewCount, // 한번에 표시되는 페이징 수
    viewCount, // 한번에 표시되는 게시글 수
  } = req.body;

  let pageReal = Number(page);
  let pageViewCountReal = Number(pageViewCount);
  let viewCountReal = Number(viewCount);

  const where = {};
  const createrUserWhereOpAndArray = [];
  let createrUserRequired = false;
  const updaterUserWhereOpAndArray = [];
  let updaterUserRequired = false;
  const order = [];
  const OpAndArray = [];

  

  if (!isAllUserControl) {
    OpAndArray.push({
      createrUserKey: {
        [Op.in]: await db.FmsUsers.getChildAllUserKeys(loginInfo.userKey),
      },
    });
  }
    
  // fileKey 체크 : optional
  if (typeof fileKey === 'string') {
    if (fileKey.trim() !== '' && fileKey.length === 20) {
      OpAndArray.push({
        fileKey:{
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
        fileKey:{
          [Op.in]: fileKeyReal,
        },
      });
    }
  }

  // fileLabelName 체크 : optional
  if (typeof fileLabelName === 'string') {
    if (fileLabelName.trim() !== '') {
      OpAndArray.push({
        fileLabelName:{
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
      OpAndArray.push({
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

  // fileMemo 체크 : optional
  if (typeof fileMemo === 'string') {
    if (fileMemo.trim() !== '') {
      OpAndArray.push({
        fileMemo:{
          [Op.substring]: myCommon.specialCharEscape(fileMemo),
        },
      });
    }
  }

  if (Array.isArray(fileMemo)) {
    const fileMemoReal = [];

    for (let i = 0; i < fileMemo.length; i++) {
      if (typeof fileMemo[i] !== 'string') {
        continue;
      }

      if (fileMemo[i].trim() === '') {
        continue;
      }

      fileMemoReal.push(fileMemo[i]);
    }

    if (fileMemoReal.length > 0) {
      OpAndArray.push({
        [Op.or]: fileMemoReal.map((x) => {
          return {
            fileMemo: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // fileDescription 체크 : optional
  if (typeof fileDescription === 'string') {
    if (fileDescription.trim() !== '') {
      OpAndArray.push({
        fileDescription:{
          [Op.substring]: myCommon.specialCharEscape(fileDescription),
        },
      });
    }
  }

  if (Array.isArray(fileDescription)) {
    const fileDescriptionReal = [];

    for (let i = 0; i < fileDescription.length; i++) {
      if (typeof fileDescription[i] !== 'string') {
        continue;
      }

      if (fileDescription[i].trim() === '') {
        continue;
      }

      fileDescriptionReal.push(fileDescription[i]);
    }

    if (fileDescriptionReal.length > 0) {
      OpAndArray.push({
        [Op.or]: fileDescriptionReal.map((x) => {
          return {
            fileDescription: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // fileStoreVersionHistoryOpen 체크 : optional
  if (typeof fileStoreVersionHistoryOpen === 'string') {
    if (fileStoreVersionHistoryOpen.trim() !== '') {
      OpAndArray.push({
        fileStoreVersionHistoryOpen:{
          [Op.eq]: fileStoreVersionHistoryOpen,
        },
      });
    }
  }

  if (Array.isArray(fileStoreVersionHistoryOpen)) {
    const fileStoreVersionHistoryOpenReal = [];

    for (let i = 0; i < fileStoreVersionHistoryOpen.length; i++) {
      if (typeof fileStoreVersionHistoryOpen[i] !== 'string') {
        continue;
      }

      if (fileStoreVersionHistoryOpen[i].trim() === '') {
        continue;
      }

      fileStoreVersionHistoryOpenReal.push(fileStoreVersionHistoryOpen[i]);
    }

    if (fileStoreVersionHistoryOpenReal.length > 0) {
      OpAndArray.push({
        fileStoreVersionHistoryOpen:{
          [Op.in]: fileStoreVersionHistoryOpenReal,
        },
      });
    }
  }

  // fileStoreDescriptionOpen 체크 : optional
  if (typeof fileStoreDescriptionOpen === 'string') {
    if (fileStoreDescriptionOpen.trim() !== '') {
      OpAndArray.push({
        fileStoreDescriptionOpen:{
          [Op.eq]: fileStoreDescriptionOpen,
        },
      });
    }
  }

  if (Array.isArray(fileStoreDescriptionOpen)) {
    const fileStoreDescriptionOpenReal = [];

    for (let i = 0; i < fileStoreDescriptionOpen.length; i++) {
      if (typeof fileStoreDescriptionOpen[i] !== 'string') {
        continue;
      }

      if (fileStoreDescriptionOpen[i].trim() === '') {
        continue;
      }

      fileStoreDescriptionOpenReal.push(fileStoreDescriptionOpen[i]);
    }

    if (fileStoreDescriptionOpenReal.length > 0) {
      OpAndArray.push({
        fileStoreDescriptionOpen:{
          [Op.in]: fileStoreDescriptionOpenReal,
        },
      });
    }
  }

  // createdAtStart 체크 : optional
  if (typeof createdAtStart === 'string') {
    if (myDate(createdAtStart).isValid()) {
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
      OpAndArray.push({
        createdAt:{
          [Op.lte]: createdAtEnd,
        },
      });
    }
  }

  // createdIp 체크 : optional
  if (typeof createdIp === 'string') {
    if (createdIp.trim() !== '') {
      OpAndArray.push({
        createdIp:{
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

  // createrUserKey 체크 : optional
  if (typeof createrUserKey === 'string') {
    if (createrUserKey.trim() !== '' && createrUserKey.length === 20) {
      OpAndArray.push({
        createrUserKey:{
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
        createrUserKey:{
          [Op.in]: createrUserKeyReal,
        },
      });
    }
  }

  // createrUserId 체크 : optional
  if (typeof createrUserId === 'string') {
    if (createrUserId.trim() !== '') {
      createrUserWhereOpAndArray.push({
        userId: {
          [Op.substring]: myCommon.specialCharEscape(createrUserId),
        },
      });
    }
  }

  if (Array.isArray(createrUserId)) {
    const createrUserIdReal = [];

    for (let i = 0; i < createrUserId.length; i++) {
      if (typeof createrUserId[i] !== 'string') {
        continue;
      }

      if (createrUserId[i].trim() === '') {
        continue;
      }

      createrUserIdReal.push(createrUserId[i]);
    }

    if (createrUserIdReal.length > 0) {
      createrUserWhereOpAndArray.push({
        [Op.or]: createrUserIdReal.map((x) => {
          return {
            userId: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
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

  // updatedAtStart 체크 : optional
  if (typeof updatedAtStart === 'string') {
    if (myDate(updatedAtStart).isValid()) {
      OpAndArray.push({
        updatedAt:{
          [Op.gte]: updatedAtStart,
        },
      });
    }
  }

  // updatedAtEnd 체크 : optional
  if (typeof updatedAtEnd === 'string') {
    if (myDate(updatedAtEnd).isValid()) {
      OpAndArray.push({
        updatedAt:{
          [Op.lte]: updatedAtEnd,
        },
      });
    }
  }

  // updatedIp 체크 : optional
  if (typeof updatedIp === 'string') {
    if (updatedIp.trim() !== '') {
      OpAndArray.push({
        updatedIp:{
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

  // updaterUserKey 체크 : optional
  if (typeof updaterUserKey === 'string') {
    if (updaterUserKey.trim() !== '' && updaterUserKey.length === 20) {
      OpAndArray.push({
        updaterUserKey:{
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
        updaterUserKey:{
          [Op.in]: updaterUserKeyReal,
        },
      });
    }
  }

  // updaterUserId 체크 : optional
  if (typeof updaterUserId === 'string') {
    if (updaterUserId.trim() !== '') {
      updaterUserWhereOpAndArray.push({
        userId: {
          [Op.substring]: myCommon.specialCharEscape(updaterUserId),
        },
      });
    }
  }

  if (Array.isArray(updaterUserId)) {
    const updaterUserIdReal = [];

    for (let i = 0; i < updaterUserId.length; i++) {
      if (typeof updaterUserId[i] !== 'string') {
        continue;
      }

      if (updaterUserId[i].trim() === '') {
        continue;
      }

      updaterUserIdReal.push(updaterUserId[i]);
    }

    if (updaterUserIdReal.length > 0) {
      updaterUserWhereOpAndArray.push({
        [Op.or]: updaterUserIdReal.map((x) => {
          return {
            userId: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
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

  // fileStatus 체크 : optional
  if (typeof fileStatus === 'string') {
    if (fileStatus.trim() !== '' && fileStatus.length === 20) {
      OpAndArray.push({
        fileStatus:{
          [Op.eq]: fileStatus,
        },
      });
    }
  }

  if (Array.isArray(fileStatus)) {
    const fileStatusReal = [];

    for (let i = 0; i < fileStatus.length; i++) {
      if (typeof fileStatus[i] !== 'string') {
        continue;
      }

      if (fileStatus[i].trim() === '') {
        continue;
      }

      if (fileStatus[i].length !== 13) {
        continue;
      }

      fileStatusReal.push(fileStatus[i]);
    }

    if (fileStatusReal.length > 0) {
      OpAndArray.push({
        fileStatus:{
          [Op.in]: fileStatusReal,
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
  if (createrUserWhereOpAndArray.length > 0) {
    createrUserRequired = true;
  }
  if (updaterUserWhereOpAndArray.length > 0) {
    updaterUserRequired = true;
  }
  where[Op.and] = OpAndArray;
  where.isDeletedRow = 'N';
  order.push(['createdAt', 'DESC']);

  // 전체 리스트 가져오기 (전체 갯수)
  const totalResult = await db.FmsFiles.findAndCountAll({
    where: where,
    order: order,
    include: [
      {
        as: 'FmsFileStatusCodes',
        model: db.FmsCodes,
        attributes: ['code', 'codeName'],
      },
      {
        as: 'FmsCreaterUsers',
        model: db.FmsUsers,
        attributes: ['userKey', 'userId', 'userName'],
        required: createrUserRequired,
      },
      {
        as: 'FmsUpdaterUsers',
        model: db.FmsUsers,
        attributes: ['userKey', 'userId', 'userName'],
        required: updaterUserRequired,
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

  const list = await db.FmsFiles.findAll({
    attributes: [
      'fileKey', 'fileLabelName', 'fileMemo', 'fileDescription', 
      'fileStoreVersionHistoryOpen', 'fileStoreDescriptionOpen',
      'createdAt', 'createdIp', 'createrUserKey',
      'updatedAt', 'updatedIp', 'updaterUserKey',
      'fileStatus',
    ],
    where: where,
    order: order,
    include: [
      {
        as: 'FmsFileStatusCodes',
        model: db.FmsCodes,
        attributes: ['code', 'codeName'],
      },
      {
        as: 'FmsCreaterUsers',
        model: db.FmsUsers,
        attributes: ['userKey', 'userId', 'userName'],
        required: createrUserRequired,
      },
      {
        as: 'FmsUpdaterUsers',
        model: db.FmsUsers,
        attributes: ['userKey', 'userId', 'userName'],
        required: updaterUserRequired,
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

module.exports = getFile;
