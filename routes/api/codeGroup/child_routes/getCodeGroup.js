const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');

const getCodeGroup = wrapper(async(req, res, next) => {
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
        code: 20005810,
        msg: myResultCode[20005810].msg,
      },
    }));
    return;
  }


  // 조회
  const list = await db.FmsCodeGroups.findAll({
    attributes: [
      'seq', 'codeGroup', 'codeGroupName', 'codeGroupDescription', 
      // [db.Sequelize.fn('date_format', db.Sequelize.col('FmsCodeGroups.createdAt'), '%Y-%m-%d %H:%i:%s'), 'createdAt'], 
      'createdAt',
      // [db.Sequelize.fn('date_format', db.Sequelize.col('FmsCodeGroups.updatedAt'), '%Y-%m-%d %H:%i:%s'), 'updatedAt'], 
      'updatedAt',
      'status',
    ],
    where: {
      isDeletedRow: 'N',
    },
    order: [
      ['createdAt', 'ASC'],
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

module.exports = getCodeGroup;