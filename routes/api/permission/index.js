const express = require('express');
const router = express.Router();


const child_route__createPermission = require('./child_routes/createPermission');
const child_route__getPermission = require('./child_routes/getPermission');
// const child_route__modifyMenu = require('./child_routes/modifyMenu');
// const child_route__deleteMenu = require('./child_routes/deleteMenu');
// const child_route__restoreMenu = require('./child_routes/restoreMenu');


/*
  /api/permission
*/
router.post('/createPermission', child_route__createPermission);
router.post('/getPermission', child_route__getPermission);
// router.post('/modifyMenu', child_route__modifyMenu);
// router.post('/deleteMenu', child_route__deleteMenu);
// router.post('/restoreMenu', child_route__restoreMenu);



module.exports = router;
