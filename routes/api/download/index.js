const express = require('express');
const router = express.Router();
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');

const child_route__file = require('./child_routes/file');
const child_route__downloadPasswordCheck = require('./child_routes/downloadPasswordCheck');


/*
  /api/download
*/
router.get('/file/:fileDownloadUrlKey', child_route__file);
router.post('/downloadPasswordCheck', child_route__downloadPasswordCheck);


module.exports = router;
