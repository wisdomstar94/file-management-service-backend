const wrapper = require('../../../librarys/myAsyncWrapper');
const myCrypto = require('../../../librarys/myCrypto');

const createUser = wrapper(async(req, res, next) => {
  const {
    userId,
    user
  } = req.body;


  return;
});

module.exports = createUser;