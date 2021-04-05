const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

const deleteMenu = wrapper(async(req, res, next) => {
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
          code: 20010010,
          msg: myResultCode[20010010].msg,
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
          code: 20010020,
          msg: myResultCode[20010020].msg,
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
          code: 20010030,
          msg: myResultCode[20010030].msg,
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
            code: 20010040,
            msg: myResultCode[20010040].msg,
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
            code: 20010050,
            msg: myResultCode[20010050].msg,
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
            code: 20010060,
            msg: myResultCode[20010060].msg,
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
        code: 20010070,
        msg: myResultCode[20010070].msg,
      },
    }));
  }

  // 메뉴 삭제
  const deleteResult = await db.FmsMenus.update({
    isDeletedRow: 'Y',
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

module.exports = deleteMenu;
