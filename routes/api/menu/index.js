const express = require('express');
const router = express.Router();
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');


const child_route__createMenu = require('./child_routes/createMenu');
const child_route__getMenu = require('./child_routes/getMenu');
const child_route__modifyMenu = require('./child_routes/modifyMenu');
const child_route__deleteMenu = require('./child_routes/deleteMenu');
const child_route__restoreMenu = require('./child_routes/restoreMenu');
const child_route__getUserMenu = require('./child_routes/getUserMenu');


/*
  /api/menu
*/
router.post('/createMenu', jwtTokenCheck, child_route__createMenu);
router.post('/getMenu', jwtTokenCheck, child_route__getMenu);
router.post('/modifyMenu', jwtTokenCheck, child_route__modifyMenu);
router.post('/deleteMenu', jwtTokenCheck, child_route__deleteMenu);
router.post('/restoreMenu', jwtTokenCheck, child_route__restoreMenu);
router.post('/getUserMenu', jwtTokenCheck, child_route__getUserMenu);



module.exports = router;
