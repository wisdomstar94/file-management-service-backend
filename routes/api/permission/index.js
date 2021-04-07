const express = require('express');
const router = express.Router();


const child_route__createPermission = require('./child_routes/createPermission');
const child_route__getPermission = require('./child_routes/getPermission');
const child_route__modifyPermission = require('./child_routes/modifyPermission');
const child_route__deletePermission = require('./child_routes/deletePermission');
const child_route__restorePermission = require('./child_routes/restorePermission');


/*
  /api/permission
*/
router.post('/createPermission', child_route__createPermission);
router.post('/getPermission', child_route__getPermission);
router.post('/modifyPermission', child_route__modifyPermission);
router.post('/deletePermission', child_route__deletePermission);
router.post('/restorePermission', child_route__restorePermission);



module.exports = router;
