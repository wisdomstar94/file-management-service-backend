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

const getUserInfo = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  const isUserDetailInfoAccessPossible = await db.isActivePermission(loginInfo.userKey, 'ZVbPFm1617686493277o');
  if (!isUserDetailInfoAccessPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20056010,
        msg: myResultCode[20056010].msg,
      },
    }));
    return;
  }
  
  const isAllUserControl = await db.isActivePermission(loginInfo.userKey, 'IEjNkA1619012061260L');

  
  const {
    userKey, // string
  } = req.body;


  // isAllUserControl 체크
  if (!isAllUserControl) {
    
  }

  
  // userKey 체크 : required
  if (typeof userKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20056020,
        msg: myResultCode[20056020].msg,
      },
    }));
    return;
  }

  if (userKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20056030,
        msg: myResultCode[20056030].msg,
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
        code: 20056040,
        msg: myResultCode[20056040].msg,
      },
    }));
    return;
  }



  const where = {};
  const order = [];


  // 조건문 설정
  const whereOpAndArray = [];
  whereOpAndArray.push({
    userKey: {
      [Op.eq]: userKey,
    },
  });

  where[Op.and] = whereOpAndArray;


  // 권한에 따라 가져올 칼럼 산정
  const isUserDetailInfoAllAccessPossible = await db.isActivePermission(loginInfo.userKey, 'VJljX1617686507261iy');

  const activePermissionKeys = await db.isActivePermissions(loginInfo.userKey, [
    'n1617686523267PPdKRC', // 회원 목록-상세정보-ID 표시
    'cTP1617686537729CtUL', // 회원 목록-상세정보-회사 표시
    'z1617686553681DpVFFD', // 회원 목록-상세정보-이름 표시
    'K1617686570367IbIEqY', // 회원 목록-상세정보-휴대폰 번호 표시
    'z1617688064130EDPbWc', // 회원 목록-상세정보-메모 표시
    'TKzOjpi1617686585400', // 회원 목록-상세정보-가입일 표시
    'y1617686600599RqoSsU', // 회원 목록-상세정보-가입시 IP 주소 표시
    'JpHo1617686614042tGn', // 회원 목록-상세정보-권한 그룹 표시
    'xuWPm1617686635430eI', // 회원 목록-상세정보-상태 표시 
  ]);
  const FmsUserAttributes = [];
  const FmsUserStatusCodesAttributes = [];
  const FmsUserCompanysAttributes = [];
  const FmsUsePermissionGroupAttributes = [];
  
  FmsUserAttributes.push('userKey');

  activePermissionKeys.includes('n1617686523267PPdKRC') || isUserDetailInfoAllAccessPossible === true ? FmsUserAttributes.push('userId') : null;
  if (activePermissionKeys.includes('cTP1617686537729CtUL') || isUserDetailInfoAllAccessPossible === true) {
    FmsUserAttributes.push('companyKey');
    FmsUserCompanysAttributes.push('companyKey');
    FmsUserCompanysAttributes.push('companyName');
  }
  activePermissionKeys.includes('z1617686553681DpVFFD') || isUserDetailInfoAllAccessPossible === true ? FmsUserAttributes.push('userName') : null;
  activePermissionKeys.includes('K1617686570367IbIEqY') || isUserDetailInfoAllAccessPossible === true ? FmsUserAttributes.push('userPhone') : null;
  activePermissionKeys.includes('z1617688064130EDPbWc') || isUserDetailInfoAllAccessPossible === true ? FmsUserAttributes.push('userMemo') : null;
  activePermissionKeys.includes('TKzOjpi1617686585400') || isUserDetailInfoAllAccessPossible === true ? FmsUserAttributes.push('createdAt') : null;
  activePermissionKeys.includes('y1617686600599RqoSsU') || isUserDetailInfoAllAccessPossible === true ? FmsUserAttributes.push('createdIp') : null;
  if (activePermissionKeys.includes('JpHo1617686614042tGn') || isUserDetailInfoAllAccessPossible === true) {
    FmsUserAttributes.push('permissionGroupKey');
    FmsUsePermissionGroupAttributes.push('permissionGroupKey');
    FmsUsePermissionGroupAttributes.push('permissionGroupName');
  }
  if (activePermissionKeys.includes('xuWPm1617686635430eI') || isUserDetailInfoAllAccessPossible === true) {
    FmsUserAttributes.push('userStatus');
    FmsUserStatusCodesAttributes.push('code');
    FmsUserStatusCodesAttributes.push('codeName');
  }

  // if (FmsUserAttributes.length !== 0) {
  //   FmsUserAttributes.push('companyKey');
  // }

  const userInfo = await db.FmsUsers.findOne({
    attributes: FmsUserAttributes,
    where: where,
    order: order,
    include: [
      {
        as: 'FmsUserStatusCodes',
        model: db.FmsCodes,
        attributes: FmsUserStatusCodesAttributes,
        // attributes: ['code', 'codeName'],
      },
      {
        model: db.FmsCompanys,
        attributes: FmsUserCompanysAttributes,
      },
      {
        model: db.FmsPermissionGroups,
        attributes: FmsUsePermissionGroupAttributes,
      },
    ],
  });

  if (userInfo === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20056050,
        msg: myResultCode[20056050].msg,
      },
    }));
    return;
  }


  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      userInfo: userInfo,
    },
  }));
  return;
});

module.exports = getUserInfo;