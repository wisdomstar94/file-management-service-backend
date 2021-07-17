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

  console.log('fileDownloadUrlKeyResult', fileDownloadUrlKeyResult);

  // fileDownloadUrlKeyResult.fileVersionKey 체크
  let fileVersionInfo = null;
  if (fileDownloadUrlKeyResult.fileVersionKey === null) {
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

  // 접근 제한 종류 체크
  const conditionResult = await db.FmsFileDownloadUrlAccessConditions.findAll({
    where: {
      fileDownloadUrlKey: fileDownloadUrlKey,
      conditionType: 'FDUCT00000003',
      conditionStatus: 'FDUCS00000001',
      isDeletedRow: 'N',
    },
  });

  let requirePassword = false;
  if (conditionResult.length > 0) {
    requirePassword = true;
  }


  // 다운로드 되기 전 외부에 공개될 파일의 간단한 정보 가져오기
  const fileNormalInfo = {
    fileDownloadName: fileVersionInfo.fileDownloadName,
    fileSize: fileVersionInfo.fileSize,
    fileMimeType: fileVersionInfo.fileMimeType,
    requirePassword: requirePassword,
    fileVersionHistoryList: [],
    fileDescription: '',
  };

  // 외부에 파일 버전의 변경 이력 노출 여부가 Y 이면
  if (fileKeyResult.fileStoreVersionHistoryOpen === 'Y') {
    fileNormalInfo.fileVersionHistoryList = await db.FmsFileVersions.findAll({
      attributes: [
        'fileVersionName', 'fileVersionDescription', 'createdAt'
      ],
      where: {
        fileKey: fileDownloadUrlKeyResult.fileKey,
        isDeletedRow: 'N',
        fileVersionStatus: 'FVSTS00000001',
      },
      order: [
        ['fileVersionCode', 'DESC'],
      ],
    })
  }

  // 외부에 파일 설명글 노출 여부가 Y 이면
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
