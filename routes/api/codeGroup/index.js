const express = require('express');
const router = express.Router();

const child_route__createCodeGroup = require('./child_routes/createCodeGroup');
const child_route__modifyCodeGroup = require('./child_routes/modifyCodeGroup');
const child_route__deleteCodeGroup = require('./child_routes/deleteCodeGroup');
const child_route__restoreCodeGroup = require('./child_routes/restoreCodeGroup');
const child_route__getCodeGroup = require('./child_routes/getCodeGroup');


/*
  /api/code
*/
router.post('/createCodeGroup', child_route__createCodeGroup);
router.post('/modifyCodeGroup', child_route__modifyCodeGroup);
router.post('/deleteCodeGroup', child_route__deleteCodeGroup);
router.post('/restoreCodeGroup', child_route__restoreCodeGroup);
router.post('/getCodeGroup', child_route__getCodeGroup);



module.exports = router;
