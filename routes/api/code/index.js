const express = require('express');
const router = express.Router();
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');


const child_route__createCode = require('./child_routes/createCode');
const child_route__modifyCode = require('./child_routes/modifyCode');
const child_route__deleteCode = require('./child_routes/deleteCode');
const child_route__restoreCode = require('./child_routes/restoreCode');
const child_route__getCode = require('./child_routes/getCode');


/*
  /api/code
*/

router.post('/createCode', jwtTokenCheck, child_route__createCode);
router.post('/modifyCode', jwtTokenCheck, child_route__modifyCode);
router.post('/deleteCode', jwtTokenCheck, child_route__deleteCode);
router.post('/restoreCode', jwtTokenCheck, child_route__restoreCode);
router.post('/getCode', jwtTokenCheck, child_route__getCode);


module.exports = router;
