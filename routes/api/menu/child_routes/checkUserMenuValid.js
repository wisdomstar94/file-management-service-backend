const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const { Op } = require('sequelize');

const checkUserMenuValid = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);


  const {
    menuKey,
  } = req.body;

  if (typeof menuKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20053010,
        msg: myResultCode[20053010].msg,
      },
    }));
    return;
  }

  if (menuKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20053020,
        msg: myResultCode[20053020].msg,
      },
    }));
    return;
  }

  if (menuKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20053030,
        msg: myResultCode[20053030].msg,
      },
    }));
    return;
  }

  let isAllow = false;
  switch (menuKey) {
    case 'khPJl1617523858875yO': // 대시보드
      // 대시보드 메뉴 체크
      const isDashboardMenuAccessPossible = await db.isActivePermission(loginInfo.userKey, 'JB1617682637993GaPCK');
      isAllow = isDashboardMenuAccessPossible;
      break;
    case 'kmRQ1617524080387RwV': // 회사관리
      // 회사관리 메뉴 체크
      const isCompanyManagementMenuAccessPossible = await db.isActivePermission(loginInfo.userKey, 'U1617683411475etYgFO');
      isAllow = isCompanyManagementMenuAccessPossible;
      break;
    case 'wjajq1617524117533xg': // 회원관리
      // 회원관리 메뉴 체크
      const isUserManagementMenuAccessPossible = await db.isActivePermission(loginInfo.userKey, 'ku1617685799109yKitW');
      isAllow = isUserManagementMenuAccessPossible;
      break;
    case 'ZCjC1617524137491OCy': // 권한 그룹 관리
      // 권한 그룹 관리 메뉴 체크
      const isPermissionGroupManagementMenuAccessPossible = await db.isActivePermission(loginInfo.userKey, 'CZp1617688337684iIEj');
      isAllow = isPermissionGroupManagementMenuAccessPossible;
      break;
    case 'Ig1617524166484wTSHK': // 파일 관리
      // 파일 관리 메뉴 체크
      const isFileManagementMenuAccessPossible = await db.isActivePermission(loginInfo.userKey, 'qVZe1617688959308fKJ');
      isAllow = isFileManagementMenuAccessPossible;
      break;
    case 'njHLKh1617524193166T': // 파일 다운로드 현황
      // 파일 다운로드 현황 메뉴 체크
      const isFileDownloadStatusMenuAccessPossible = await db.isActivePermission(loginInfo.userKey, 'gaXltl1617692064737B');
      isAllow = isFileDownloadStatusMenuAccessPossible;
      break;
    default:
      isAllow = false;
      break;
  }


  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      isAllow: isAllow,
    },
  }));
  return;
});

module.exports = checkUserMenuValid;