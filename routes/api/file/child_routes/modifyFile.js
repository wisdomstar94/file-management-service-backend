const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const jwt = require('jsonwebtoken');
const myCrypto = require('../../../librarys/myCrypto');
const myLogger = require('../../../librarys/myLogger');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');
const myBoard = require('../../../librarys/myBoard');
const myRegularExpressCheck = require('../../../librarys/myRegularExpressCheck');
const { Op, Sequelize } = require('sequelize');
require('dotenv').config();

/*
  upload.fields([
    {
      name: 'fileScreenShot',
      maxCount: 50,
    },
    {
      name: 'fileRepresentImage',
      maxCount: 1,
    },
  ])
*/
const modifyFile = wrapper(async(req, res, next) => {
  console.log('req.files', req.files);
  if (req.files === undefined) {
    req.files = {};
  }
  /*
    >>> req.files 내용 예시 <<<
    req.files [Object: null prototype] {
      fileScreenShot: [
        {
          fieldname: 'fileScreenShot',
          originalname: 'sample_1.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          destination: '/home/project/file-management-service/files/apks/',
          filename: 'sample_1_IWsVROkNZINGHv1618205144598rPFdNSxQBmLLq.jpg',
          path: '/home/project/file-management-service/files/apks/sample_1_IWsVROkNZINGHv1618205144598rPFdNSxQBmLLq.jpg',
          size: 68811
        },
        {
          fieldname: 'fileScreenShot',
          originalname: 'sample_2.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          destination: '/home/project/file-management-service/files/apks/',
          filename: 'sample_2_tfKfOZjMjdmfgZxIRdsrEtCMzl1618205144600d.jpg',
          path: '/home/project/file-management-service/files/apks/sample_2_tfKfOZjMjdmfgZxIRdsrEtCMzl1618205144600d.jpg',
          size: 59299
        },
        {
          fieldname: 'fileScreenShot',
          originalname: 'sample_3.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          destination: '/home/project/file-management-service/files/apks/',
          filename: 'sample_3_IQPmdVuVmqTPQQkpImiXptTg1618205144601xxy.jpg',
          path: '/home/project/file-management-service/files/apks/sample_3_IQPmdVuVmqTPQQkpImiXptTg1618205144601xxy.jpg',
          size: 201623
        }
      ],
      fileRepresentImage: [
        {
          fieldname: 'fileRepresentImage',
          originalname: 'sample_5.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          destination: '/home/project/file-management-service/files/apks/',
          filename: 'sample_5_MniIFHiXTrQguz1618205144603oYRzrEHGHHsUX.jpg',
          path: '/home/project/file-management-service/files/apks/sample_5_MniIFHiXTrQguz1618205144603oYRzrEHGHHsUX.jpg',
          size: 57589
        }
      ]
    }
  */
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */

  await db.insertLog({
    logType: 'LOGTY00000027', // 파일 수정 시도
    createdIp: req.real_ip,
    accessUniqueKey: req.accessUniqueKey,
    userKey: loginInfo.userKey,
    // value1: JSON.stringify(userId),
    // value2: JSON.stringify(userPhone),
    // logContent: ``,
  });  

  const isFileAllModifyPossible = await db.isActivePermission(loginInfo.userKey, 'Kx1619158838238pCDXS');

  const {
    fileKey,
    fileLabelName,
    fileMemo,
    fileDescription,
    fileImageScreenShotInfoJsonString,
    fileImageRepresentInfoJsonString,
    fileStoreVersionHistoryOpen,
    fileStoreDescriptionOpen,
    fileStatus,

    isFileRepresentImageDelete, // Y or N
  } = req.body;

  /*
    @@@@@@@@@@@@@@@@@@@@@@@@@
    파일 기본 정보 체크
    @@@@@@@@@@@@@@@@@@@@@@@@@
  */  
  // fileKey 체크 : required
  if (typeof fileKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026010,
        msg: myResultCode[20026010].msg,
      },
    }));
    return;
  }

  if (fileKey.trim() === ''){
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026020,
        msg: myResultCode[20026020].msg,
      },
    }));
    return;
  }

  if (fileKey.length !== 20){
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026030,
        msg: myResultCode[20026030].msg,
      },
    }));
    return;
  }

  const fileKeyResult = await db.FmsFiles.findOne({
    where: {
      fileKey: fileKey,
    },
  });
  if (fileKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026040,
        msg: myResultCode[20026040].msg,
      },
    }));
    return;
  }

  // fileLabelName 체크 : optional
  if (fileLabelName !== undefined && typeof fileLabelName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026050,
        msg: myResultCode[20026050].msg,
      },
    }));
    return;
  }

  if (typeof fileLabelName === 'string') {
    if (!isFileAllModifyPossible) {
      const isFileLabelNameModifyPossible = await db.isActivePermission(loginInfo.userKey, 'kgHt1619158968829afj');
      if (!isFileLabelNameModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20026059,
            msg: myResultCode[20026059].msg,
          },
        }));
        return;
      }
    }

    if (fileLabelName.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20026060,
          msg: myResultCode[20026060].msg,
        },
      }));
      return;
    }

    if (fileLabelName.length > 100) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20026070,
          msg: myResultCode[20026070].msg,
        },
      }));
      return;
    }
  }

  // fileMemo 체크 : optional
  if (fileMemo !== null && fileMemo !== undefined && typeof fileMemo !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026080,
        msg: myResultCode[20026080].msg,
      },
    }));
    return;
  }

  if (fileMemo === null || typeof fileMemo === 'string') {
    if (!isFileAllModifyPossible) {
      const isFileAABAModifyPossible = await db.isActivePermission(loginInfo.userKey, 'cjozg1619158988578Dy');
      if (!isFileAABAModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20026089,
            msg: myResultCode[20026089].msg,
          },
        }));
        return;
      }
    }
  }

  if (typeof fileMemo === 'string') {
    if (fileMemo.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20026090,
          msg: myResultCode[20026090].msg,
        },
      }));
      return;
    }
  }

  // fileDescription 체크 : optional
  if (fileDescription !== null && fileDescription !== undefined && typeof fileDescription !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026100,
        msg: myResultCode[20026100].msg,
      },
    }));
    return;
  }

  if (fileDescription === null || typeof fileDescription === 'string') {
    if (!isFileAllModifyPossible) {
      const isFileAABAModifyPossible = await db.isActivePermission(loginInfo.userKey, 'Setv1619159012587hpx');
      if (!isFileAABAModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20026109,
            msg: myResultCode[20026109].msg,
          },
        }));
        return;
      }
    }
  }

  if (typeof fileDescription === 'string') {
    if (fileDescription.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20026110,
          msg: myResultCode[20026110].msg,
        },
      }));
      return;
    }
  }

  // fileImageScreenShotInfoJsonString 체크
  if (typeof fileImageScreenShotInfoJsonString !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026120,
        msg: myResultCode[20026120].msg,
      },
    }));
    return;
  }

  if (!myCommon.isJsonString(fileImageScreenShotInfoJsonString)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026130,
        msg: myResultCode[20026130].msg,
      },
    }));
    return;
  }

  const fileImageScreenShotInfo = JSON.parse(fileImageScreenShotInfoJsonString);

  // fileImageScreenShotInfo 체크
  /*
    -- fileImageScreenShotInfo --
    [
      {
        infoType: 'new', // new or original or delete
        fileImageKey: 'wVjyX1618211991676Se', // original인 경우만 해당 값 존재
        sortNo: 1,
      }
    ]
  */
  if (!Array.isArray(fileImageScreenShotInfo)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026140,
        msg: myResultCode[20026140].msg,
      },
    }));
    return;
  }

  if (fileImageScreenShotInfo.length > 0) {
    if (!isFileAllModifyPossible) {
      const isFileImageScreenShotModifyPossible = await db.isActivePermission(loginInfo.userKey, 'GpGYwJt1619159095273');
      if (!isFileImageScreenShotModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20026141,
            msg: myResultCode[20026141].msg,
          },
        }));
        return;
      }
    }
  }

  const newImageScreenShotSort = [];
  for (let i = 0; i < fileImageScreenShotInfo.length; i++) {
    if (fileImageScreenShotInfo[i].infoType === 'new') {
      newImageScreenShotSort.push(fileImageScreenShotInfo[i].sortNo);
    }
  }

  if (Array.isArray(req.files.fileScreenShot)) {
    if (newImageScreenShotSort.length !== req.files.fileScreenShot.length){
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20026142,
          msg: myResultCode[20026142].msg,
        },
      }));
      return;
    }
  }

  // fileImageRepresentInfoJsonString 체크
  if (typeof fileImageRepresentInfoJsonString !=='string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026150,
        msg: myResultCode[20026150].msg,
      },
    }));
    return;
  }

  if (!myCommon.isJsonString(fileImageRepresentInfoJsonString)){
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026160,
        msg: myResultCode[20026160].msg,
      },
    }));
    return;
  }

  const fileImageRepresentInfo = JSON.parse(fileImageRepresentInfoJsonString);

  // fileImageRepresentInfo 체크
  /*
    -- fileImageRepresentInfo --
    [
      {
        infoType: 'new', // new or original or delete
        fileImageKey: 'wVjyX1618211991676Se', // original인 경우만 해당 값 존재
        sortNo: 1,
      }
    ]
  */
  if (!Array.isArray(fileImageRepresentInfo)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026170,
        msg: myResultCode[20026170].msg,
      },
    }));
    return;
  }

  if (fileImageRepresentInfo.length > 0) {
    if (!isFileAllModifyPossible) {
      const isFileRepresentImageModifyPossible = await db.isActivePermission(loginInfo.userKey, 'iFnb1619159115861ZNK');
      if (!isFileRepresentImageModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20026171,
            msg: myResultCode[20026171].msg,
          },
        }));
        return;
      }
    }
  }

  const newImageRepresentSort = [];
  for (let i = 0; i < fileImageRepresentInfo.length; i++) {
    if (fileImageRepresentInfo[i].infoType === 'new') {
      newImageRepresentSort.push(fileImageRepresentInfo[i].sortNo);
    }
  }

  if (Array.isArray(req.files.fileRepresentImage)) {
    if (newImageRepresentSort.length !== req.files.fileRepresentImage.length){
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20026172,
          msg: myResultCode[20026172].msg,
        },
      }));
      return;
    }
  }

  // fileStoreVersionHistoryOpen 체크 : optional
  if (fileStoreVersionHistoryOpen !== undefined && typeof fileStoreVersionHistoryOpen !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026180,
        msg: myResultCode[20026180].msg,
      },
    }));
    return;
  }

  if (typeof fileStoreVersionHistoryOpen === 'string') {
    if (!isFileAllModifyPossible) {
      const isFileStoreVersionHistoryOpenModifyPossible = await db.isActivePermission(loginInfo.userKey, 'ENRTwOP1619159031243');
      if (!isFileStoreVersionHistoryOpenModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20026189,
            msg: myResultCode[20026189].msg,
          },
        }));
        return;
      }
    }

    if (fileStoreVersionHistoryOpen !== 'Y' && fileStoreVersionHistoryOpen !== 'N') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20026190,
          msg: myResultCode[20026190].msg,
        },
      }));
      return;
    }
  }

  // fileStoreDescriptionOpen 체크 : optional
  if (fileStoreDescriptionOpen !== undefined && typeof fileStoreDescriptionOpen !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026200,
        msg: myResultCode[20026200].msg,
      },
    }));
    return;
  }

  if (typeof fileStoreDescriptionOpen === 'string') {
    if (!isFileAllModifyPossible) {
      const isFileAABAModifyPossible = await db.isActivePermission(loginInfo.userKey, 'Xx1619159049782JpLKV');
      if (!isFileAABAModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20026209,
            msg: myResultCode[20026209].msg,
          },
        }));
        return;
      }
    }

    if (fileStoreDescriptionOpen !== 'Y' && fileStoreDescriptionOpen !== 'N') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20026210,
          msg: myResultCode[20026210].msg,
        },
      }));
      return;
    }
  }

  // fileStatus 체크 : optional
  if (fileStatus !== undefined && typeof fileStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20026220,
        msg: myResultCode[20026220].msg,
      },
    }));
    return;
  }

  if (typeof fileStatus === 'string') {
    if (!isFileAllModifyPossible) {
      const isFileAABAModifyPossible = await db.isActivePermission(loginInfo.userKey, 'KygH1619159135190rkp');
      if (!isFileAABAModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20026229,
            msg: myResultCode[20026229].msg,
          },
        }));
        return;
      }
    }

    if (fileStatus.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20026230,
          msg: myResultCode[20026230].msg,
        },
      }));
      return;
    }

    if (fileStatus.length !== 13) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20026240,
          msg: myResultCode[20026240].msg,
        },
      }));
      return;
    }

    const fileStatusCheck = await db.FmsCodes.isValidCode('FISTS', fileStatus);
    if (!fileStatusCheck) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20026250,
          msg: myResultCode[20026250].msg,
        },
      }));
      return;
    }
  }

  // transaction 시작
  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');

  try {
    const hostname = req.headers.host;
    let httpHead = 'http://';
    if (req.headers.host.indexOf(':') === -1) {
      httpHead = 'https://';
    }
    const baseUrl = httpHead + hostname;

    // 1) 기존 파일 정보 수정
    const update = {
      fileLabelName: fileLabelName,
      fileMemo: fileMemo,
      fileDescription: fileDescription,
      fileStoreVersionHistoryOpen: fileStoreVersionHistoryOpen,
      fileStoreDescriptionOpen: fileStoreDescriptionOpen,
      updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
      updatedIp: req.real_ip,
      updaterUserKey: loginInfo.userKey,
      fileStatus: fileStatus,
    };

    await db.FmsFiles.update(update, {
      where: {
        fileKey: fileKey,
      },
      transaction: transaction,
    })

    // 2) 파일 대표 이미지 정보 등록
    if (Array.isArray(req.files.fileRepresentImage)) {
      for (let i = 0; i < req.files.fileRepresentImage.length; i++) {
        const fileItem = req.files.fileRepresentImage[i];

        const newFileImageKey = myGetMakeToken({ strlength: 20 });

        await db.FmsFileImages.create({
          fileImageKey: newFileImageKey,
          fileImageType: 'FIMST00000002',
          fileKey: fileKey,
          fileImageOriginalName: fileItem.originalname,
          fileImageConvertName: fileItem.filename,
          fileYYYYMM: req.fileImageYYYYMM,
          fileSize: fileItem.size,
          filePath: fileItem.path,
          fileAccessUrl: baseUrl + '/file/image/' + req.fileImageYYYYMM + '/' + fileItem.filename,
          sortNo: newImageRepresentSort[i],
          createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
          createdIp: req.real_ip,
          fileImageStatus: 'FIMSS00000001',
        }, {
          transaction: transaction,
        });
      }
    }

    // 3) 기존 대표 이미지 정보 수정
    for (let i = 0; i < fileImageRepresentInfo.length; i++) {
      if (typeof fileImageRepresentInfo[i].fileImageKey !== 'string') {
        continue;
      }

      if (fileImageRepresentInfo[i].fileImageKey.trim() === '') {
        continue;
      }

      if (fileImageRepresentInfo[i].fileImageKey.length !== 20) {
        continue;
      }

      const update = {
        updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
        updatedIp: req.real_ip,
      };

      if (fileImageRepresentInfo[i].infoType === 'delete') {
        update.isDeletedRow = 'Y';
      } else {
        update.sortNo = fileImageRepresentInfo[i].sortNo;
      }

      await db.FmsFileImages.update(update, {
        where: {
          fileImageKey: fileImageRepresentInfo[i].fileImageKey,
        },
        transaction: transaction,
      });
    }

    // 3.5) 대표 이미지 삭제
    if (isFileRepresentImageDelete === 'Y') {
      const update = {
        updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
        updatedIp: req.real_ip,
        fileStatus: 'FIMSS00000002',
        isDeletedRow: 'Y',
      };

      await db.FmsFileImages.update(update, {
        where: {
          fileKey: fileKey,
          fileImageType: 'FIMST00000002',
        },
        transaction: transaction,
      });
    }

    // 4) 파일 스크린샷 이미지 정보 등록
    if (Array.isArray(req.files.fileScreenShot)) {
      for (let i = 0; i < req.files.fileScreenShot.length; i++) {
        const fileItem = req.files.fileScreenShot[i];

        const newFileImageKey = myGetMakeToken({ strlength: 20 });

        await db.FmsFileImages.create({
          fileImageKey: newFileImageKey,
          fileImageType: 'FIMST00000001',
          fileKey: fileKey,
          fileImageOriginalName: fileItem.originalname,
          fileImageConvertName: fileItem.filename,
          fileYYYYMM: req.fileImageYYYYMM,
          fileSize: fileItem.size,
          filePath: fileItem.path,
          fileAccessUrl: baseUrl + '/file/image/' + req.fileImageYYYYMM + '/' + fileItem.filename,
          sortNo: newImageScreenShotSort[i],
          createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
          createdIp: req.real_ip,
          fileImageStatus: 'FIMSS00000001',
        }, {
          transaction: transaction,
        });
      }
    }

    // 5) 기존 스크린샷 이미지 정보 수정
    for (let i = 0; i < fileImageScreenShotInfo.length; i++) {
      if (typeof fileImageScreenShotInfo[i].fileImageKey !== 'string') {
        continue;
      }

      if (fileImageScreenShotInfo[i].fileImageKey.trim() === '') {
        continue;
      }

      if (fileImageScreenShotInfo[i].fileImageKey.length !== 20) {
        continue;
      }

      const update = {
        updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
        updatedIp: req.real_ip,
      };

      if (fileImageScreenShotInfo[i].infoType === 'delete') {
        update.isDeletedRow = 'Y';
      } else {
        update.sortNo = fileImageScreenShotInfo[i].sortNo;
      }

      await db.FmsFileImages.update(update, {
        where: {
          fileImageKey: fileImageScreenShotInfo[i].fileImageKey,
        },
        transaction: transaction,
      });
    }

    // 6) commit
    await transaction.commit();
    myLogger.info(req.logHeadTail + 'transaction commit..!');

    await db.insertLog({
      logType: 'LOGTY00000028', // 파일 수정 성공
      createdIp: req.real_ip,
      accessUniqueKey: req.accessUniqueKey,
      userKey: loginInfo.userKey,
      value1: JSON.stringify(fileKey),
      // value2: JSON.stringify(userPhone),
      logContent: `
        ※ 수정 대상 파일 고유 식별 키 : value1 값 참조

        ※ 수정 전 파일 정보 : \`${JSON.stringify(fileKeyResult)}\`

        ※ 수정 후 파일 정보 : \`${JSON.stringify(update)}\`

        ※ 신규 파일 스크린샷 정보 : \`${JSON.stringify(req.files.fileScreenShot)}\`

        ※ 적용된 파일 스크린샷 정보 : \`${JSON.stringify(fileImageScreenShotInfo)}\`

        ※ 신규 파일 대표 이미지 정보 : \`${JSON.stringify(req.files.fileRepresentImage)}\`

        ※ 적용된 파일 대표 이미지 정보 : \`${JSON.stringify(fileImageRepresentInfo)}\`
      `,
    }); 

    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 10001000,
        fileKey: fileKey,
      },
    }));
    return;
  } catch (e) {
    await transaction.rollback();
    myLogger.info(req.logHeadTail + 'transaction rollback..!');
    myLogger.error(req.logHeadTail + 'e.stack => ' + e.stack);
    myLogger.error(req.logHeadTail + 'e => ' + JSON.stringify(e));
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20026260,
        msg: myResultCode[20026260].msg,
      },
    }));
    return;
  }
});

module.exports = modifyFile;
