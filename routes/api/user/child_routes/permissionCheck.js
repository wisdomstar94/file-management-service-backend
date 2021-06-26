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

const permissionCheck = wrapper(async(req, res, next) => {
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


  let permissionKey = '';

  switch (true) {
    case /^\/dashboard/.test(url): permissionKey = 'JB1617682637993GaPCK'; break;

    case /^\/company/.test(url): permissionKey = 'U1617683411475etYgFO'; break;
    case /^\/company\/info\/\:/.test(url): permissionKey = 'vk1617685109763LDPNY'; break;
    case /^\/company\/upload/.test(url): permissionKey = 'UY1619153982779QIVRq'; break; 

    case /^\/user/.test(url): permissionKey = 'ku1617685799109yKitW'; break;
    case /^\/user\/info\/\:/.test(url): permissionKey = 'ZVbPFm1617686493277o'; break;
    case /^\/user\/upload/.test(url): permissionKey = 'F1619012225347uuKMhw'; break; 

    case /^\/permissionGroup/.test(url): permissionKey = 'CZp1617688337684iIEj'; break;
    case /^\/permissionGroup\/info\/\:/.test(url): permissionKey = 'a1617688685796Oslkvi'; break;
    case /^\/permissionGroup\/upload/.test(url): permissionKey = 'yQWpkir1617688667026'; break; 

    case /^\/file/.test(url): permissionKey = 'qVZe1617688959308fKJ'; break;
    case /^\/file\/info\/\:/.test(url): permissionKey = 'B1617690143101zIeSOm'; break;
    case /^\/file\/upload/.test(url): permissionKey = 'wSSQFD1617690129416s'; break; 

    case /^\/fileDownloadState/.test(url): permissionKey = 'gaXltl1617692064737B'; break;
  }

  if (permissionKey === '') {
    res.status(401).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20061010,
        msg: myResultCode[20061010].msg,
      },
    }));
    return;
  }

  const isExistPermission = await db.isActivePermission(loginInfo.userKey, permissionKey);
  if (!isExistPermission) {
    res.status(401).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20061020,
        msg: myResultCode[20061020].msg,
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
    },
  }));
  return;
});

module.exports = permissionCheck;