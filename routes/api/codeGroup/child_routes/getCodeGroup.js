const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');

const getCodeGroup = wrapper(async(req, res, next) => {
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