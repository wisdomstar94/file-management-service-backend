const express = require('express');
const router = express.Router();


const child_route__applyPermissionGroupUpload = require('./child_routes/applyPermissionGroupUpload');
const child_route__getPermissionGroupUpload = require('./child_routes/getPermissionGroupUpload');
// const child_route__modifyPermissionGroup = require('./child_routes/modifyPermissionGroup');
// const child_route__deletePermissionGroup = require('./child_routes/deletePermissionGroup');
// const child_route__restorePermissionGroup = require('./child_routes/restorePermissionGroup');


/*
  /api/permissionGroup
*/
router.post('/applyPermissionGroupUpload', child_route__applyPermissionGroupUpload);
router.post('/getPermissionGroupUpload', child_route__getPermissionGroupUpload);
// router.post('/modifyPermissionGroup', child_route__modifyPermissionGroup);
// router.post('/deletePermissionGroup', child_route__deletePermissionGroup);
// router.post('/restorePermissionGroup', child_route__restorePermissionGroup);



module.exports = router;
