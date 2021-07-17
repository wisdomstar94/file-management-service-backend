const express = require('express');
const router = express.Router();
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');


const child_route__createPermissionGroup = require('./child_routes/createPermissionGroup');
const child_route__getPermissionGroup = require('./child_routes/getPermissionGroup');
const child_route__getPermissionGroupInfo = require('./child_routes/getPermissionGroupInfo');
const child_route__modifyPermissionGroup = require('./child_routes/modifyPermissionGroup');
const child_route__deletePermissionGroup = require('./child_routes/deletePermissionGroup');
const child_route__restorePermissionGroup = require('./child_routes/restorePermissionGroup');
const child_route__copyPermissionGroup = require('./child_routes/copyPermissionGroup');


/*
  /api/permissionGroup
*/
router.post('/createPermissionGroup', jwtTokenCheck, child_route__createPermissionGroup);
router.post('/getPermissionGroup', jwtTokenCheck, child_route__getPermissionGroup);
router.post('/getPermissionGroupInfo', jwtTokenCheck, child_route__getPermissionGroupInfo);
router.post('/modifyPermissionGroup', jwtTokenCheck, child_route__modifyPermissionGroup);
router.post('/deletePermissionGroup', jwtTokenCheck, child_route__deletePermissionGroup);
router.post('/restorePermissionGroup', jwtTokenCheck, child_route__restorePermissionGroup);
router.post('/copyPermissionGroup', jwtTokenCheck, child_route__copyPermissionGroup);


module.exports = router;
