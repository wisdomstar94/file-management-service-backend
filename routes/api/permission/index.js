const express = require('express');
const router = express.Router();
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');


const child_route__createPermission = require('./child_routes/createPermission');
const child_route__getPermission = require('./child_routes/getPermission');
const child_route__modifyPermission = require('./child_routes/modifyPermission');
const child_route__deletePermission = require('./child_routes/deletePermission');
const child_route__restorePermission = require('./child_routes/restorePermission');


/*
  /api/permission
*/
router.post('/createPermission', jwtTokenCheck, child_route__createPermission);
router.post('/getPermission', jwtTokenCheck, child_route__getPermission);
router.post('/modifyPermission', jwtTokenCheck, child_route__modifyPermission);
router.post('/deletePermission', jwtTokenCheck, child_route__deletePermission);
router.post('/restorePermission', jwtTokenCheck, child_route__restorePermission);



module.exports = router;
