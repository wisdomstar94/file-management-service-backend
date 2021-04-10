const express = require('express');
const router = express.Router();

const child_route__login = require('./child_routes/login');
const child_route__createUser = require('./child_routes/createUser');
const child_route__modifyUser = require('./child_routes/modifyUser');

/*
  /api/user
*/
router.post('/login', child_route__login);
router.post('/createUser', child_route__createUser);
router.post('/modifyUser', child_route__modifyUser);

module.exports = router;
