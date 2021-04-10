const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');

const modifyPermissionGroup = wrapper(async(req, res, next) => {
  const {
    permissionGroupKey,
    permissionGroupName,
    permissionGroupDescription,
    sortNo,
    permissionGroupStatus,
  } = req.body;

  // permissionGroupKey 체크 : required
  if (typeof permissionGroupKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20014510,
        msg: myResultCode[20014510].msg,
      },
    }));
    return;
  }

  if (permissionGroupKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20014520,
        msg: myResultCode[20014520].msg,
      },
    }));
    return;
  }

  if (permissionGroupKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20014530,
        msg: myResultCode[20014530].msg,
      },
    }));
    return;
  }

  // permissionGroupName 체크 : optional
  if (permissionGroupName !== undefined && typeof permissionGroupName !== 'string')  {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20014540,
        msg: myResultCode[20014540].msg,
      },
    }));
    return;
  }

  if (typeof permissionGroupName === 'string') {
    if (permissionGroupName.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20014550,
          msg: myResultCode[20014550].msg,
        },
      }));
      return;
    }

    if (permissionGroupName.length > 100) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20014560,
          msg: myResultCode[20014560].msg,
        },
      }));
      return;
    }
  }

  // permissionGroupDescription 체크
  if (permissionGroupDescription !== null && permissionGroupDescription !== undefined && typeof permissionGroupDescription !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20014570,
        msg: myResultCode[20014570].msg,
      },
    }));
    return;
  }

  if (typeof permissionGroupDescription === 'string') {
    if (permissionGroupDescription.length > 255) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20014580,
          msg: myResultCode[20014580].msg,
        },
      }));
      return;
    }
  }

  // sortNo 체크
  if (sortNo !== undefined) {
    if (!myCommon.isNumber(sortNo)) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20014590,
          msg: myResultCode[20014590].msg,
        },
      }));
      return;
    }
  }

  // permissionGroupStatus 체크
  if (permissionGroupStatus !== undefined && typeof permissionGroupStatus !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20014600,
        msg: myResultCode[20014600].msg,
      },
    }));
    return;
  }

  if (typeof permissionGroupStatus === 'string') {
    if (permissionGroupStatus.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20014610,
          msg: myResultCode[20014610].msg,
        },
      }));
      return;
    }

    if (permissionGroupStatus.length !== 13) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20014620,
          msg: myResultCode[20014620].msg,
        },
      }));
      return;
    }

    const permissionGroupStatusCheck = await db.FmsCodes.isValidCode('PEGRS', permissionGroupStatus);
    if (!permissionGroupStatusCheck) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20014630,
          msg: myResultCode[20014630].msg,
        },
      }));
      return;
    }
  }

  // 권한 그룹 정보 업데이트
  const modifyResult = await db.FmsPermissionGroups.update({
    permissionGroupName: permissionGroupName,
    permissionGroupDescription: permissionGroupDescription,
    sortNo: sortNo,
    permissionGroupStatus: permissionGroupStatus,
    updatedAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    updatedIp: req.real_ip,
  }, {
    where: {
      permissionGroupKey: permissionGroupKey,
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

module.exports = modifyPermissionGroup;