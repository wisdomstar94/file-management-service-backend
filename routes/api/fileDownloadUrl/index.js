const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const myDate = require('../../librarys/myDate');
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');
const myGetMakeToken = require('../../librarys/myGetMakeToken').myGetMakeToken;
const myGetFileNameAndType = require('../../librarys/myGetFileNameAndType').myGetFileNameAndType;




const child_route__createFileDownloadUrl = require('./child_routes/createFileDownloadUrl');
// const child_route__modifyFile = require('./child_routes/modifyFile');
// const child_route__getFile = require('./child_routes/getFile');



/*
  /api/fileDownloadUrl
*/
router.post('/createFileDownloadUrl', jwtTokenCheck, child_route__createFileDownloadUrl);



module.exports = router;
