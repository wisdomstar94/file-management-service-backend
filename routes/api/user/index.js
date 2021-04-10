const express = require('express');
const router = express.Router();

const child_route__login = require('./child_routes/login');
const child_route__createUser = require('./child_routes/createUser');

/*
  /api/user
*/
router.post('/login', child_route__login);
router.post('/createUser', child_route__createUser);

module.exports = router;
