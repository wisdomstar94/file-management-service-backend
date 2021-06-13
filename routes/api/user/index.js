const express = require('express');
const router = express.Router();
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');

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

/*
  /api/user
*/
router.post('/login', child_route__login);
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

module.exports = router;
