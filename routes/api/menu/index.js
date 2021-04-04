const express = require('express');
const router = express.Router();


const child_route__createMenu = require('./child_routes/createMenu');
const child_route__getMenu = require('./child_routes/getMenu');
// const child_route__modifyMenuCategory = require('./child_routes/modifyMenuCategory');
// const child_route__deleteMenuCategory = require('./child_routes/deleteMenuCategory');
// const child_route__restoreMenuCategory = require('./child_routes/restoreMenuCategory');


/*
  /api/menu
*/
router.post('/createMenu', child_route__createMenu);
router.post('/getMenu', child_route__getMenu);
// router.post('/modifyMenuCategory', child_route__modifyMenuCategory);
// router.post('/deleteMenuCategory', child_route__deleteMenuCategory);
// router.post('/restoreMenuCategory', child_route__restoreMenuCategory);



module.exports = router;
