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
const uploadFile = wrapper(async(req, res, next) => {
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

  const {
    fileLabelName,
    fileMemo,
    fileDescription,
    fileStoreVersionHistoryOpen,
    fileStoreDescriptionOpen,
    fileStatus,
  } = req.body;

  /*
    @@@@@@@@@@@@@@@@@@@@@@@@@
    파일 기본 정보 체크
    @@@@@@@@@@@@@@@@@@@@@@@@@
  */
  // fileLabelName 체크 : required
  if (typeof fileLabelName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20023010,
        msg: myResultCode[20023010].msg,
      },
    }));
    return;
  }

  if (fileLabelName.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20023020,
        msg: myResultCode[20023020].msg,
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
        code: 20023030,
        msg: myResultCode[20023030].msg,
      },
    }));
    return;
  }

  // fileMemo 체크 : optional
  if (fileMemo !== null && fileMemo !== undefined && typeof fileMemo !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20023040,
        msg: myResultCode[20023040].msg,
      },
    }));
    return;
  }

  if (typeof fileMemo === 'string') {
    if (fileMemo.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20023050,
          msg: myResultCode[20023050].msg,
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
        code: 20023060,
        msg: myResultCode[20023060].msg,
      },
    }));
    return;
  }

  if (typeof fileDescription === 'string') {
    if (fileDescription.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20023070,
          msg: myResultCode[20023070].msg,
        },
      }));
      return;
    }
  }

  // fileStoreVersionHistoryOpen 체크 : optional
  if (fileStoreVersionHistoryOpen !== 'Y' && fileStoreVersionHistoryOpen !== 'N') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20023080,
        msg: myResultCode[20023080].msg,
      },
    }));
    return;
  }

  // fileStoreDescriptionOpen 체크 : optional
  if (fileStoreDescriptionOpen !== 'Y' && fileStoreDescriptionOpen !== 'N') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20023090,
        msg: myResultCode[20023090].msg,
      },
    }));
    return;
  }

  // fileStatus 체크 : required
  if (typeof fileStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20023100,
        msg: myResultCode[20023100].msg,
      },
    }));
    return;
  }

  if (fileStatus.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20023110,
        msg: myResultCode[20023110].msg,
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
        code: 20023120,
        msg: myResultCode[20023120].msg,
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
        code: 20023130,
        msg: myResultCode[20023130].msg,
      },
    }));
    return;
  }

  // transaction 시작
  const transaction = await db.sequelize.transaction();
  myLogger.info(req.logHeadTail + 'transaction start..!');

  try {
    const newFileKey = myGetMakeToken({ strlength: 20 });

    // 1) 파일 기본 정보 등록
    await db.FmsFiles.create({
      fileKey: newFileKey,
      fileLabelName: fileLabelName,
      fileMemo: fileMemo,
      fileDescription: fileDescription,
      fileStoreVersionHistoryOpen: fileStoreVersionHistoryOpen,
      fileStoreDescriptionOpen: fileStoreDescriptionOpen,
      createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
      createdIp: req.real_ip,
      createrUserKey: loginInfo.userKey,
      fileStatus: fileStatus,
    }, {
      transaction: transaction,
    });

    // 2) 파일 대표 이미지 정보 등록
    if (Array.isArray(req.files.fileRepresentImage)) {
      for (let i = 0; i < req.files.fileRepresentImage.length; i++) {
        const fileItem = req.files.fileRepresentImage[i];

        const newFileImageKey = myGetMakeToken({ strlength: 20 });

        await db.FmsFileImages.create({
          fileImageKey: newFileImageKey,
          fileImageType: 'FIMST00000002',
          fileKey: newFileKey,
          fileImageOriginalName: fileItem.originalname,
          fileImageConvertName: fileItem.filename,
          fileYYYYMM: req.fileImageYYYYMM,
          fileSize: fileItem.size,
          filePath: fileItem.path,
          fileAccessUrl: null,
          createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
          createdIp: req.real_ip,
          fileImageStatus: 'FIMSS00000001',
        }, {
          transaction: transaction,
        });
      }
    }

    // 3) 파일 스크린샷 이미지 정보 등록
    if (Array.isArray(req.files.fileScreenShot)) {
      for (let i = 0; i < req.files.fileScreenShot.length; i++) {
        const fileItem = req.files.fileScreenShot[i];

        const newFileImageKey = myGetMakeToken({ strlength: 20 });

        await db.FmsFileImages.create({
          fileImageKey: newFileImageKey,
          fileImageType: 'FIMST00000001',
          fileKey: newFileKey,
          fileImageOriginalName: fileItem.originalname,
          fileImageConvertName: fileItem.filename,
          fileYYYYMM: req.fileImageYYYYMM,
          fileSize: fileItem.size,
          filePath: fileItem.path,
          fileAccessUrl: null,
          createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
          createdIp: req.real_ip,
          fileImageStatus: 'FIMSS00000001',
        }, {
          transaction: transaction,
        });
      }
    }

    // 4) commit
    await transaction.commit();
    myLogger.info(req.logHeadTail + 'transaction commit..!');

    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 10001000,
        fileKey: newFileKey,
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
        code: 20023140,
        msg: myResultCode[20023140].msg,
      },
    }));
    return;
  }
});

module.exports = uploadFile;
