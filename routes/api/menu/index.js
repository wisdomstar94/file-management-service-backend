const express = require('express');
const router = express.Router();


const child_route__createMenuCategory = require('./child_routes/createMenuCategory');
const child_route__getMenuCategory = require('./child_routes/getMenuCategory');


/*
  /api/menu
*/
router.post('/createMenuCategory', child_route__createMenuCategory);
router.post('/getMenuCategory', child_route__getMenuCategory);


module.exports = router;
