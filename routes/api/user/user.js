const express = require('express');
const router = express.Router();

const child_route__login = require('./child_routes/login');

/*
  /api/user
*/
router.post('/login', child_route__login);

module.exports = router;
