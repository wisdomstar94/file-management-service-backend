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

const getSearchAreaShowFlag = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  const {
    url
  } = req.body;


  const permissionKey = [];

  switch (true) {
    // case /^\/dashboard$/.test(url): permissionKey = 'JB1617682637993GaPCK'; break;

    case /^\/company$/.test(url): 
      permissionKey.push('hiim1617683467594YRY'); 
      break;
    // case /^\/company\/info\//.test(url): permissionKey = 'vk1617685109763LDPNY'; break;
    // case /^\/company\/upload$/.test(url): permissionKey = 'UY1619153982779QIVRq'; break; 

    case /^\/user$/.test(url): 
      permissionKey.push('SYlFsd1617685933675q'); 
      break;
    // case /^\/user\/info\//.test(url): permissionKey = 'ZVbPFm1617686493277o'; break;
    // case /^\/user\/upload$/.test(url): permissionKey = 'F1619012225347uuKMhw'; break; 

    case /^\/permissionGroup$/.test(url): 
      permissionKey.push('HSrbpC1617688399581M'); 
      break;
    // case /^\/permissionGroup\/info\//.test(url): permissionKey = 'a1617688685796Oslkvi'; break;
    // case /^\/permissionGroup\/upload$/.test(url): permissionKey = 'yQWpkir1617688667026'; break; 

    case /^\/file$/.test(url): 
      permissionKey.push('isphYm1617689015822t'); 
      break;
    case /^\/file\/info\//.test(url): 
      permissionKey.push('kkbes1617690757342iF'); 
      permissionKey.push('zEHbsq1617691224808H'); 
      break;
    // case /^\/file\/upload$/.test(url): permissionKey = 'wSSQFD1617690129416s'; break; 

    case /^\/fileDownloadState$/.test(url): 
      permissionKey.push('ZP1617692105079arRSf'); 
      break;
  }

  if (permissionKey.length === 0) {
    res.status(401).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20066010,
        msg: myResultCode[20066010].msg,
      },
    }));
    return;
  }

  const realPermissionKeys = await db.isActivePermissions(loginInfo.userKey, permissionKey);

  const searchBoxPermissions = [];
  permissionKey.map((x) => {
    if (realPermissionKeys.includes(x)) {
      searchBoxPermissions.push(true);
    } else {
      searchBoxPermissions.push(false);
    }
  });


  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      searchBoxPermissions: searchBoxPermissions,
    },
  }));
  return;
});

module.exports = getSearchAreaShowFlag;