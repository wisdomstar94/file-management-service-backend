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
const modifyFileVersion = wrapper(async(req, res, next) => {
  console.log('req.files', req.files);
  if (req.files === undefined) {
    req.files = {};
  }
  /*
    >>> req.files 내용 예시 <<<
    req.files [Object: null prototype] {
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

  const isFileVersionAllModifyPossible = await db.isActivePermission(loginInfo.userKey, 'SioYPe1619178659344f');



  const {
    fileVersionKey,
    // fileKey,
    // fileVersionName,
    // fileVersionCode,
    fileDownloadName,
    fileVersionMemo,
    fileVersionDescription,
    fileVersionStatus,
  } = req.body;

  // fileVersionKey 체크 : required
  if (typeof fileVersionKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20025010,
        msg: myResultCode[20025010].msg,
      },
    }));
    return;
  }

  if (fileVersionKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20025020,
        msg: myResultCode[20025020].msg,
      },
    }));
    return;
  }

  if (fileVersionKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20025030,
        msg: myResultCode[20025030].msg,
      },
    }));
    return;
  }

  const fileVersionKeyResult = await db.FmsFileVersions.findOne({
    where: {
      fileVersionKey: fileVersionKey,
      isDeletedRow: 'N',
    },
  });
  if (fileVersionKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20025040,
        msg: myResultCode[20025040].msg,
      },
    }));
    return;
  }

  // fileDownloadName 체크 : optional
  if (fileDownloadName !== undefined && typeof fileDownloadName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20025050,
        msg: myResultCode[20025050].msg,
      },
    }));
    return;
  }

  if (typeof fileDownloadName === 'string') {
    if (!isFileVersionAllModifyPossible) {
      const isFileDownloadNameModifyPossible = await db.isActivePermission(loginInfo.userKey, 'UrSprt1617691140153j');
      if (!isFileDownloadNameModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20025059,
            msg: myResultCode[20025059].msg,
          },
        }));
        return;
      }
    }

    if (fileDownloadName.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'success',
          headTail: req.accessUniqueKey,
          code: 20025060,
          msg: myResultCode[20025060].msg,
        },
      }));
      return;
    }

    if (fileDownloadName.length > 255) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'success',
          headTail: req.accessUniqueKey,
          code: 20025070,
          msg: myResultCode[20025070].msg,
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
        code: 20025080,
        msg: myResultCode[20025080].msg,
      },
    }));
    return;
  }

  if (fileVersionMemo === null || typeof fileVersionMemo === 'string') {
    if (!isFileVersionAllModifyPossible) {
      const isFileVersionMemoModifyPossible = await db.isActivePermission(loginInfo.userKey, 'RZCF1617691153958FRX');
      if (!isFileVersionMemoModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20025085,
            msg: myResultCode[20025085].msg,
          },
        }));
        return;
      }
    }
  }

  if (typeof fileVersionMemo === 'string') {
    if (fileVersionMemo.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'success',
          headTail: req.accessUniqueKey,
          code: 20025090,
          msg: myResultCode[20025090].msg,
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
        code: 20025100,
        msg: myResultCode[20025100].msg,
      },
    }));
    return;
  }

  if (fileVersionDescription === null || typeof fileVersionDescription === 'string') {
    if (!isFileVersionAllModifyPossible) {
      const isFileVersionDescriptionModifyPossible = await db.isActivePermission(loginInfo.userKey, 'E1617691168179MGcCVF');
      if (!isFileVersionDescriptionModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20025105,
            msg: myResultCode[20025105].msg,
          },
        }));
        return;
      }
    }
  }

  if (typeof fileVersionDescription === 'string') {
    if (fileVersionDescription.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'success',
          headTail: req.accessUniqueKey,
          code: 20025110,
          msg: myResultCode[20025110].msg,
        },
      }));
      return;
    }
  }

  // fileVersionStatus 체크 : optional
  if (fileVersionStatus !== undefined && typeof fileVersionStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'success',
        headTail: req.accessUniqueKey,
        code: 20025120,
        msg: myResultCode[20025120].msg,
      },
    }));
    return;
  }

  if (typeof fileVersionStatus === 'string') {
    if (!isFileVersionAllModifyPossible) {
      const isFileVersionStatusModifyPossible = await db.isActivePermission(loginInfo.userKey, 'ANqm1617691180937Vix');
      if (!isFileVersionStatusModifyPossible) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20025129,
            msg: myResultCode[20025129].msg,
          },
        }));
        return;
      }
    }

    if (fileVersionStatus.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'success',
          headTail: req.accessUniqueKey,
          code: 20025130,
          msg: myResultCode[20025130].msg,
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
          code: 20025140,
          msg: myResultCode[20025140].msg,
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
          code: 20025150,
          msg: myResultCode[20025150].msg,
        },
      }));
      return;
    }
  }

  // versionFile 체크 : optional
  let versionFileInfo = {};
  if (Array.isArray(req.files.versionFile)) {
    if (req.files.versionFile.length === 1) {
      versionFileInfo = req.files.versionFile[0];
    }
  }

  // 파일 버전 정보 업데이트
  const modifyResult = await db.FmsFileVersions.update({
    fileOriginalName: versionFileInfo.originalname,
    fileDownloadName: versionFileInfo.originalname === undefined ? fileDownloadName : versionFileInfo.originalname,
    fileVersionMemo: fileVersionMemo,
    fileVersionDescription: fileVersionDescription,
    filePath: versionFileInfo.path,
    fileSize: versionFileInfo.size,
    fileMimeType: versionFileInfo.mimetype,
    updaterUserKey: loginInfo.userKey,
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    updatedIp: req.real_ip,
    fileVersionStatus: fileVersionStatus,
  }, {
    where: {
      fileVersionKey: fileVersionKey,
    },
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

module.exports = modifyFileVersion;
