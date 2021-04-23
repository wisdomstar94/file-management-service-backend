const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

const createMenuCategory = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  if (loginInfo.userLevel !== 'USLEV00000001') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20006009,
        msg: myResultCode[20006009].msg,
      },
    }));
    return;
  }


  const {
    menuCategoryName,
    menuCategoryDescription,
    sortNo,
  } = req.body;


  // menuCategoryName 체크 : required
  if (typeof menuCategoryName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20006010,
        msg: myResultCode[20006010].msg,
      },
    }));
    return;
  }

  if (menuCategoryName.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20006020,
        msg: myResultCode[20006020].msg,
      },
    }));
    return;
  }

  if (menuCategoryName.length > 50) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20006030,
        msg: myResultCode[20006030].msg,
      },
    }));
    return;
  }


  // menuCategoryDescription 체크 : optional
  if (menuCategoryDescription !== undefined && menuCategoryDescription !== null && typeof menuCategoryDescription !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20006039,
        msg: myResultCode[20006039].msg,
      },
    }));
  }

  if (typeof menuCategoryDescription === 'string') {
    if (menuCategoryDescription.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20006040,
          msg: myResultCode[20006040].msg,
        },
      }));
    }

    if (menuCategoryDescription.length > 255) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20006050,
          msg: myResultCode[20006050].msg,
        },
      }));
    }
  }


  // sortNo 체크 
  if (sortNo !== undefined) {
    if (sortNo === null) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20006060,
          msg: myResultCode[20006060].msg,
        },
      }));
    }

    if (typeof sortNo === 'string') {
      if (sortNo.trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20006070,
            msg: myResultCode[20006070].msg,
          },
        }));
      }
    }

    if (isNaN(Number(sortNo))) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20006080,
          msg: myResultCode[20006080].msg,
        },
      }));
    }
  }


  

  // 새로운 메뉴 카테고리 생성
  const newMenuCategoryKey = myGetMakeToken({ strlength: 20 });

  const createResult = await db.FmsMenuCategorys.create({
    menuCategoryKey: newMenuCategoryKey,
    menuCategoryName: menuCategoryName,
    menuCategoryDescription: menuCategoryDescription,
    sortNo: sortNo,
    createdIp: req.real_ip,
    menuCategoryStatus: 'MNCAT00000001',
  });

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

module.exports = createMenuCategory;