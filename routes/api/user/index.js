const express = require('express');
const router = express.Router();
const myLogger = require('../../librarys/myLogger');

(async() => {  
  const RateLimit = require('express-rate-limit');
  const RateRedisStore = require("rate-limit-redis");
  const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');
  const resultCode = require('../../librarys/myResultCode');
  const redis = require('redis');
  require('dotenv').config();


  const RedisClient = redis.createClient({
    password: process.env.MAIN_REDIS_PW,
    // legacyMode: true,
  });
  await RedisClient.connect();
  await RedisClient.auth({ password: process.env.MAIN_REDIS_PW }, (err) => {
    console.log('err', err);
  });
  

  const rateRedisLimiter = RateLimit({
    store: new RateRedisStore({
      sendCommand: (...args) => RedisClient.sendCommand(args),
    }),
    windowMs: 1000 * 30, // 30초
    max: async(req, res) => {
      // return Promise.resolve(10);
      return 10;
    }, // 최대 10개 request
    handler: async(req, res) => {
      res.json({
        result: 'fail',
        headTail: req.accessUniqueKey,
        code: 20067010,
        msg: resultCode[20067010].msg,
      });
      return;
    },
  });



  const child_route__login = require('./child_routes/login');
  const child_route__logout = require('./child_routes/logout');
  const child_route__createUser = require('./child_routes/createUser');
  const child_route__modifyUser = require('./child_routes/modifyUser');
  const child_route__deleteUser = require('./child_routes/deleteUser');
  const child_route__restoreUser = require('./child_routes/restoreUser');
  const child_route__getUser = require('./child_routes/getUser');
  const child_route__getUserInfo = require('./child_routes/getUserInfo');
  const child_route__idDuplicateCheck = require('./child_routes/idDuplicateCheck');
  const child_route__signUp = require('./child_routes/signUp');
  const child_route__authCheck = require('./child_routes/authCheck');
  const child_route__getLoginInfo = require('./child_routes/getLoginInfo');
  const child_route__permissionCheck = require('./child_routes/permissionCheck');
  const child_route__getSearchAreaShowFlag = require('./child_routes/getSearchAreaShowFlag');

  /*
    /api/user
  */
  router.post('/login', rateRedisLimiter, child_route__login);
  // router.post('/login', child_route__login);
  router.post('/logout', child_route__logout);
  router.post('/createUser', jwtTokenCheck, child_route__createUser);
  router.post('/modifyUser', jwtTokenCheck, child_route__modifyUser);
  router.post('/deleteUser', jwtTokenCheck, child_route__deleteUser);
  router.post('/restoreUser', jwtTokenCheck, child_route__restoreUser);
  router.post('/getUser', jwtTokenCheck, child_route__getUser);
  router.post('/getUserInfo', jwtTokenCheck, child_route__getUserInfo);
  router.post('/idDuplicateCheck', child_route__idDuplicateCheck);
  router.post('/signUp', child_route__signUp);
  router.post('/authCheck', jwtTokenCheck, child_route__authCheck);
  router.post('/getLoginInfo', jwtTokenCheck, child_route__getLoginInfo);
  router.post('/permissionCheck', jwtTokenCheck, child_route__permissionCheck);
  router.post('/getSearchAreaShowFlag', jwtTokenCheck, child_route__getSearchAreaShowFlag);
})();

module.exports = router;