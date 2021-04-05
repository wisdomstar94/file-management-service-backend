const express = require('express');
const router = express.Router();


const child_route__createMenu = require('./child_routes/createMenu');
const child_route__getMenu = require('./child_routes/getMenu');
const child_route__modifyMenu = require('./child_routes/modifyMenu');
const child_route__deleteMenu = require('./child_routes/deleteMenu');
const child_route__restoreMenu = require('./child_routes/restoreMenu');


/*
  /api/menu
*/
router.post('/createMenu', child_route__createMenu);
router.post('/getMenu', child_route__getMenu);
router.post('/modifyMenu', child_route__modifyMenu);
router.post('/deleteMenu', child_route__deleteMenu);
router.post('/restoreMenu', child_route__restoreMenu);



module.exports = router;
