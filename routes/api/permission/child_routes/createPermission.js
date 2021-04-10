const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;

const createPermission = wrapper(async(req, res, next) => {
  const {
    menuKey,
    permissionName,
    permissionDescription,
    sortNo,
    sortNoAutoIncrement, // true or false
  } = req.body;

  // menuKey 체크 : require
  if (typeof menuKey !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20011510,
        msg: myResultCode[20011510].msg,
      },
    }));
    return;
  }

  if (menuKey.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20011520,
        msg: myResultCode[20011520].msg,
      },
    }));
    return;
  }

  if (menuKey.length !== 20) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20011530,
        msg: myResultCode[20011530].msg,
      },
    }));
    return;
  }

  const menuKeyResult = await db.FmsMenus.findOne({
    where: {
      menuKey: menuKey,
      isDeletedRow: 'N',
    },
  });
  if (menuKeyResult === null) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20011540,
        msg: myResultCode[20011540].msg,
      },
    }));
    return;
  }

  // permissionName 체크 : require
  if (typeof permissionName !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20011550,
        msg: myResultCode[20011550].msg,
      },
    }));
    return;
  }

  if (permissionName.trim() === '') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20011560,
        msg: myResultCode[20011560].msg,
      },
    }));
    return;
  }

  if (permissionName.length > 255) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20011570,
        msg: myResultCode[20011570].msg,
      },
    }));
    return;
  }

  // permissionDescription 체크 : optional
  if (permissionDescription !== undefined && permissionDescription !== null && typeof permissionDescription !== 'string') {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20011579,
        msg: myResultCode[20011579].msg,
      },
    }));
    return;
  }

  if (typeof permissionDescription === 'string') {
    if (permissionDescription.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011580,
          msg: myResultCode[20011580].msg,
        },
      }));
      return;
    }
  }

  // sortNo 체크 : optional
  if (sortNo !== undefined) {
    if (sortNo === null) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011590,
          msg: myResultCode[20011590].msg,
        },
      }));
      return;
    }

    if (typeof sortNo === 'string') {
      if (sortNo.trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20011600,
            msg: myResultCode[20011600].msg,
          },
        }));
        return;
      }
    }

    if (isNaN(Number(sortNo))) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20011610,
          msg: myResultCode[20011610].msg,
        },
      }));
      return;
    }
  }

  // sortNoAutoIncrement 체크
  let insertSortNo = 1;
  if (sortNoAutoIncrement === true) {
    // 해당 카테고리로 등록된 permission 중에 가장 높은 sortNo 값 가져오기
    const currentMaxSortNo = await db.FmsPermissions.getCurrentMaxSortNo(menuKey);
    insertSortNo = currentMaxSortNo + 100;
  } else {
    insertSortNo = sortNo;
  }



  // 새로운 권한 종류 생성
  const newPermissionKey = myGetMakeToken({ strlength: 20 });

  

  const createResult = await db.FmsPermissions.create({
    menuKey: menuKey,
    permissionKey: newPermissionKey,
    permissionName: permissionName,
    permissionDescription: permissionDescription,
    sortNo: insertSortNo,
    createdAt: myDate().format('YYYY-MM-DD HH:mm:ss'),
    createdIp: req.real_ip,
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

module.exports = createPermission;