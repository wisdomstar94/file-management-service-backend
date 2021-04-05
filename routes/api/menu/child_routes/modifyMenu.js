const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

const modifyMenu = wrapper(async(req, res, next) => {
  const {
    parentMenuKey,
    menuKey,
    menuCategoryKey,
    menuName,
    menuDescription,
    sortNo,
    menuStatus,
  } = req.body;

  // parentMenuKey 체크 : optional
  if (typeof parentMenuKey === 'string') {
    if (parentMenuKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011010,
          msg: myResultCode[20011010].msg,
        },
      }));
      return;
    }

    if (parentMenuKey.length !== 20) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011020,
          msg: myResultCode[20011020].msg,
        },
      }));
      return;
    }

    const parentMenuKeyResult = await db.FmsMenus.findOne({
      where: {
        menuKey: parentMenuKey,
        isDeletedRow: 'N',
      },
    });
    if (parentMenuKeyResult === null) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011030,
          msg: myResultCode[20011030].msg,
        },
      }));
      return;
    }
  }

  // menuKey : require
  if (typeof menuKey === 'string') {
    if (menuKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011040,
          msg: myResultCode[20011040].msg,
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
          code: 20011050,
          msg: myResultCode[20011050].msg,
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
          code: 20011060,
          msg: myResultCode[20011060].msg,
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
            code: 20011070,
            msg: myResultCode[20011070].msg,
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
            code: 20011080,
            msg: myResultCode[20011080].msg,
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
            code: 20011090,
            msg: myResultCode[20011090].msg,
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
        code: 20011100,
        msg: myResultCode[20011100].msg,
      },
    }));
    return;
  }

  // menuCategoryKey 체크 : optional
  if (typeof menuCategoryKey === 'string') {
    if (menuCategoryKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011110,
          msg: myResultCode[20011110].msg,
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
          code: 20011120,
          msg: myResultCode[20011120].msg,
        },
      }));
      return;
    }

    const menuCategoryKeyResult = await db.FmsMenuCategorys.findOne({
      where: {
        menuCategoryKey: menuCategoryKey
      },  
    });
    if (menuCategoryKeyResult === null) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011130,
          msg: myResultCode[20011130].msg,
        },
      }));
      return;
    }
  }

  // menuName 체크 : optional
  if (typeof menuName === 'string') {
    if (menuName.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011140,
          msg: myResultCode[20011140].msg,
        },
      }));
      return;
    }

    if (menuName.length > 50) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011150,
          msg: myResultCode[20011150].msg,
        },
      }));
      return;
    }
  }

  // menuDescription 체크 : optional
  if (typeof menuDescription === 'string') {
    if (menuDescription.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011160,
          msg: myResultCode[20011160].msg,
        },
      }));
      return;
    }

    if (menuDescription.length > 255) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011170,
          msg: myResultCode[20011170].msg,
        },
      }));
      return;
    }
  }

  // sortNo 체크 : optional
  if (sortNo !== undefined) {
    if (sortNo === null) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011180,
          msg: myResultCode[20011180].msg,
        },
      }));
      return;
    }

    if (typeof sortNo === 'string') {
      if (sortNo.trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20011190,
            msg: myResultCode[20011190].msg,
          },
        }));
        return;
      }
    }

    if (isNaN(Number(sortNo))) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011200,
          msg: myResultCode[20011200].msg,
        },
      }));
      return;
    }
  }

  // menuStatus 체크 : optional
  if (typeof menuStatus === 'string') {
    if (menuStatus.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011210,
          msg: myResultCode[20011210].msg,
        },
      }));
      return;
    }

    if (menuStatus.length !== 13) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011220,
          msg: myResultCode[20011220].msg,
        },
      }));
      return;
    }

    const menuStatusCodeValid = await db.FmsCodes.isValidCode('MENUS', menuStatus);
    if (!menuStatusCodeValid) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011230,
          msg: myResultCode[20011230].msg,
        },
      }));
      return;
    }
  }

  // 메뉴 수정
  const modifyResult = await db.FmsMenus.update({
    parentMenuKey: parentMenuKey,
    menuCategoryKey: menuCategoryKey,
    menuName: menuName,
    menuDescription: menuDescription,
    sortNo: sortNo,
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    updatedIp: req.real_ip,
    menuStatus: menuStatus,
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

module.exports = modifyMenu;
