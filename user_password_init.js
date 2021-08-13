const myCrypto = require('./routes/librarys/myCrypto');
const db = require('./models');

(async () => {
  // 초기 test123 계정의 비밀번호 설정
  const modifyResult = await db.FmsUsers.update({
    userPassword: myCrypto.oneRootEncrypt({ originalValue: '123456' }),
  }, {
    where: {
      userKey: 'C1618033738099vtEiUg',
    },
  });

  process.exit(0);
})();