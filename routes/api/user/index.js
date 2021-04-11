const express = require('express');
const router = express.Router();
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');

const child_route__login = require('./child_routes/login');
const child_route__createUser = require('./child_routes/createUser');
const child_route__modifyUser = require('./child_routes/modifyUser');
const child_route__deleteUser = require('./child_routes/deleteUser');
const child_route__restoreUser = require('./child_routes/restoreUser');
const child_route__getUser = require('./child_routes/getUser');



/*
  /api/user
*/
router.post('/login', child_route__login);
router.post('/createUser', child_route__createUser);
router.post('/modifyUser', child_route__modifyUser);
router.post('/deleteUser', child_route__deleteUser);
router.post('/restoreUser', child_route__restoreUser);
router.post('/getUser', jwtTokenCheck, child_route__getUser);

module.exports = router;
