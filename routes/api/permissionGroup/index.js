const express = require('express');
const router = express.Router();


const child_route__createPermissionGroup = require('./child_routes/createPermissionGroup');
const child_route__getPermissionGroup = require('./child_routes/getPermissionGroup');
// const child_route__modifyPermission = require('./child_routes/modifyPermission');
// const child_route__deletePermission = require('./child_routes/deletePermission');
// const child_route__restorePermission = require('./child_routes/restorePermission');


/*
  /api/permissionGroup
*/
router.post('/createPermissionGroup', child_route__createPermissionGroup);
router.post('/getPermissionGroup', child_route__getPermissionGroup);
// router.post('/modifyPermission', child_route__modifyPermission);
// router.post('/deletePermission', child_route__deletePermission);
// router.post('/restorePermission', child_route__restorePermission);



module.exports = router;
