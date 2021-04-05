const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

const restoreMenu = wrapper(async(req, res, next) => {
  const {
    menuKey,
  } = req.body;

  // menuKey 체크
  if (typeof menuKey === 'string') {
    if (menuKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20010510,
          msg: myResultCode[20010510].msg,
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
          code: 20010520,
          msg: myResultCode[20010520].msg,
        },
      }));
      return;
    }
  } else if (Array.isArray(menuKey)) {
    if (menuKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20010530,
          msg: myResultCode[20010530].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < menuKey.length; i++) {
      if (typeof menuKey[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20010540,
            msg: myResultCode[20010540].msg,
          },
        }));
        return;
      }

      if (menuKey[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20010550,
            msg: myResultCode[20010550].msg,
          },
        }));
        return;
      }

      if (menuKey[i].length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20010560,
            msg: myResultCode[20010560].msg,
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
        code: 20010570,
        msg: myResultCode[20010570].msg,
      },
    }));
  }

  // 메뉴 삭제
  const restoreResult = await db.FmsMenus.update({
    isDeletedRow: 'N',
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    updatedIp: req.real_ip,
  }, {
    where: {
      menuKey: menuKey,
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

module.exports = restoreMenu;
