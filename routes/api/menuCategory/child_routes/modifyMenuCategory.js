const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');

const modifyMenuCategory = wrapper(async(req, res, next) => {
  const {
    menuCategoryKey, // 수정할 메뉴 카테고리 고유 식별키
    menuCategoryName, // 메뉴 카테고리명을 menuCategoryName 으로 수정
    menuCategoryDescription, // 메뉴 카테고리 설명을 menuCategoryDescription 으로 수정
    sortNo, // 순서를 sortNo 으로 수정
    menuCategoryStatus, // 메뉴 카테고리 상태를 menuCategoryStatus 으로 수정
  } = req.body;

  
  // menuCategoryKey 체크
  if (typeof menuCategoryKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20007010,
        msg: myResultCode[20007010].msg,
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
        code: 20007020,
        msg: myResultCode[20007020].msg,
      },
    }));
    return;
  }

  const menuCategoryKeyInfo = await db.FmsMenuCategorys.findOne({
    where: {
      menuCategoryKey: menuCategoryKey,
    },
  });

  if (menuCategoryKeyInfo === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20007030,
        msg: myResultCode[20007030].msg,
      },
    }));
    return;
  }

  // menuCategoryName 체크
  if (menuCategoryName !== undefined) {
    if (typeof menuCategoryName !== 'string') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20007040,
          msg: myResultCode[20007040].msg,
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
          code: 20007050,
          msg: myResultCode[20007050].msg,
        },
      }));
      return;
    }
  }

  // menuCategoryDescription 체크
  if (menuCategoryDescription !== undefined) {
    if (typeof menuCategoryDescription !== 'string' && menuCategoryDescription !== null) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20007060,
          msg: myResultCode[20007060].msg,
        },
      }));
      return;
    }

    if (typeof menuCategoryDescription === 'string') {
      if (menuCategoryDescription.trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20007070,
            msg: myResultCode[20007070].msg,
          },
        }));
        return;
      }
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
          code: 20007080,
          msg: myResultCode[20007080].msg,
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
            code: 20007090,
            msg: myResultCode[20007090].msg,
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
          code: 20007100,
          msg: myResultCode[20007100].msg,
        },
      }));
      return;
    }
  }

  // menuCategoryStatus 체크
  if (typeof menuCategoryStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20007110,
        msg: myResultCode[20007110].msg,
      },
    }));
    return;
  }

  if (menuCategoryStatus.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20007120,
        msg: myResultCode[20007120].msg,
      },
    }));
    return;
  }

  if (menuCategoryStatus.length !== 13) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20007130,
        msg: myResultCode[20007130].msg,
      },
    }));
    return;
  }

  const isMenuCatagoryStatusCodeValid = await db.FmsCodes.isValidCode('MNCAT', menuCategoryStatus);
  if (!isMenuCatagoryStatusCodeValid) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20007140,
        msg: myResultCode[20007140].msg,
      },
    }));
    return;
  }

  // 메뉴 카테고리 상태 업데이트
  const updateResult = await db.FmsMenuCategorys.update({
    menuCategoryName: menuCategoryName,
    menuCategoryDescription: menuCategoryDescription,
    sortNo: sortNo,
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    updatedIp: req.real_ip,
    menuCategoryStatus: menuCategoryStatus,
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

module.exports = modifyMenuCategory;