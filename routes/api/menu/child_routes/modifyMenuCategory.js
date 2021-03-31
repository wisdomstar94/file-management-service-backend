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
    if (typeof menuCategoryName !== 'string' && menuCategoryName !== null) {
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
  }


  // 메뉴 카테고리 데이터 수정
  const createResult = await db.FmsCodeGroups.update({
    codeGroupName: codeGroupName,
    codeGroupDescription: codeGroupDescription,
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
  }, {
    where: {
      codeGroup: codeGroup,
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