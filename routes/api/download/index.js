const express = require('express');
const router = express.Router();
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');

const child_route__file = require('./child_routes/file');
const child_route__fileAdmin = require('./child_routes/fileAdmin');
const child_route__downloadPasswordCheck = require('./child_routes/downloadPasswordCheck');
const child_route__statistics = require('./child_routes/statistics');
const child_route__statisticsDetailInfo = require('./child_routes/statisticsDetailInfo');
const child_route__downloadCheck = require('./child_routes/downloadCheck');
const child_route__yyyymmList = require('./child_routes/yyyymmList');


/*
  /api/download
*/
router.get('/file/:fileDownloadUrlKey', child_route__file);
router.get('/fileAdmin/:fileVersionKey', jwtTokenCheck, child_route__fileAdmin);
router.post('/downloadCheck', child_route__downloadCheck);
router.post('/downloadPasswordCheck', child_route__downloadPasswordCheck);
router.post('/statistics', jwtTokenCheck, child_route__statistics);
router.post('/statistics/detailInfo', jwtTokenCheck, child_route__statisticsDetailInfo);
router.post('/yyyymmList', jwtTokenCheck, child_route__yyyymmList);


module.exports = router;
