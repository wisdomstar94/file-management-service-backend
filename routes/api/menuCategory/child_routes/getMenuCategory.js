const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const { Op } = require('sequelize');

const getMenuCategory = wrapper(async(req, res, next) => {
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
        code: 20006509,
        msg: myResultCode[20006509].msg,
      },
    }));
    return;
  }


  const {
    menuCategoryName,
    menuCategoryDescription,
    createdAtStart,
    createdAtEnd,
  } = req.body;


  if (createdAtStart !== undefined) {
    if (!myDate(createdAtStart).isValid()) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20006510,
          msg: myResultCode[20006510].msg,
        },
      }));
      return;
    }
  }


  if (createdAtEnd !== undefined) {
    if (!myDate(createdAtEnd).isValid()) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20006520,
          msg: myResultCode[20006520].msg,
        },
      }));
      return;
    }
  }







  // 메뉴 카테고리 리스트 가져오기
  const OpAndArray = [];

  // optional
  if (typeof createdAtStart === 'string') {
    if (myDate(createdAtStart).isValid()) {
      OpAndArray.push({
        createdAt: {
          [Op.gte]: createdAtStart,
        },
      });
    }
  }

  // optional
  if (typeof createdAtEnd === 'string') {
    if (myDate(createdAtEnd).isValid()) {
      OpAndArray.push({
        createdAt: {
          [Op.lte]: createdAtEnd,
        },
      });
    }
  }

  // required
  OpAndArray.push({
    isDeletedRow: 'N',
  });

  const where = {
    [Op.and]: OpAndArray,
  };
  const list = await db.FmsMenuCategorys.findAll({
    attributes: [
      'seq', 'menuCategoryKey', 'menuCategoryName', 'menuCategoryDescription', 'sortNo',
      // [db.Sequelize.fn('date_format', db.Sequelize.col('FmsMenuCategorys.createdAt'), '%Y-%m-%d %H:%i:%s'), 'createdAt'], 
      'createdAt',
      'createdIp',
      // [db.Sequelize.fn('date_format', db.Sequelize.col('FmsMenuCategorys.updatedAt'), '%Y-%m-%d %H:%i:%s'), 'updatedAt'], 
      'updatedAt',
      'updatedIp',
      'menuCategoryStatus',
    ],
    where: where,
    order: [
      ['sortNo', 'ASC'],
      ['createdAt', 'ASC'],
    ],
    include: [
      {
        model: db.FmsCodes,
        attributes: [
          ['codeName', 'menuCategoryStatusString'],
        ],
      },
    ],
  });

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      list: list,
    },
  }));
  return;
});

module.exports = getMenuCategory;