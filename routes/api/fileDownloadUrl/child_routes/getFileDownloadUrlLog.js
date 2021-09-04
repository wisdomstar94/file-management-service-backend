const db = require('../../../../models');
const { sequelize } = require('../../../../models');
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
const { Op, Sequelize, QueryTypes } = require('sequelize');
const geoip = require('geoip-lite');
require('dotenv').config();


const getFileDownloadUrlLog = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const fileDownloadUrlLogListPossibleResult = await db.isActivePermissions(loginInfo.userKey, [
    'W1630728058303LTVtCe',
    'OGxfF1630728058303mG',
  ]);
  if (fileDownloadUrlLogListPossibleResult.length === 0) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20069010,
        msg: myResultCode[20069010].msg,
      },
    }));
    return;
  }






  const {
    fileDownloadUrlKey,
    targetYYYYMM,

    page, // 요청온 페이지 숫자
    pageViewCount, // 한번에 표시되는 페이징 수
    viewCount, // 한번에 표시되는 게시글 수
  } = req.body;

  let pageReal = Number(page);
  let pageViewCountReal = Number(pageViewCount);
  let viewCountReal = Number(viewCount);





  const where = {};

  const order = [];
  // const OpAndArray = [];
  let addWhere = ``;
  const addWhereValues = {};



  // fileDownloadUrlKey 체크 : required
  if (typeof fileDownloadUrlKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20069020,
        msg: myResultCode[20069020].msg,
      },
    }));
    return;
  }

  if (fileDownloadUrlKey.trim() === '' || fileDownloadUrlKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20069030,
        msg: myResultCode[20069030].msg,
      },
    }));
    return;
  }

  // targetYYYYMM 체크
  if (typeof targetYYYYMM !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20069040,
        msg: myResultCode[20069040].msg,
      },
    }));
    return;
  }

  if (targetYYYYMM.trim() === '' || targetYYYYMM.length !== 6) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20069050,
        msg: myResultCode[20069050].msg,
      },
    }));
    return;
  }

  // 해당 테이블이 있는지 체크
  const targetTableName = `FmsFileDownloadLogs${targetYYYYMM}`;

  const isExistTalbe = await db.isExistTable(targetTableName);
  if (!isExistTalbe) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20069060,
        msg: myResultCode[20069060].msg,
      },
    }));
    return;
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



  // where[Op.and] = OpAndArray;
  addWhere += `
    AND \`FFDL\`.\`fileDownloadUrlKey\` = :fileDownloadUrlKey 
  `;
  addWhereValues.fileDownloadUrlKey = fileDownloadUrlKey;
  // where.isDeletedRow = 'N';
  // order.push(['createdAt', 'DESC']);


  // 전체 리스트 가져오기 (전체 갯수)
  const totalResult = await sequelize.query(`
      SELECT 

      COUNT(*) AS \`total_count\` 

      FROM \`${process.env.MAIN_DB_DEFAULT_DATABASE}\`.\`${targetTableName}\` AS \`FFDL\` 

      WHERE \`FFDL\`.\`isDeletedRow\` = ${sequelize.escape('N')}
      ${addWhere} 
    `, { 
      replacements: addWhereValues,
      type: QueryTypes.SELECT 
    }
  );
  const totalCount = totalResult[0].total_count;

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

  
  const list = await sequelize.query(`
      SELECT 

      \`FFDL\`.\`fileDownloadUrlKey\` AS \`fileDownloadUrlKey\`, 
      \`FFDL\`.\`fileLabelNameLogAt\` AS \`fileLabelNameLogAt\`, 
      \`FFDL\`.\`fileVersionCodeLogAt\` AS \`fileVersionCodeLogAt\`,
      \`FFDL\`.\`fileVersionNameLogAt\` AS \`fileVersionNameLogAt\`,
      \`FFDL\`.\`fileDownloadNameLogAt\` AS \`fileDownloadNameLogAt\`, 
      \`FFDL\`.\`createdIp\` AS \`createdIp\`,
      \`FFDL\`.\`createdAt\` AS \`createdAt\` 

      FROM \`${process.env.MAIN_DB_DEFAULT_DATABASE}\`.\`${targetTableName}\` AS \`FFDL\` 

      WHERE \`FFDL\`.\`isDeletedRow\` = ${sequelize.escape('N')}
      ${addWhere} 

      ORDER BY \`FFDL\`.\`createdAt\` DESC 

      LIMIT ${getPageInfo.startIndex}, ${getPageInfo.pageLength}
    `, { 
      replacements: addWhereValues,
      type: QueryTypes.SELECT 
    }
  );


  for (let i = 0; i < list.length; i++) {
    // console.log('list[' + i + '].createdIp', list[i].createdIp);
    const createdIpInfo = geoip.lookup(list[i].createdIp);
    // console.log('createdIpInfo', createdIpInfo);
    list[i].createdIpInfo = createdIpInfo;
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

module.exports = getFileDownloadUrlLog;
