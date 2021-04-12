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
      name: 'versionFile',
      maxCount: 1,
    },
  ])
*/
const uploadFileVersion = wrapper(async(req, res, next) => {
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
    fileKey,
    fileVersionName,
    fileVersionCode,
    fileVersionMemo,
    fileVersionDescription,
    fileVersionStatus,
  } = req.body;

  // fileKey 체크 : required
  if (typeof fileKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024010,
        msg: myResultCode[20024010].msg,
      },
    }));
    return;
  }

  if (fileKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024020,
        msg: myResultCode[20024020].msg,
      },
    }));
    return;
  }

  if (fileKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024030,
        msg: myResultCode[20024030].msg,
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
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024040,
        msg: myResultCode[20024040].msg,
      },
    }));
    return;
  }

  // fileVersionName 체크 : required
  if (typeof fileVersionName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024050,
        msg: myResultCode[20024050].msg,
      },
    }));
    return;
  }

  if (fileVersionName.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024060,
        msg: myResultCode[20024060].msg,
      },
    }));
    return;
  }

  if (fileVersionName.length > 30) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024070,
        msg: myResultCode[20024070].msg,
      },
    }));
    return;
  }

  const fileVersionNameResult = await db.FmsFileVersions.findOne({
    where: {
      fileKey: fileKey,
      fileVersionName: fileVersionName,
    },
  });
  if (fileVersionNameResult !== null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024080,
        msg: myResultCode[20024080].msg,
      },
    }));
    return;
  }

  const fileVersionNameCheck = await db.FmsFileVersions.findAll({
    attributes: ['fileVersionName'],
    where: {
      fileKey: fileKey,
    },
  });
  for (let i = 0; i < fileVersionNameCheck.length; i++) {
    if (fileVersionNameCheck[i].fileVersionName >= fileVersionName) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'success',
          headTail: req.accessUniqueKey,
          code: 20024090,
          msg: myResultCode[20024090].msg,
        },
      }));
      return;
    }
  }

  // fileVersionCode 체크 : required
  if (!myCommon.isNumber(fileVersionCode)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024100,
        msg: myResultCode[20024100].msg,
      },
    }));
    return;
  }

  const fileVersionCodeResult = await db.FmsFileVersions.findOne({
    where: {
      fileKey: fileKey,
      fileVersionCode: Number(fileVersionCode),
    },
  });
  if (fileVersionCodeResult !== null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024110,
        msg: myResultCode[20024110].msg,
      },
    }));
    return;
  }

  const fileVersionCodeCheck = await db.FmsFileVersions.findAll({
    attributes: ['fileVersionCode'],
    where: {
      fileKey: fileKey,
    },
  });
  for (let i = 0; i < fileVersionCodeCheck.length; i++) {
    if (fileVersionCodeCheck[i].fileVersionCode >= fileVersionCode) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'success',
          headTail: req.accessUniqueKey,
          code: 20024120,
          msg: myResultCode[20024120].msg,
        },
      }));
      return;
    }
  }

  // fileVersionMemo 체크 : optional
  if (fileVersionMemo !== null && fileVersionMemo !== undefined && typeof fileVersionMemo !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024130,
        msg: myResultCode[20024130].msg,
      },
    }));
    return;
  }

  if (typeof fileVersionMemo === 'string') {
    if (fileVersionMemo.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'success',
          headTail: req.accessUniqueKey,
          code: 20024140,
          msg: myResultCode[20024140].msg,
        },
      }));
      return;
    }
  }

  // fileVersionDescription 체크 : optional
  if (fileVersionDescription !== null && fileVersionDescription !== undefined && typeof fileVersionDescription !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024150,
        msg: myResultCode[20024150].msg,
      },
    }));
    return;
  }

  if (typeof fileVersionDescription === 'string') {
    if (fileVersionDescription.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'success',
          headTail: req.accessUniqueKey,
          code: 20024160,
          msg: myResultCode[20024160].msg,
        },
      }));
      return;
    }
  }

  // fileVersionStatus 체크 : required
  if (typeof fileVersionStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024170,
        msg: myResultCode[20024170].msg,
      },
    }));
    return;
  }

  if (fileVersionStatus.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024180,
        msg: myResultCode[20024180].msg,
      },
    }));
    return;
  }

  if (fileVersionStatus.length !== 13) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024190,
        msg: myResultCode[20024190].msg,
      },
    }));
    return;
  }

  const fileVersionStatusCheck = await db.FmsCodes.isValidCode('FVSTS', fileVersionStatus);
  if (!fileVersionStatusCheck) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024200,
        msg: myResultCode[20024200].msg,
      },
    }));
    return;
  }

  // versionFile 체크 
  if (!Array.isArray(req.files.versionFile)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024210,
        msg: myResultCode[20024210].msg,
      },
    }));
    return;
  }

  if (req.files.versionFile.length !== 1) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20024220,
        msg: myResultCode[20024220].msg,
      },
    }));
    return;
  }

  const versionFileInfo = req.files.versionFile[0];
  /*
    {
      fieldname: 'versionFileInfo',
      originalname: 'sample_5.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: '/home/project/file-management-service/files/apks/',
      filename: 'sample_5_MniIFHiXTrQguz1618205144603oYRzrEHGHHsUX.jpg',
      path: '/home/project/file-management-service/files/apks/sample_5_MniIFHiXTrQguz1618205144603oYRzrEHGHHsUX.jpg',
      size: 57589
    }
  */

  // 새로운 파일 버전 등록
  const newFileVersionKey = myGetMakeToken({ strlength: 20 });

  const createResult = await db.FmsFileVersions.create({
    fileVersionKey: newFileVersionKey,
    fileKey: fileKey,
    fileVersionName: fileVersionName,
    fileVersionCode: fileVersionCode,
    fileOriginalName: versionFileInfo.originalname,
    fileDownloadName: versionFileInfo.originalname,
    fileVersionMemo: fileVersionMemo,
    fileVersionDescription: fileVersionDescription,
    filePath: versionFileInfo.path,
    fileSize: versionFileInfo.size,
    fileMimeType: versionFileInfo.mimetype,
    createrUserKey: loginInfo.userKey,
    createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    createdIp: req.real_ip,
    fileVersionStatus: fileVersionStatus,
  });

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
    },
  }));
  return;
});

module.exports = uploadFileVersion;
