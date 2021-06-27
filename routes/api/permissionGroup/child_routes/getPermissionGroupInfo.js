const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');
const myBoard = require('../../../librarys/myBoard');
const { Op, Sequelize } = require('sequelize');

const getPermissionGroupInfo = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  const isPermissionGroupDetailInfoAccessPossible = await db.isActivePermission(loginInfo.userKey, 'a1617688685796Oslkvi');
  if (!isPermissionGroupDetailInfoAccessPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20057010,
        msg: myResultCode[20057010].msg,
      },
    }));
    return;
  }

  // const isAllUserControl = await db.isActivePermission(loginInfo.userKey, 'IEjNkA1619012061260L');

  const {
    permissionGroupKey, // string
  } = req.body;


  // permissionGroupKey 체크 : required
  if (typeof permissionGroupKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20057020,
        msg: myResultCode[20057020].msg,
      },
    }));
    return;
  }

  if (permissionGroupKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20057030,
        msg: myResultCode[20057030].msg,
      },
    }));
    return;
  }

  if (permissionGroupKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20057040,
        msg: myResultCode[20057040].msg,
      },
    }));
    return;
  }



  const where = {};
  const order = [];


  // 조건문 설정
  const whereOpAndArray = [];
  whereOpAndArray.push({
    permissionGroupKey: {
      [Op.eq]: permissionGroupKey,
    },
  });

  where[Op.and] = whereOpAndArray;


  // 권한에 따라 가져올 칼럼 산정
  const isPermissionGroupDetailInfoAllAccessPossible = await db.isActivePermission(loginInfo.userKey, 'SvFu1617688700467PvF');

  const activePermissionKeys = await db.isActivePermissions(loginInfo.userKey, [
    'Q1617688727798FVVxOF', // 권한 그룹 목록-상세정보-권한 그룹명 표시
    'oob1617688744580EWEM', // 권한 그룹 목록-상세정보-권한 그룹 설명 표시
    'Lzt1617688759421oAZD', // 권한 그룹 목록-상세정보-생성일 표시
    'RE1617688773994KnYXd', // 권한 그룹 목록-상세정보-상태 표시
  ]);
  const FmsPermissionGroupAttributes = [];
  const FmsPermissionGroupStatusCodesAttributes = [];
  
  FmsPermissionGroupAttributes.push('permissionGroupKey');
  activePermissionKeys.includes('Q1617688727798FVVxOF') || isPermissionGroupDetailInfoAllAccessPossible === true ? FmsPermissionGroupAttributes.push('permissionGroupName') : null;
  activePermissionKeys.includes('oob1617688744580EWEM') || isPermissionGroupDetailInfoAllAccessPossible === true ? FmsPermissionGroupAttributes.push('permissionGroupDescription') : null;
  activePermissionKeys.includes('Lzt1617688759421oAZD') || isPermissionGroupDetailInfoAllAccessPossible === true ? FmsPermissionGroupAttributes.push('createdAt') : null;
  if (activePermissionKeys.includes('RE1617688773994KnYXd') || isPermissionGroupDetailInfoAllAccessPossible === true) {
    FmsPermissionGroupAttributes.push('permissionGroupStatus');
    FmsPermissionGroupStatusCodesAttributes.push('code');
    FmsPermissionGroupStatusCodesAttributes.push('codeName');
  }

  const permissionGroupInfo = await db.FmsPermissionGroups.findOne({
    attributes: FmsPermissionGroupAttributes,
    where: where,
    order: order,
    include: [
      {
        as: 'FmsPermissionGroupStatusCodes',
        model: db.FmsCodes,
        attributes: FmsPermissionGroupStatusCodesAttributes,
        // attributes: ['code', 'codeName'],
      },
    ],
  });

  if (permissionGroupInfo === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20057050,
        msg: myResultCode[20057050].msg,
      },
    }));
    return;
  }

  permissionGroupInfo.dataValues.FmsPermissionGroupInfos = null;

  const permissionGroupInfos = await db.FmsPermissionGroupInfos.findOne({
    attributes: ['permissionGroupKey'],
    where: {
      permissionGroupKey: permissionGroupInfo.dataValues.permissionGroupKey,
    },
    include: [
      {
        as: 'FmsPermissionGroupInfoUser',
        model: db.FmsUsers,
        attributes: ['userKey', 'userId'],
      },
    ],
  });

  permissionGroupInfo.dataValues.FmsPermissionGroupInfos = permissionGroupInfos;


  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      permissionGroupInfo: permissionGroupInfo,
    },
  }));
  return;


});

module.exports = getPermissionGroupInfo;