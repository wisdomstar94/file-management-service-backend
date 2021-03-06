const express = require('express');
const router = express.Router();
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');


const child_route__createMenuCategory = require('./child_routes/createMenuCategory');
const child_route__getMenuCategory = require('./child_routes/getMenuCategory');
const child_route__modifyMenuCategory = require('./child_routes/modifyMenuCategory');
const child_route__deleteMenuCategory = require('./child_routes/deleteMenuCategory');
const child_route__restoreMenuCategory = require('./child_routes/restoreMenuCategory');


/*
  /api/menu
*/
router.post('/createMenuCategory', jwtTokenCheck, child_route__createMenuCategory);
router.post('/getMenuCategory', jwtTokenCheck, child_route__getMenuCategory);
router.post('/modifyMenuCategory', jwtTokenCheck, child_route__modifyMenuCategory);
router.post('/deleteMenuCategory', jwtTokenCheck, child_route__deleteMenuCategory);
router.post('/restoreMenuCategory', jwtTokenCheck, child_route__restoreMenuCategory);



module.exports = router;
