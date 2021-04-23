const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');

const deleteMenuCategory = wrapper(async(req, res, next) => {
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
        code: 20007509,
        msg: myResultCode[20007509].msg,
      },
    }));
    return;
  }



  const {
    menuCategoryKey, // 삭제 처리할 메뉴 카테고리 고유 식별키 (string 또는 string[])
  } = req.body;

  
  // menuCategoryKey 체크
  if (typeof menuCategoryKey === 'string') {
    if (menuCategoryKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20007510,
          msg: myResultCode[20007510].msg,
        },
      }));
      return;
    }

    if (menuCategoryKey.length !== 20) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20007520,
          msg: myResultCode[20007520].msg,
        },
      }));
      return;
    }
  } else if (Array.isArray(menuCategoryKey)) {
    if (menuCategoryKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20007530,
          msg: myResultCode[20007530].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < menuCategoryKey.length; i++) {
      if (typeof menuCategoryKey[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20007540,
            msg: myResultCode[20007540].msg,
          },
        }));
        return;
      }

      if (menuCategoryKey[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20007550,
            msg: myResultCode[20007550].msg,
          },
        }));
        return;
      }

      if (menuCategoryKey[i].length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20007560,
            msg: myResultCode[20007560].msg,
          },
        }));
        return;
      }
    }
  } else {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20007570,
        msg: myResultCode[20007570].msg,
      },
    }));
    return;
  }

  
  // 메뉴 카테고리 삭제 처리
  const deleteResult = await db.FmsMenuCategorys.update({
    isDeletedRow: 'Y',
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    updatedIp: req.real_ip,
  }, {
    where: {
      menuCategoryKey: menuCategoryKey,
    },
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

module.exports = deleteMenuCategory;