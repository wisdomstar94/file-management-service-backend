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

const fileBasicInfo = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);

  const isFileDetailInfoAccessPossible = await db.isActivePermission(loginInfo.userKey, 'B1617690143101zIeSOm');
  if (!isFileDetailInfoAccessPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20044010,
        msg: myResultCode[20044010].msg,
      },
    }));
    return;
  }

  const isFileBasicInfoAllAccessPossible = await db.isActivePermission(loginInfo.userKey, 'sK1617691790694qGZyx');
  

  const {
    fileKey,
  } = req.body;

  // fileKey 체크 : required
  if (typeof fileKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20044020,
        msg: myResultCode[20044020].msg,
      },
    }));
    return;
  }

  if (fileKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20044030,
        msg: myResultCode[20044030].msg,
      },
    }));
    return;
  }

  if (fileKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20044040,
        msg: myResultCode[20044040].msg,
      },
    }));
    return;
  }

  const activePermissionKeys = await db.isActivePermissions(loginInfo.userKey, [
    'tBN1617690575007jNty', // fileKey
    'YJKyLU1617690591021h', // 파일 라벨명
    'CMxWUV1617690606711D', // 파일 메모
    'fj1617690622230Lffft', // 파일 설명글
    'xW1617690640823UIksf', // 외부에 파일 버전의 변경 이력 노출 여부
    'hAdZzX1617690656103W', // 외부에 파일 설명글 노출 여부
    'YFdfL1617690692640pH', // 파일 관련 스크린샷
    'aefcC1617690712451ls', // 파일 대표이미지
    'ljd1617690728230OcUc', // 파일 상태
  ]);
  const FmsFilesAttributes = [];
  const FmsFileStatusCodesAttributes = [];

  const FmsFileScreenShotImagesAttributes = ['seq'];
  const FmsFileRepresentImagesAttributes = ['seq'];

  activePermissionKeys.includes('tBN1617690575007jNty') ? FmsFilesAttributes.push('fileKey') : null;
  activePermissionKeys.includes('YJKyLU1617690591021h') ? FmsFilesAttributes.push('fileLabelName') : null;
  activePermissionKeys.includes('CMxWUV1617690606711D') ? FmsFilesAttributes.push('fileMemo') : null;
  activePermissionKeys.includes('fj1617690622230Lffft') ? FmsFilesAttributes.push('fileDescription') : null;
  activePermissionKeys.includes('xW1617690640823UIksf') ? FmsFilesAttributes.push('fileStoreVersionHistoryOpen') : null;
  activePermissionKeys.includes('hAdZzX1617690656103W') ? FmsFilesAttributes.push('fileStoreDescriptionOpen') : null;
  if (activePermissionKeys.includes('ljd1617690728230OcUc')) {
    FmsFilesAttributes.push('fileStatus');
    FmsFileStatusCodesAttributes.push('code');
    FmsFileStatusCodesAttributes.push('codeName');
  }

  const fileInfo = await db.FmsFiles.findOne({
    attributes: FmsFilesAttributes,
    where: {
      fileKey: fileKey,
      isDeletedRow: 'N',
    },
    include: [
      {
        as: 'FmsFileStatusCodes',
        model: db.FmsCodes,
        attributes: FmsFileStatusCodesAttributes,
      }
    ]
  });

  if (fileInfo === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20044050,
        msg: myResultCode[20044050].msg,
      },
    }));
    return;
  }

  let fileScreenShotImageInfo = null;
  if (activePermissionKeys.includes('YFdfL1617690692640pH')) {
    FmsFileScreenShotImagesAttributes.push('fileImageKey');
    FmsFileScreenShotImagesAttributes.push('fileImageType');
    FmsFileScreenShotImagesAttributes.push('fileKey');
    FmsFileScreenShotImagesAttributes.push('fileAccessUrl');
    FmsFileScreenShotImagesAttributes.push('sortNo');

    fileScreenShotImageInfo = await db.FmsFileImages.findAll({
      attributes: FmsFileScreenShotImagesAttributes,
      where: {
        fileKey: fileKey,
        fileImageType: 'FIMST00000001',
        fileImageStatus: 'FIMSS00000001',
        isDeletedRow: 'N',
      },
      order: [
        ['sortNo', 'ASC'],
      ]
    });
  }

  let fileRepresentImageInfo = null;
  if (activePermissionKeys.includes('aefcC1617690712451ls')) {
    FmsFileRepresentImagesAttributes.push('fileImageKey');
    FmsFileRepresentImagesAttributes.push('fileImageType');
    FmsFileRepresentImagesAttributes.push('fileKey');
    FmsFileRepresentImagesAttributes.push('fileAccessUrl');
    FmsFileRepresentImagesAttributes.push('sortNo');

    fileRepresentImageInfo = await db.FmsFileImages.findAll({
      attributes: FmsFileRepresentImagesAttributes,
      where: {
        fileKey: fileKey,
        fileImageType: 'FIMST00000002',
        fileImageStatus: 'FIMSS00000001',
        isDeletedRow: 'N',
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      limit: 1,
    });
  }


  

 

  

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      fileInfo: fileInfo,
      fileScreenShotImageInfo: fileScreenShotImageInfo,
      fileRepresentImageInfo: fileRepresentImageInfo,
    },
  }));
  return;
});

module.exports = fileBasicInfo;
