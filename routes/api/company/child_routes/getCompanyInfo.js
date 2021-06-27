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

const getCompanyInfo = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  const isCompanyDetailInfoAccessPossible = await db.isActivePermission(loginInfo.userKey, 'vk1617685109763LDPNY');
  if (!isCompanyDetailInfoAccessPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20055010,
        msg: myResultCode[20055010].msg,
      },
    }));
    return;
  }
  
  const isAllUserControl = await db.isActivePermission(loginInfo.userKey, 'IEjNkA1619012061260L');

  
  const {
    companyKey, // string
  } = req.body;


  // isAllUserControl 체크
  if (!isAllUserControl) {
    
  }

  
  // companyKey 체크 : required
  if (typeof companyKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20055020,
        msg: myResultCode[20055020].msg,
      },
    }));
    return;
  }

  if (companyKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20055030,
        msg: myResultCode[20055030].msg,
      },
    }));
    return;
  }

  if (companyKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20055040,
        msg: myResultCode[20055040].msg,
      },
    }));
    return;
  }



  const where = {};
  const order = [];


  // 조건문 설정
  const whereOpAndArray = [];
  whereOpAndArray.push({
    companyKey: {
      [Op.eq]: companyKey,
    },
  });

  where[Op.and] = whereOpAndArray;


  // 권한에 따라 가져올 칼럼 산정
  const isCompanyDetailInfoAllAccessPossible = await db.isActivePermission(loginInfo.userKey, 'EtrLWDJ1617685141878');

  const activePermissionKeys = await db.isActivePermissions(loginInfo.userKey, [
    'G1617685160282ZmcCrM', // 회사 목록-상세정보-회사명 표시
    'bffuH1617685179867jM', // 회사 목록-상세정보-사업자번호 표시
    'N1617685200839yHRvxd', // 회사 목록-상세정보-사업장주소 표시
    'qlkD1617685215270Sfy', // 회사 목록-상세정보-대표자명 표시
    'ari1617685257015eQbK', // 회사 목록-상세정보-대표자 연락처 표시
    'Mi1617685275873ocgKZ', // 회사 목록-상세정보-회사 전화번호 표시
    'XlFZ1617685290356QZT', // 회사 목록-상세정보-등록일 표시
    'kCijoiw1617687245845', // 회사 목록-상세정보-메모 표시
    'nMsOr1617685307526qs', // 회사 목록-상세정보-상태 표시
  ]);
  const FmsCompanyAttributes = [];
  const FmsCompanyStatusCodesAttributes = [];
  
  FmsCompanyAttributes.push('companyKey');

  activePermissionKeys.includes('G1617685160282ZmcCrM') || isCompanyDetailInfoAllAccessPossible === true ? FmsCompanyAttributes.push('companyName') : null;
  activePermissionKeys.includes('bffuH1617685179867jM') || isCompanyDetailInfoAllAccessPossible === true ? FmsCompanyAttributes.push('companyBusinessNumber') : null;
  activePermissionKeys.includes('N1617685200839yHRvxd') || isCompanyDetailInfoAllAccessPossible === true ? FmsCompanyAttributes.push('companyAddress') : null;
  activePermissionKeys.includes('qlkD1617685215270Sfy') || isCompanyDetailInfoAllAccessPossible === true ? FmsCompanyAttributes.push('companyCEOName') : null;
  activePermissionKeys.includes('ari1617685257015eQbK') || isCompanyDetailInfoAllAccessPossible === true ? FmsCompanyAttributes.push('companyCEOTel') : null;
  activePermissionKeys.includes('Mi1617685275873ocgKZ') || isCompanyDetailInfoAllAccessPossible === true ? FmsCompanyAttributes.push('companyTel') : null;
  activePermissionKeys.includes('XlFZ1617685290356QZT') || isCompanyDetailInfoAllAccessPossible === true ? FmsCompanyAttributes.push('createdAt') : null;
  activePermissionKeys.includes('kCijoiw1617687245845') || isCompanyDetailInfoAllAccessPossible === true ? FmsCompanyAttributes.push('memo') : null;
  if (activePermissionKeys.includes('nMsOr1617685307526qs') || isCompanyDetailInfoAllAccessPossible === true) {
    FmsCompanyAttributes.push('companyStatus');
    FmsCompanyStatusCodesAttributes.push('code');
    FmsCompanyStatusCodesAttributes.push('codeName');
  }

  // if (FmsCompanyAttributes.length !== 0) {
  //   FmsCompanyAttributes.push('companyKey');
  // }

  const companyInfo = await db.FmsCompanys.findOne({
    attributes: FmsCompanyAttributes,
    where: where,
    order: order,
    include: [
      {
        as: 'FmsCompanyStatusCodes',
        model: db.FmsCodes,
        attributes: FmsCompanyStatusCodesAttributes,
        // attributes: ['code', 'codeName'],
      },
    ],
  });

  if (companyInfo === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20055050,
        msg: myResultCode[20055050].msg,
      },
    }));
    return;
  }


  companyInfo.dataValues.FmsCompanyInfos = null;

  const companyInfos = await db.FmsCompanyInfos.findOne({
    attributes: ['companyKey'],
    where: {
      companyKey: companyInfo.dataValues.companyKey,
    },
    include: [
      {
        as: 'FmsCompanyInfoUser',
        model: db.FmsUsers,
        attributes: ['userKey', 'userId'],
      },
    ],
  });

  companyInfo.dataValues.FmsCompanyInfos = companyInfos;


  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      companyInfo: companyInfo,
    },
  }));
  return;
});

module.exports = getCompanyInfo;