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

const fileDownloadUrlOuterInfo = wrapper(async(req, res, next) => {
  const {
    fileDownloadUrlKey,
  } = req.body;
  
  // fileDownloadUrlKey 체크 : required
  if (typeof fileDownloadUrlKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20054010,
        msg: myResultCode[20054010].msg,
      },
    }));
    return;
  }

  if (fileDownloadUrlKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20054020,
        msg: myResultCode[20054020].msg,
      },
    }));
    return;
  }

  if (fileDownloadUrlKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20054030,
        msg: myResultCode[20054030].msg,
      },
    }));
    return;
  }

  const fileDownloadUrlKeyResult = await db.FmsFileDownloadUrls.findOne({
    attributes: [
      'fileDownloadUrlKey', 'fileKey', 'fileVersionKey', 'fileDownloadUrlStatus',
    ],
    where: {
      fileDownloadUrlKey: fileDownloadUrlKey,
      isDeletedRow: 'N',
    },
  });
  if (fileDownloadUrlKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20054040,
        msg: myResultCode[20054040].msg,
      },
    }));
    return;
  }
  /*
    fileDownloadUrlKeyResult.fileKey
    fileDownloadUrlKeyResult.fileVersionKey
    fileDownloadUrlKeyResult.fileDownloadUrlStatus
  */
  

  // fileDownloadUrlKeyResult.fileDownloadUrlStatus 체크
  if (fileDownloadUrlKeyResult.fileDownloadUrlStatus !== 'FDUST00000001') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20054050,
        msg: myResultCode[20054050].msg,
      },
    }));
    return;
  }

  // fileDownloadUrlKeyResult.fileKey 체크
  const fileKeyResult = await db.FmsFiles.findOne({
    where: {
      fileKey: fileDownloadUrlKeyResult.fileKey,
      isDeletedRow: 'N',
    },
  });
  if (fileKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20054060,
        msg: myResultCode[20054060].msg,
      },
    }));
    return;
  }

  if (fileKeyResult.fileStatus !== 'FISTS00000001') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20054070,
        msg: myResultCode[20054070].msg,
      },
    }));
    return;
  }

  // fileDownloadUrlKeyResult.fileVersionKey 체크
  let fileVersionInfo = null;
  if (typeof fileDownloadUrlKeyResult.fileVersionKey !== 'string') {
    // 최신버전 정보 가져오기
    fileVersionInfo = await db.FmsFileVersions.findOne({
      where: {
        fileKey: fileDownloadUrlKeyResult.fileKey,
        fileVersionStatus: 'FVSTS00000001',
        isDeletedRow: 'N',
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    });
  } else {
    // 특정버전 정보 가져오기
    fileVersionInfo = await db.FmsFileVersions.findOne({
      where: {
        fileKey: fileDownloadUrlKeyResult.fileKey,
        fileVersionKey: fileDownloadUrlKeyResult.fileVersionKey,
        fileVersionStatus: 'FVSTS00000001',
        isDeletedRow: 'N',
      },
    });
  }

  if (fileVersionInfo === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20054080,
        msg: myResultCode[20054080].msg,
      },
    }));
    return;
  }

  // 다운로드 되기 전 외부에 공개될 파일의 간단한 정보 가져오기
  const fileNormalInfo = {
    fileDownloadName: fileVersionInfo.fileDownloadName,
    fileSize: fileVersionInfo.fileSize,
    fileMimeType: fileVersionInfo.fileMimeType,
  };

  if (fileKeyResult.fileStoreDescriptionOpen === 'Y') {
    fileNormalInfo.fileDescription = fileKeyResult.fileDescription; // 버전이 아니라 파일의 설명글
  }

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      fileNormalInfo: fileNormalInfo,
    },
  }));
  return;
});

module.exports = fileDownloadUrlOuterInfo;
