const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const myDate = require('../../librarys/myDate');
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');
const myGetMakeToken = require('../../librarys/myGetMakeToken').myGetMakeToken;
const myGetFileNameAndType = require('../../librarys/myGetFileNameAndType').myGetFileNameAndType;
const myResultCode = require('../../librarys/myResultCode');
const db = require('../../../models/index');
const wrapper = require('../../librarys/myAsyncWrapper');


const child_route__getDownloadedCount = require('./child_routes/getDownloadedCount');
const child_route__getUploadedFileCount = require('./child_routes/getUploadedFileCount');
const child_route__getDownloadedSize = require('./child_routes/getDownloadedSize');


router.post('/getDownloadedCount', jwtTokenCheck, child_route__getDownloadedCount);
router.post('/getUploadedFileCount', jwtTokenCheck, child_route__getUploadedFileCount);
router.post('/getDownloadedSize', jwtTokenCheck, child_route__getDownloadedSize);


module.exports = router;
