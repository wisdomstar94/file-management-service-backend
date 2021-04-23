const express = require('express');
const router = express.Router();
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');


const child_route__createCodeGroup = require('./child_routes/createCodeGroup');
const child_route__modifyCodeGroup = require('./child_routes/modifyCodeGroup');
const child_route__deleteCodeGroup = require('./child_routes/deleteCodeGroup');
const child_route__restoreCodeGroup = require('./child_routes/restoreCodeGroup');
const child_route__getCodeGroup = require('./child_routes/getCodeGroup');


/*
  /api/code
*/
router.post('/createCodeGroup', jwtTokenCheck, child_route__createCodeGroup);
router.post('/modifyCodeGroup', jwtTokenCheck, child_route__modifyCodeGroup);
router.post('/deleteCodeGroup', jwtTokenCheck, child_route__deleteCodeGroup);
router.post('/restoreCodeGroup', jwtTokenCheck, child_route__restoreCodeGroup);
router.post('/getCodeGroup', jwtTokenCheck, child_route__getCodeGroup);



module.exports = router;
