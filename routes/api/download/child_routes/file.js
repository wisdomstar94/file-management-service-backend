const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
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
const myIPChecker = require('../../../librarys/myIPChecker');
const myGetDownloadFilename = require('../../../librarys/myGetDownloadFilename').myGetDownloadFilename;
require('dotenv').config();

const file = wrapper(async(req, res, next) => {
  const fileDownloadUrlKey = req.params.fileDownloadUrlKey;

  // fileDownloadUrlKey 체크 : required
  if (typeof fileDownloadUrlKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20049010,
        msg: myResultCode[20049010].msg,
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
        code: 20049020,
        msg: myResultCode[20049020].msg,
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
        code: 20049030,
        msg: myResultCode[20049030].msg,
      },
    }));
    return;
  }

  const fileDownloadUrlKeyResult = await db.FmsFileDownloadUrls.findOne({
    where: {
      fileDownloadUrlKey: fileDownloadUrlKey,
      isDeletedRow: 'N',
    },
    include: [
      {
        as: 'FmsFileDownloadUrlTargetUsers',
        model: db.FmsUsers,
        // attributes: FmsFileDownloadUrlTargetUsersAttributes,
        attributes: ['userKey', 'userId', 'userName'],
        required: true,
      },
      {
        as: 'FmsTargetFiles',
        model: db.FmsFiles,
        // attributes: FmsTargetFilesAttributes,
        attributes: ['fileKey', 'fileLabelName', 'fileStatus'],
        required: true,
      },
      // {
      //   as: 'FmsTargetFileVersions',
      //   model: db.FmsFileVersions,
      //   // attributes: FmsTargetFileVersionsAttributes,
      //   attributes: ['fileVersionKey', 'fileKey', 'fileVersionName', 'fileVersionCode', 'fileDownloadName', 'filePath', 'fileSize', 'fileVersionStatus'],
      //   required: false,
      // },
      {
        as: 'FmsCreaterUsers',
        model: db.FmsUsers,
        // attributes: FmsCreaterUsersAttributes,
        attributes: ['userKey', 'userId', 'userName'],
        required: true,
      },
      {
        as: 'FmsUpdaterUsers',
        model: db.FmsUsers,
        // attributes: FmsUpdaterUsersAttributes,
        attributes: ['userKey', 'userId', 'userName'],
        required: false,
      },
      {
        as: 'FmsFileDownloadUrlStatusCodes',
        model: db.FmsCodes,
        // attributes: FmsFileDownloadUrlStatusCodesAttributes,
        attributes: ['code', 'codeName'],
        required: true,
      },
    ],
  });

  if (fileDownloadUrlKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20049040,
        msg: myResultCode[20049040].msg,
      },
    }));
    return;
  }

  await db.FmsFileDownloadUrls.update({
    fileDownloadUrlAccessCount: db.sequelize.literal('fileDownloadUrlAccessCount + 1'),
  }, {
    where: {
      fileDownloadUrlKey: fileDownloadUrlKey,
    },
  });

  if (fileDownloadUrlKeyResult.fileDownloadUrlStatus !== 'FDUST00000001') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20049050,
        msg: myResultCode[20049050].msg,
      },
    }));
    return;
  }

  // 다운로드 제한 횟수 체크
  if (fileDownloadUrlKeyResult.fileDownloadLimitMaxCount <= fileDownloadUrlKeyResult.fileDownloadCount) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20049052,
        msg: myResultCode[20049052].msg,
      },
    }));
    return;
  }

  // 다운로드 제한 기간 체크
  if (myDate().getTime() < myDate(fileDownloadUrlKeyResult.fileDownloadPossibleDateTimeStart).getTime() || myDate().getTime() > myDate(fileDownloadUrlKeyResult.fileDownloadPossibleDateTimeEnd).getTime()) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20049054,
        msg: myResultCode[20049054].msg,
      },
    }));
    return;
  }

  // FmsFileDownloadUrlAccessConditions 체크
  const FmsFileDownloadUrlAccessConditionsResult = await db.FmsFileDownloadUrlAccessConditions.findAll({
    where: {
      fileDownloadUrlKey: fileDownloadUrlKey,
      isDeletedRow: 'N',
    },
  });

  const conditionFDUCT00000001 = [];
  const conditionFDUCT00000002 = [];
  const conditionFDUCT00000003 = [];

  for (let i = 0; i < FmsFileDownloadUrlAccessConditionsResult.length; i++) {
    const item = FmsFileDownloadUrlAccessConditionsResult[i];

    switch (item.conditionType) {
      case 'FDUCT00000001': // 특정 IP 제한
        conditionFDUCT00000001.push(item);
        break;
      case 'FDUCT00000002': // 특정 Header 값 제한
        conditionFDUCT00000002.push(item);
        break;
      case 'FDUCT00000003': // 특정 암호 필요
        conditionFDUCT00000003.push(item);
        break;
    }
  }

  // 특정 IP 제한
  if (conditionFDUCT00000001.length > 0) {
    const isIpValid = myIPChecker.ipCheck({
      allow_ip_list: conditionFDUCT00000001.map((x) => { return x.value; }),
      request_ip: req.real_ip,
    });
    if (!isIpValid) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20049060,
          msg: myResultCode[20049060].msg,
        },
      }));
      return;
    }
  }

  // 특정 Header 값 제한
  if (conditionFDUCT00000002.length > 0) {
    for (let i = 0; i < conditionFDUCT00000002.length; i++) {
      if (req.headers[conditionFDUCT00000002[i].key] !== conditionFDUCT00000002[i].value) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20049070,
            msg: myResultCode[20049070].msg,
          },
        }));
        return;
      }
    }
  }

  // 특정 암호 필요
  if (conditionFDUCT00000003.length > 0) {
    const passwordjwt = req.cookies.passwordjwt;

    if (typeof passwordjwt !== 'string' || passwordjwt === '') {
      // 압호 임력 페이지로 리다이렉트 (프론트)
      res.redirect('/file/download/' + fileDownloadUrlKey);
      return;
    }

    try {
      const passwordjwtDecodeed = jwt.verify(passwordjwt, process.env.JWT_FILE_DOWNLOAD_URL_SECRET);
      const passwordjwtDecodeedInfo = {
        fileDownloadUrlKey: myCrypto.decrypt({ hashedValue: passwordjwtDecodeed.a }),
      };
      if (passwordjwtDecodeedInfo.fileDownloadUrlKey !== fileDownloadUrlKey) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20049080,
            msg: myResultCode[20049080].msg,
          },
        }));
        return;
      }
    } catch (e) {
      myLogger.error(req.logHeadTail + 'e.stack => ' + e.stack);
      myLogger.error(req.logHeadTail + 'e => ' + JSON.stringify(e));
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20049090,
          msg: myResultCode[20049090].msg,
        },
      }));
      return;
    }

    // passwordjwt 제거
    res.clearCookie('passwordjwt');
  }

  // 버전 정보 가져오기
  let fileVersionInfo = null;
  if (fileDownloadUrlKeyResult.fileVersionKey === null) {
    // 최신버전
    fileVersionInfo = await db.FmsFileVersions.findOne({
      where: {
        fileKey: fileDownloadUrlKeyResult.fileKey,
        isDeletedRow: 'N',
        fileVersionStatus: 'FVSTS00000001',
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    })
  } else {
    // 특정버전
    fileVersionInfo = await db.FmsFileVersions.findOne({
      where: {
        fileKey: fileDownloadUrlKeyResult.fileKey,
        fileVersionKey: fileDownloadUrlKeyResult.fileVersionKey,
        isDeletedRow: 'N',
        fileVersionStatus: 'FVSTS00000001',
      },
    });
  }

  if (fileVersionInfo === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20049100,
        msg: myResultCode[20049100].msg,
      },
    }));
    return;
  }

  // 파일 존재 유무 파악
  if (!fs.existsSync(fileVersionInfo.filePath)) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20049110,
        msg: myResultCode[20049110].msg,
      },
    }));
    return;
  }

  // 회원 정보 가져오기
  const targetUserInfo = await db.FmsUsers.findOne({
    attributes: [
      'userId', 'userName',
    ],
    where: {
      userKey: fileDownloadUrlKeyResult.downloadTargetUserKey,
      isDeletedRow: 'N',
    },
  });

  if (targetUserInfo === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20049130,
        msg: myResultCode[20049130].msg,
      },
    }));
    return;
  }

  // 다운로드 진행
  try {
    const filename = fileVersionInfo.fileDownloadName;
    const mimetype = mime.getType(fileVersionInfo.filePath);
    
    res.setHeader('Content-disposition', 'attachment; filename=' + myGetDownloadFilename({ req: req, filename: filename }));
    res.setHeader('Content-type', mimetype);
  
    let filestream = fs.createReadStream(fileVersionInfo.filePath);

    // 다시 한번 다운로드 횟수 체크
    const fileDownloadUrlDownloadCountInfo = await db.FmsFileDownloadUrls.findOne({
      attributes: ['fileDownloadLimitMaxCount', 'fileDownloadCount'],
      where: {
        fileDownloadUrlKey: fileDownloadUrlKey,
        isDeletedRow: 'N',
      },
    });

    if (fileDownloadUrlDownloadCountInfo.fileDownloadLimitMaxCount <= fileDownloadUrlDownloadCountInfo.fileDownloadCount) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20049140,
          msg: myResultCode[20049140].msg,
        },
      }));
      return;
    }

    // 다운로드 횟수 업데이트
    await db.FmsFileDownloadUrls.update({
      fileDownloadCount: db.sequelize.literal('fileDownloadCount + 1'),
    }, {
      where: {
        fileDownloadUrlKey: fileDownloadUrlKey,
      },
    });

    // 파일 다운로드 로깅
    await db.insertFileDownloadLog({
      downloadTargetUserKey: fileDownloadUrlKeyResult.downloadTargetUserKey,
      fileDownloadUrlKey: fileDownloadUrlKey,
      userIdLogAt: targetUserInfo.userId,
      fileLabelNameLogAt: fileDownloadUrlKeyResult.FmsTargetFiles.fileLabelName,
      fileVersionCodeLogAt: fileVersionInfo.fileVersionCode,
      fileVersionNameLogAt: fileVersionInfo.fileVersionName,
      fileOriginalNameLogAt: fileVersionInfo.fileOriginalName,
      fileDownloadNameLogAt: fileVersionInfo.fileDownloadName,
      fileSizeLogAt: fileVersionInfo.fileSize,
      createdIp: req.real_ip,
    });

    filestream.pipe(res);
    return;
  } catch (e) {
    myLogger.error(req.logHeadTail + 'e.stack => ' + e.stack);
    myLogger.error(req.logHeadTail + 'e => ' + JSON.stringify(e));
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20049120,
        msg: myResultCode[20049120].msg,
      },
    }));
    return;
  }
});

module.exports = file;
