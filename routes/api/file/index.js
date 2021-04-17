const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const myDate = require('../../librarys/myDate');
const jwtTokenCheck = require('../../middlewares/jwtTokenCheck');
const myGetMakeToken = require('../../librarys/myGetMakeToken').myGetMakeToken;
const myGetFileNameAndType = require('../../librarys/myGetFileNameAndType').myGetFileNameAndType;

const storage = multer.diskStorage({
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
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 1000 * 1024 * 1024 } // 1000mb (1 * 1024 * 1024 = 1MB)
});




const child_route__uploadFile = require('./child_routes/uploadFile');
const child_route__modifyFile = require('./child_routes/modifyFile');
const child_route__getFile = require('./child_routes/getFile');



/*
  /api/file
*/
router.post('/uploadFile', jwtTokenCheck, upload.fields([
  {
    name: 'fileScreenShot',
    maxCount: 50,
  },
  {
    name: 'fileRepresentImage',
    maxCount: 1,
  },
]), child_route__uploadFile);

router.post('/modifyFile', jwtTokenCheck, upload.fields([
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


module.exports = router;
