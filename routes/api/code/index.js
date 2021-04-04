const express = require('express');
const router = express.Router();


const child_route__createCode = require('./child_routes/createCode');
const child_route__modifyCode = require('./child_routes/modifyCode');
const child_route__deleteCode = require('./child_routes/deleteCode');
const child_route__restoreCode = require('./child_routes/restoreCode');
const child_route__getCode = require('./child_routes/getCode');


/*
  /api/code
*/

router.post('/createCode', child_route__createCode);
router.post('/modifyCode', child_route__modifyCode);
router.post('/deleteCode', child_route__deleteCode);
router.post('/restoreCode', child_route__restoreCode);
router.post('/getCode', child_route__getCode);


module.exports = router;
