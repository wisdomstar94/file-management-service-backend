const express = require('express');
const router = express.Router();

const child_route__createCodeGroup = require('./child_routes/createCodeGroup');
const child_route__modifyCodeGroup = require('./child_routes/modifyCodeGroup');
const child_route__deleteCodeGroup = require('./child_routes/deleteCodeGroup');
const child_route__restoreCodeGroup = require('./child_routes/restoreCodeGroup');
const child_route__getCodeGroup = require('./child_routes/getCodeGroup');


const child_route__createCode = require('./child_routes/createCode');
const child_route__modifyCode = require('./child_routes/modifyCode');
const child_route__deleteCode = require('./child_routes/deleteCode');
const child_route__restoreCode = require('./child_routes/restoreCode');
const child_route__getCode = require('./child_routes/getCode');


/*
  /api/user
*/
router.post('/createCodeGroup', child_route__createCodeGroup);
router.post('/modifyCodeGroup', child_route__modifyCodeGroup);
router.post('/deleteCodeGroup', child_route__deleteCodeGroup);
router.post('/restoreCodeGroup', child_route__restoreCodeGroup);
router.post('/getCodeGroup', child_route__getCodeGroup);


router.post('/createCode', child_route__createCode);
router.post('/modifyCode', child_route__modifyCode);
router.post('/deleteCode', child_route__deleteCode);
router.post('/restoreCode', child_route__restoreCode);
router.post('/getCode', child_route__getCode);


module.exports = router;
