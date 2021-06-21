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

const uploadFileVersionPermissionCheck = require('../../middlewares/uploadFileVersionPermissionCheck');



const uploadFileVersionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const YYYYMM_folder_name = myDate().format('YYYYMM');

    const check_folder = path.join(__dirname, '..', '..', '..', '..', 'files', YYYYMM_folder_name + '/');
    !fs.existsSync(check_folder) && fs.mkdirSync(check_folder, { recursive: true });

    // req.fileImageSaveFolder = check_folder;
    req.fileVersionYYYYMM = YYYYMM_folder_name;

    cb(null, check_folder);
  },
  filename: function (req, file, cb) {
    const getFileNameAndTypes = myGetFileNameAndType({ full_file_name: file.originalname });
    
    // const allow_files = [
    //   'jpg', 'jpeg', 'png', 'gif',
    //   'JPG', 'JPEG', 'PNG', 'GIF',
    // ];
    
    let filename = getFileNameAndTypes.file_only_name + '_' + myGetMakeToken({ strlength: 40 }) + '.' + getFileNameAndTypes.file_only_type;
    // if (!allow_files.includes(getFileNameAndTypes.file_only_type)) {
    //   filename = filename + '.blocked';
    // }
    
    cb(null, filename); // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
});
const uploadFileVersionUpload = multer({ 
  storage: uploadFileVersionStorage, 
  limits: { fileSize: 1000 * 1024 * 1024 } // 1000mb (1 * 1024 * 1024 = 1MB)
});


const modifyFileVersionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const YYYYMM_folder_name = myDate().format('YYYYMM');

    const check_folder = path.join(__dirname, '..', '..', '..', '..', 'files', YYYYMM_folder_name + '/');
    !fs.existsSync(check_folder) && fs.mkdirSync(check_folder, { recursive: true });

    // req.fileImageSaveFolder = check_folder;
    req.fileVersionYYYYMM = YYYYMM_folder_name;

    cb(null, check_folder);
  },
  filename: wrapper(async(req, file, cb) => {
    const loginInfo = req.loginInfo;
    /*
      loginInfo.userKey: 'C1618033738099vtEiUg',
      loginInfo.userId: 'test123',
      loginInfo.userName: '홍길동',
      loginInfo.ip: '::ffff:172.17.0.1'
    */
    const isFileVersionAllModifyPossible = await db.isActivePermission(loginInfo.userKey, 'SioYPe1619178659344f');

    if (file.fieldname === 'versionFile') {
      if (!isFileVersionAllModifyPossible) {
        const isFileScreenShotModifyPossible = await db.isActivePermission(loginInfo.userKey, 'htAo1619178257967HIQ');
        if (!isFileScreenShotModifyPossible) {
          const error = {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20032020,
            msg: myResultCode[20032020].msg,
          };
          throw new Error(JSON.stringify(error));
        }
      }
    }


    const getFileNameAndTypes = myGetFileNameAndType({ full_file_name: file.originalname });
    
    // const allow_files = [
    //   'jpg', 'jpeg', 'png', 'gif',
    //   'JPG', 'JPEG', 'PNG', 'GIF',
    // ];
    
    let filename = getFileNameAndTypes.file_only_name + '_' + myGetMakeToken({ strlength: 40 }) + '.' + getFileNameAndTypes.file_only_type;
    // if (!allow_files.includes(getFileNameAndTypes.file_only_type)) {
    //   filename = filename + '.blocked';
    // }
    
    cb(null, filename); // cb 콜백함수를 통해 전송된 파일 이름 설정
  })
});
const modifyFileVersionUpload = multer({ 
  storage: modifyFileVersionStorage, 
  limits: { fileSize: 1000 * 1024 * 1024 } // 1000mb (1 * 1024 * 1024 = 1MB)
});




const child_route__uploadFileVersion = require('./child_routes/uploadFileVersion');
const child_route__modifyFileVersion = require('./child_routes/modifyFileVersion');
const child_route__getFileVersion = require('./child_routes/getFileVersion');
const child_route__versionInfo = require('./child_routes/versionInfo');
const child_route__onlyFileVersionList = require('./child_routes/onlyFileVersionList');


/*
  /api/fileVersion
*/
router.post('/uploadFileVersion', jwtTokenCheck, uploadFileVersionPermissionCheck, uploadFileVersionUpload.fields([
  {
    name: 'versionFile',
    maxCount: 1,
  },
]), child_route__uploadFileVersion);

router.post('/modifyFileVersion', jwtTokenCheck, modifyFileVersionUpload.fields([
  {
    name: 'versionFile',
    maxCount: 1,
  },
]), child_route__modifyFileVersion);

router.post('/getFileVersion', jwtTokenCheck, child_route__getFileVersion);

router.post('/versionInfo', jwtTokenCheck, child_route__versionInfo);

router.post('/onlyFileVersionList', jwtTokenCheck, child_route__onlyFileVersionList);

module.exports = router;
