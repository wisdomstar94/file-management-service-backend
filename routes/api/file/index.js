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


const uploadFilePermissionCheck = require('../../middlewares/uploadFilePermissionCheck');
// const modifyFilePermissionCheck = require('../../middlewares/modifyFilePermissionCheck');



const uploadFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const YYYYMM_folder_name = myDate().format('YYYYMM');

    const check_folder = path.join(__dirname, '..', '..', '..', '..', 'filesImages', YYYYMM_folder_name + '/');
    !fs.existsSync(check_folder) && fs.mkdirSync(check_folder, { recursive: true });

    // req.fileImageSaveFolder = check_folder;
    req.fileImageYYYYMM = YYYYMM_folder_name;

    cb(null, check_folder);
  },
  filename: function (req, file, cb) {
    const getFileNameAndTypes = myGetFileNameAndType({ full_file_name: file.originalname });
    
    const allow_files = [
      'jpg', 'jpeg', 'png', 'gif',
      'JPG', 'JPEG', 'PNG', 'GIF',
    ];
    
    let filename = getFileNameAndTypes.file_only_name + '_' + myGetMakeToken({ strlength: 40 }) + '.' + getFileNameAndTypes.file_only_type;
    if (!allow_files.includes(getFileNameAndTypes.file_only_type)) {
      filename = filename + '.blocked';
    }
    
    cb(null, filename); // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
});
const uploadFileUpload = multer({ 
  storage: uploadFileStorage, 
  limits: { fileSize: 1000 * 1024 * 1024 } // 1000mb (1 * 1024 * 1024 = 1MB)
});




const modifyFileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const YYYYMM_folder_name = myDate().format('YYYYMM');

    const check_folder = path.join(__dirname, '..', '..', '..', '..', 'filesImages', YYYYMM_folder_name + '/');
    !fs.existsSync(check_folder) && fs.mkdirSync(check_folder, { recursive: true });

    // req.fileImageSaveFolder = check_folder;
    req.fileImageYYYYMM = YYYYMM_folder_name;

    cb(null, check_folder);
  },
  filename: wrapper(async(req, file, cb) => {
    /*
      -- file --
      {
        fieldname: 'fileScreenShot',
        originalname: 'sample_5.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg'
      }
    */

    const loginInfo = req.loginInfo;
    /*
      loginInfo.userKey: 'C1618033738099vtEiUg',
      loginInfo.userId: 'test123',
      loginInfo.userName: '홍길동',
      loginInfo.ip: '::ffff:172.17.0.1'
    */
    const isFileAllModifyPossible = await db.isActivePermission(loginInfo.userKey, 'Kx1619158838238pCDXS');


    if (file.fieldname === 'fileScreenShot') {
      if (!isFileAllModifyPossible) {
        const isFileScreenShotModifyPossible = await db.isActivePermission(loginInfo.userKey, 'GpGYwJt1619159095273');
        if (!isFileScreenShotModifyPossible) {
          const error = {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20025510,
            msg: myResultCode[20025510].msg,
          };
          throw new Error(JSON.stringify(error));
        }
      }
    }

    if (file.fieldname === 'fileRepresentImage') {
      if (!isFileAllModifyPossible) {
        const isFileRepresentImageModifyPossible = await db.isActivePermission(loginInfo.userKey, 'iFnb1619159115861ZNK');
        if (!isFileRepresentImageModifyPossible) {
          const error = {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20025520,
            msg: myResultCode[20025520].msg,
          };
          throw new Error(JSON.stringify(error));
        }
      }
    }


    const getFileNameAndTypes = myGetFileNameAndType({ full_file_name: file.originalname });
    
    const allow_files = [
      'jpg', 'jpeg', 'png', 'gif',
      'JPG', 'JPEG', 'PNG', 'GIF',
    ];
    
    let filename = getFileNameAndTypes.file_only_name + '_' + myGetMakeToken({ strlength: 40 }) + '.' + getFileNameAndTypes.file_only_type;
    if (!allow_files.includes(getFileNameAndTypes.file_only_type)) {
      filename = filename + '.blocked';
    }
    
    cb(null, filename); // cb 콜백함수를 통해 전송된 파일 이름 설정
  })
});
const modifyFileUpload = multer({ 
  storage: modifyFileStorage, 
  limits: { fileSize: 1000 * 1024 * 1024 } // 1000mb (1 * 1024 * 1024 = 1MB)
});




const child_route__uploadFile = require('./child_routes/uploadFile');
const child_route__modifyFile = require('./child_routes/modifyFile');
const child_route__getFile = require('./child_routes/getFile');
const child_route__fileBasicInfo = require('./child_routes/fileBasicInfo');
const child_route__fileDownloadUrlOuterInfo = require('./child_routes/fileDownloadUrlOuterInfo');


/*
  /api/file
*/
router.post('/uploadFile', jwtTokenCheck, uploadFilePermissionCheck, uploadFileUpload.fields([
  {
    name: 'fileScreenShot',
    maxCount: 50,
  },
  {
    name: 'fileRepresentImage',
    maxCount: 1,
  },
]), child_route__uploadFile);

router.post('/modifyFile', jwtTokenCheck, modifyFileUpload.fields([
  {
    name: 'fileScreenShot',
    maxCount: 50,
  },
  {
    name: 'fileRepresentImage',
    maxCount: 1,
  },
]), child_route__modifyFile);

router.post('/getFile', jwtTokenCheck, child_route__getFile);
router.post('/fileBasicInfo', jwtTokenCheck, child_route__fileBasicInfo);
router.post('/fileDownloadUrlOuterInfo', child_route__fileDownloadUrlOuterInfo);


module.exports = router;
