const express = require('express');
const router = express.Router();


const child_route__createPermissionGroupUpload = require('./child_routes/createPermissionGroupUpload');
// const child_route__getPermissionGroup = require('./child_routes/getPermissionGroup');
// const child_route__modifyPermissionGroup = require('./child_routes/modifyPermissionGroup');
// const child_route__deletePermissionGroup = require('./child_routes/deletePermissionGroup');
// const child_route__restorePermissionGroup = require('./child_routes/restorePermissionGroup');


/*
  /api/permissionGroup
*/
router.post('/createPermissionGroupUpload', child_route__createPermissionGroupUpload);
// router.post('/getPermissionGroup', child_route__getPermissionGroup);
// router.post('/modifyPermissionGroup', child_route__modifyPermissionGroup);
// router.post('/deletePermissionGroup', child_route__deletePermissionGroup);
// router.post('/restorePermissionGroup', child_route__restorePermissionGroup);



module.exports = router;
