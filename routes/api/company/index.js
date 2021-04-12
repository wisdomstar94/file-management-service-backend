const express = require('express');
const router = express.Router();
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');

const child_route__createCompany = require('./child_routes/createCompany');
const child_route__modifyCompany = require('./child_routes/modifyCompany');
const child_route__deleteCompany = require('./child_routes/deleteCompany');
// const child_route__restoreCompany = require('./child_routes/restoreCompany');
// const child_route__getCompany = require('./child_routes/getCompany');

/*
  /api/company
*/
router.post('/createCompany', jwtTokenCheck, child_route__createCompany);
router.post('/modifyCompany', jwtTokenCheck, child_route__modifyCompany);
router.post('/deleteCompany', jwtTokenCheck, child_route__deleteCompany);
// router.post('/restoreCompany', child_route__restoreCompany);
// router.post('/getCompany', child_route__getCompany);

module.exports = router;
