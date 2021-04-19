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
const child_route__modifyFileDownloadUrl = require('./child_routes/modifyFileDownloadUrl');




/*
  /api/fileDownloadUrl
*/
router.post('/createFileDownloadUrl', jwtTokenCheck, child_route__createFileDownloadUrl);
router.post('/modifyFileDownloadUrl', jwtTokenCheck, child_route__modifyFileDownloadUrl);



module.exports = router;
