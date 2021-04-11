const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');
const myBoard = require('../../../librarys/myBoard');
const { Op, Sequelize } = require('sequelize');

const getPermissionGroup = wrapper(async(req, res, next) => {
  const {
    permissionGroupKey, // string 또는 string[]
    permissionGroupName, // string 또는 string[]
    permissionGroupDescription, // string 또는 string[]
    createdAtStart,
    createdAtEnd,
    createdIp, // string 또는 string[]
    updatedAtStart,
    updatedAtEnd,
    updatedIp, // string 또는 string[]
    permissionGroupStatus, // string 또는 string[]

    page, // 요청온 페이지 숫자
    pageViewCount, // 한번에 표시되는 페이징 수
    viewCount, // 한번에 표시되는 게시글 수
  } = req.body;

  let pageReal = Number(page);
  let pageViewCountReal = Number(pageViewCount);
  let viewCountReal = Number(viewCount);


  const where = {};
  const order = [];
  const OpAndArray = [];



  // permissionGroupKey 체크
  if (typeof permissionGroupKey === 'string') {
    OpAndArray.push({
      permissionGroupKey: {
        [Op.eq]: permissionGroupKey,
      },
    });
  }

  if (Array.isArray(permissionGroupKey)) {
    const permissionGroupKeyReal = [];

    for (let i = 0; i < permissionGroupKey.length; i++) {
      if (typeof permissionGroupKey[i] !== 'string') {
        continue;
      }

      permissionGroupKeyReal.push(permissionGroupKey[i]);
    }

    if (permissionGroupKeyReal.length > 0) {
      OpAndArray.push({
        permissionGroupKey: {
          [Op.in]: permissionGroupKeyReal,
        },
      });
    }
  }

  // permissionGroupName 체크
  if (typeof permissionGroupName === 'string') {
    if (permissionGroupName.trim() !== '') {
      OpAndArray.push({
        permissionGroupName: {
          [Op.substring]: myCommon.specialCharEscape(permissionGroupName),
        },
      });
    }
  }

  if (Array.isArray(permissionGroupName)) {
    const permissionGroupNameReal = [];

    for (let i = 0; i < permissionGroupName.length; i++) {
      if (typeof permissionGroupName[i] !== 'string') {
        continue;
      }

      if (permissionGroupName[i].trim() === '') {
        continue;
      }

      permissionGroupNameReal.push(permissionGroupName[i]);
    }

    if (permissionGroupNameReal.length > 0) {
      OpAndArray.push({
        [Op.or]: permissionGroupNameReal.map((x) => {
          return {
            permissionGroupName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // permissionGroupDescription 체크
  if (typeof permissionGroupDescription === 'string') {
    if (permissionGroupDescription.trim() !== '') {
      OpAndArray.push({
        permissionGroupDescription: {
          [Op.substring]: myCommon.specialCharEscape(permissionGroupDescription),
        },
      });
    }
  }

  if (Array.isArray(permissionGroupDescription)) {
    const permissionGroupDescriptionReal = [];

    for (let i = 0; i < permissionGroupDescription.length; i++) {
      if (typeof permissionGroupDescription[i] !== 'string') {
        continue;
      }

      if (permissionGroupDescription[i].trim() === '') {
        continue;
      }

      permissionGroupDescriptionReal.push(permissionGroupDescription[i]);
    }

    if (permissionGroupDescriptionReal.length > 0) {
      OpAndArray.push({
        [Op.or]: permissionGroupDescriptionReal.map((x) => {
          return {
            permissionGroupDescription: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // createdAtStart 체크
  if (typeof createdAtStart === 'string') {
    if (myDate(createdAtStart).isValid()) {
      OpAndArray.push({
        createdAt: {
          [Op.gte]: createdAtStart
        },
      });
    }
  }

  // createdAtEnd 체크
  if (typeof createdAtEnd === 'string') {
    if (myDate(createdAtEnd).isValid()) {
      OpAndArray.push({
        createdAt: {
          [Op.lte]: createdAtEnd
        },
      });
    }
  }

  // createdIp 체크
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

  // updatedAtStart 체크
  if (typeof updatedAtStart === 'string') {
    if (myDate(updatedAtStart).isValid()) {
      OpAndArray.push({
        updatedAt: {
          [Op.gte]: updatedAtStart
        },
      });
    }
  }

  // updatedAtEnd 체크
  if (typeof updatedAtEnd === 'string') {
    if (myDate(updatedAtEnd).isValid()) {
      OpAndArray.push({
        updatedAt: {
          [Op.lte]: updatedAtEnd
        },
      });
    }
  }

  // updatedIp 체크
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

  // permissionGroupStatus 체크
  if (typeof permissionGroupStatus === 'string') {
    OpAndArray.push({
      permissionGroupStatus: {
        [Op.eq]: permissionGroupStatus,
      },
    });
  }

  if (Array.isArray(permissionGroupStatus)) {
    const permissionGroupStatusReal = [];

    for (let i = 0; i < permissionGroupStatus.length; i++) {
      if (typeof permissionGroupStatus[i] !== 'string') {
        continue;
      }

      permissionGroupStatusReal.push(permissionGroupStatus[i]);
    }

    if (permissionGroupStatusReal.length > 0) {
      OpAndArray.push({
        permissionGroupStatus: {
          [Op.in]: permissionGroupStatusReal,
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



  where[Op.and] = OpAndArray;
  where.isDeletedRow = 'N';
  order.push(['createdAt', 'DESC']);

  // 전체 리스트 가져오기 (전체 갯수)
  const totalResult = await db.FmsPermissionGroups.findAndCountAll({
    where: where,
    order: order,
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

  // 리스트 가져오기
  const list = await db.FmsPermissionGroups.findAll({
    attributes: [
      'permissionGroupKey', 'permissionGroupName', 'permissionGroupDescription', 'sortNo',
      'createdAt', 'createdIp', 'updatedAt', 'updatedIp', 'permissionGroupStatus', 
    ],
    include: [
      {
        model: db.FmsCodes,
        attributes: [
          ['codeName', 'permissionGroupStatusString'],
        ],
      },
    ],
    where: where,
    order: order,
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

module.exports = getPermissionGroup;