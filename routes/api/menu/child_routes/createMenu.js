const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

const createMenu = wrapper(async(req, res, next) => {
  const {
    parentMenuKey,
    menuCategoryKey,
    menuName,
    menuDescription,
    sortNo,
  } = req.body;

  // parentMenuKey 체크 : optional
  if (parentMenuKey !== null && parentMenuKey !== undefined && typeof parentMenuKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20008509,
        msg: myResultCode[20008509].msg,
      },
    }));
    return;
  }

  if (typeof parentMenuKey === 'string') {
    if (parentMenuKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20008510,
          msg: myResultCode[20008510].msg,
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
          code: 20008520,
          msg: myResultCode[20008520].msg,
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
          code: 20008530,
          msg: myResultCode[20008530].msg,
        },
      }));
      return;
    }
  }
  
  // menuCategoryKey 체크 : required
  if (typeof menuCategoryKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20008540,
        msg: myResultCode[20008540].msg,
      },
    }));
    return;
  }

  if (menuCategoryKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20008550,
        msg: myResultCode[20008550].msg,
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
        code: 20008560,
        msg: myResultCode[20008560].msg,
      },
    }));
    return;
  }

  const menuCategoryKeyResult = await db.FmsMenuCategorys.findOne({
    where: {
      menuCategoryKey: menuCategoryKey,
      isDeletedRow: 'N',
    },  
  });
  if (menuCategoryKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20008570,
        msg: myResultCode[20008570].msg,
      },
    }));
    return;
  }

  // menuName 체크 : required
  if (typeof menuName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20008580,
        msg: myResultCode[20008580].msg,
      },
    }));
    return;
  }

  if (menuName.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20008590,
        msg: myResultCode[20008590].msg,
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
        code: 20008600,
        msg: myResultCode[20008600].msg,
      },
    }));
    return;
  }

  // menuDescription 체크 : optional
  if (menuDescription !== null && menuDescription !== undefined && typeof menuDescription !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20008609,
        msg: myResultCode[20008609].msg,
      },
    }));
    return;
  }

  if (typeof menuDescription === 'string') {
    if (menuDescription.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20008610,
          msg: myResultCode[20008610].msg,
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
          code: 20008620,
          msg: myResultCode[20008620].msg,
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
          code: 20008630,
          msg: myResultCode[20008630].msg,
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
            code: 20008640,
            msg: myResultCode[20008640].msg,
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
          code: 20008650,
          msg: myResultCode[20008650].msg,
        },
      }));
      return;
    }
  }

  // 새로운 메뉴 생성
  const newMenuKey = myGetMakeToken({ strlength: 20 });

  const createResult = await db.FmsMenus.create({
    parentMenuKey: parentMenuKey,
    menuCategoryKey: menuCategoryKey,
    menuKey: newMenuKey,
    menuName: menuName,
    menuDescription: menuDescription,
    sortNo: sortNo,
    createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    createdIp: req.real_ip,
    menuStatus: 'MENUS00000001',
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

module.exports = createMenu;