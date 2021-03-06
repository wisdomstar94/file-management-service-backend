const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myCrypto = require('../../../librarys/myCrypto');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');
const myBoard = require('../../../librarys/myBoard');
const myRegularExpressCheck = require('../../../librarys/myRegularExpressCheck');
const { Op, Sequelize } = require('sequelize');

const getUser = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  const permissionCheck = await db.isActivePermission(loginInfo.userKey, 'lundi1617686154398kN');
  if (!permissionCheck) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20028010,
        msg: myResultCode[20028010].msg,
      },
    }));
    return;
  }

  const isUserAllSearchPossible = await db.isActivePermission(loginInfo.userKey, 'qDLUgK1617686039888I');

  const isAllUserControl = await db.isActivePermission(loginInfo.userKey, 'IEjNkA1619012061260L');

  const {
    parentUserKey, 
    parentUserId,
    parentUserName,
    companyKey, // string 또는 string[]
    companyName, // string 또는 string[]
    companyCEOName, // string 또는 string[]
    permissionGroupKey, // string 또는 string[]
    permissionGroupName, // string 또는 string[]
    userLevel, // string 또는 string[]
    userId, // string 또는 string[]
    userName, // string 또는 string[]
    userPhone, // string 또는 string[]
    userMemo, // string 또는 string[]
    userStatus, // string 또는 string[]
    createdAtStart, // string
    createdAtEnd, // string
    updatedAtStart, // string
    updatedAtEnd, // string

    page, // 요청온 페이지 숫자
    pageViewCount, // 한번에 표시되는 페이징 수
    viewCount, // 한번에 표시되는 게시글 수
  } = req.body;

  let pageReal = Number(page);
  let pageViewCountReal = Number(pageViewCount);
  let viewCountReal = Number(viewCount);

  const where = {};

  const parentUserWhereOpAndArray = [];
  let parentUserRequired = false;

  const companyWhereOpAndArray = [];
  let companyRequired = false;

  const permissionGroupWhereOpAndArray = [];
  let permissionGroupRequired = false;

  const order = [];
  const OpAndArray = [];



  // isAllUserControl 체크 : required
  if (!isAllUserControl) {
    // 자신 및 하위 유저들만
    OpAndArray.push({
      userKey: {
        [Op.in]: await db.FmsUsers.getChildAllUserKeys(loginInfo.userKey),
      },
    });
  } 

  // parentUserKey 체크 : optional
  if (typeof parentUserKey === 'string') {
    if (parentUserKey.trim() !== '' && parentUserKey.length !== 20) {
      OpAndArray.push({
        parentUserKey: {
          [Op.eq]: parentUserKey,
        },
      });
    }
  }

  if (parentUserKey === null) {
    OpAndArray.push({
      parentUserKey: {
        [Op.eq]: parentUserKey,
      },
    });
  }

  if (Array.isArray(parentUserKey)) {
    const parentUserKeyReal = [];

    for (let i = 0; i < parentUserKey.length; i++) {
      if (typeof parentUserKey[i] !== 'string') {
        continue;
      }

      if (parentUserKey[i].trim() === '') {
        continue;
      }

      if (parentUserKey[i].length !== 20) {
        continue;
      }

      parentUserKeyReal.push(parentUserKey[i]);
    }

    if (parentUserKeyReal.length > 0) {
      OpAndArray.push({
        parentUserKey: {
          [Op.in]: parentUserKeyReal,
        },
      });
    }
  }

  // parentUserId 체크 : optional
  if (typeof parentUserId === 'string') {
    if (parentUserId.trim() !== '') {
      if (!isUserAllSearchPossible) {
        const isParentUserIdSearchPossible = await db.isActivePermission(loginInfo.userKey, 'pgNfcjy1619317925868');
        if (!isParentUserIdSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042010,
              msg: myResultCode[20042010].msg,
            },
          }));
          return;
        }
      }

      parentUserWhereOpAndArray.push({
        userId: {
          [Op.substring]: myCommon.specialCharEscape(parentUserId),
        },
      });
    }
  }

  if (Array.isArray(parentUserId)) {
    const parentUserIdReal = [];
    for (let i = 0; i < parentUserId.length; i++) {
      if (typeof parentUserId[i] !== 'string') {
        continue;
      }

      if (parentUserId[i].trim() === '') {
        continue;
      }

      parentUserIdReal.push(parentUserId[i]);
    }

    if (parentUserIdReal.length > 0) {
      if (!isUserAllSearchPossible) {
        const isParentUserIdSearchPossible = await db.isActivePermission(loginInfo.userKey, 'pgNfcjy1619317925868');
        if (!isParentUserIdSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042020,
              msg: myResultCode[20042020].msg,
            },
          }));
          return;
        }
      }

      parentUserWhereOpAndArray.push({
        [Op.or]: parentUserIdReal.map((x) => {
          return {
            userId: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // parentUserName 체크 : optional
  if (typeof parentUserName === 'string') {
    if (parentUserName.trim() !== '') {
      if (!isUserAllSearchPossible) {
        const isParentUserNameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'DjC1619317945380XwHe');
        if (!isParentUserNameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042030,
              msg: myResultCode[20042030].msg,
            },
          }));
          return;
        }
      }

      parentUserWhereOpAndArray.push({
        userName: {
          [Op.substring]: myCommon.specialCharEscape(parentUserName),
        },
      });
    }
  }

  if (Array.isArray(parentUserName)) {
    const parentUserNameReal = [];
    for (let i = 0; i < parentUserName.length; i++) {
      if (typeof parentUserName[i] !== 'string') {
        continue;
      }

      if (parentUserName[i].trim() === '') {
        continue;
      }

      parentUserNameReal.push(parentUserName[i]);
    }

    if (parentUserNameReal.length > 0) {
      if (!isUserAllSearchPossible) {
        const isParentUserNameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'DjC1619317945380XwHe');
        if (!isParentUserNameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042040,
              msg: myResultCode[20042040].msg,
            },
          }));
          return;
        }
      }

      parentUserWhereOpAndArray.push({
        [Op.or]: parentUserNameReal.map((x) => {
          return {
            userName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // companyKey 체크 : optional
  if (typeof companyKey === 'string') {
    if (companyKey.trim() !== '' && companyKey.length === 20) {
      OpAndArray.push({
        companyKey: {
          [Op.eq]: companyKey,
        },
      });
    }
  }

  if (Array.isArray(companyKey)) {
    const companyKeyReal = [];
    for (let i = 0; i < companyKey.length; i++) {
      if (typeof companyKey[i] !== 'string') {
        continue;
      }

      if (companyKey[i].length !== 20) {
        continue;
      }

      companyKeyReal.push(companyKey[i]);
    }

    if (companyKeyReal.length > 0) {
      OpAndArray.push({
        companyKey: {
          [Op.in]: companyKeyReal,
        },
      });
    }
  }

  // companyName 체크
  if (typeof companyName === 'string') {
    if (companyName.trim() !== '') {
      if (!isUserAllSearchPossible) {
        const isUserCompanyNameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'ttQCZki1617686071782');
        if (!isUserCompanyNameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042050,
              msg: myResultCode[20042050].msg,
            },
          }));
          return;
        }
      }

      companyWhereOpAndArray.push({
        companyName: {
          [Op.substring]: myCommon.specialCharEscape(companyName),
        },
      });
    }
  }

  if (Array.isArray(companyName)) {
    const companyNameReal = [];
    for (let i = 0; i < companyName.length; i++) {
      if (typeof companyName[i] !== 'string') {
        continue;
      }

      if (companyName[i].trim() === '') {
        continue;
      }

      companyNameReal.push(companyName[i]);
    }

    if (companyNameReal.length > 0) {
      if (!isUserAllSearchPossible) {
        const isUserCompanyNameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'ttQCZki1617686071782');
        if (!isUserCompanyNameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042060,
              msg: myResultCode[20042060].msg,
            },
          }));
          return;
        }
      }

      companyWhereOpAndArray.push({
        [Op.or]: companyNameReal.map((x) => {
          return {
            companyName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // companyCEOName 체크
  if (typeof companyCEOName === 'string') {
    if (companyCEOName.trim() !== '') {
      if (!isUserAllSearchPossible) {
        const isUserCompanyCEONameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'U1619318276267fJrivz');
        if (!isUserCompanyCEONameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042070,
              msg: myResultCode[20042070].msg,
            },
          }));
          return;
        }
      }

      companyWhereOpAndArray.push({
        companyCEOName: {
          [Op.substring]: myCommon.specialCharEscape(companyCEOName),
        },
      });
    }
  }

  if (Array.isArray(companyCEOName)) {
    const companyCEONameReal = [];
    for (let i = 0; i < companyCEOName.length; i++) {
      if (typeof companyCEOName[i] !== 'string') {
        continue;
      }

      if (companyCEOName[i].trim() === '') {
        continue;
      }

      companyCEONameReal.push(companyCEOName[i]);
    }

    if (companyCEONameReal.length > 0) {
      if (!isUserAllSearchPossible) {
        const isUserCompanyCEONameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'U1619318276267fJrivz');
        if (!isUserCompanyCEONameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042080,
              msg: myResultCode[20042080].msg,
            },
          }));
          return;
        }
      }

      companyWhereOpAndArray.push({
        [Op.or]: companyCEONameReal.map((x) => {
          return {
            companyCEOName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // permissionGroupKey 체크 : optional
  if (typeof permissionGroupKey === 'string') {
    if (permissionGroupKey.trim() !== '' && permissionGroupKey.length === 20) {
      OpAndArray.push({
        permissionGroupKey: {
          [Op.eq]: permissionGroupKey,
        },
      });
    }
  }

  if (Array.isArray(permissionGroupKey)) {
    const permissionGroupKeyReal = [];
    for (let i = 0; i < permissionGroupKey.length; i++) {
      if (typeof permissionGroupKey[i] !== 'string') {
        continue;
      }

      if (permissionGroupKey[i].length !== 20) {
        continue;
      }

      permissionGroupKeyReal.push(permissionGroupKey[i]);
    }

    if (permissionGroupKeyReal.length > 0) {
      OpAndArray.push({
        permissionGroupKey: {
          [Op.in]: permissionGroupKeyReal,
        },
      });
    }
  }

  // permissionGroupName 체크
  if (typeof permissionGroupName === 'string') {
    if (permissionGroupName.trim() !== '') {
      if (!isUserAllSearchPossible) {
        const isUserPermissionCroupNameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'qlo1619318587737xclU');
        if (!isUserPermissionCroupNameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042090,
              msg: myResultCode[20042090].msg,
            },
          }));
          return;
        }
      }

      permissionGroupWhereOpAndArray.push({
        permissionGroupName: {
          [Op.substring]: myCommon.specialCharEscape(permissionGroupName),
        },
      });
    }
  }

  if (Array.isArray(permissionGroupName)) {
    const permissionGroupNameReal = [];
    for (let i = 0; i < permissionGroupName.length; i++) {
      if (typeof permissionGroupName[i] !== 'string') {
        continue;
      }

      if (permissionGroupName[i].trim() === '') {
        continue;
      }

      permissionGroupNameReal.push(permissionGroupName[i]);
    }

    if (permissionGroupNameReal.length > 0) {
      if (!isUserAllSearchPossible) {
        const isUserPermissionCroupNameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'qlo1619318587737xclU');
        if (!isUserPermissionCroupNameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042100,
              msg: myResultCode[20042100].msg,
            },
          }));
          return;
        }
      }

      permissionGroupWhereOpAndArray.push({
        [Op.or]: permissionGroupNameReal.map((x) => {
          return {
            permissionGroupName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // userLevel 체크
  if (typeof userLevel === 'string') {
    if (userLevel.trim() !== '' && userLevel.length === 13) {
      if (!isUserAllSearchPossible) {
        const isUserLevelSearchPossible = await db.isActivePermission(loginInfo.userKey, 'mJCF1619318709313ysH');
        if (!isUserLevelSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042110,
              msg: myResultCode[20042110].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        userLevel: {
          [Op.eq]: userLevel,
        },
      });
    }
  }

  if (Array.isArray(userLevel)) {
    const userLevelReal = [];
    for (let i = 0; i < userLevel.length; i++) {
      if (typeof userLevel[i] !== 'string') {
        continue;
      }

      if (userLevel[i].length !== 13) {
        continue;
      }

      userLevelReal.push(userLevel[i]);
    }

    if (userLevelReal.length > 0) {
      if (!isUserAllSearchPossible) {
        const isUserLevelSearchPossible = await db.isActivePermission(loginInfo.userKey, 'mJCF1619318709313ysH');
        if (!isUserLevelSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042120,
              msg: myResultCode[20042120].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        userLevel: {
          [Op.in]: userLevelReal,
        },
      });
    }
  }

  // userId 체크
  if (typeof userId === 'string') {
    if (userId.trim() !== '') {
      if (!isUserAllSearchPossible) {
        const isUserIdSearchPossible = await db.isActivePermission(loginInfo.userKey, 'oPkQ1617686057472UEH');
        if (!isUserIdSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042130,
              msg: myResultCode[20042130].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        userId: {
          [Op.substring]: myCommon.specialCharEscape(userId),
        },
      });
    }
  }

  if (Array.isArray(userId)) {
    const userIdReal = [];
    for (let i = 0; i < userId.length; i++) {
      if (typeof userId[i] !== 'string') {
        continue;
      }

      if (userId[i].trim() === '') {
        continue;
      }

      userIdReal.push(userId[i]);
    }

    if (userIdReal.length > 0) {
      if (!isUserAllSearchPossible) {
        const isUserIdSearchPossible = await db.isActivePermission(loginInfo.userKey, 'oPkQ1617686057472UEH');
        if (!isUserIdSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042140,
              msg: myResultCode[20042140].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: userIdReal.map((x) => {
          return {
            userId: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // userName 체크
  if (typeof userName === 'string') {
    if (userName.trim() !== '') {
      if (!isUserAllSearchPossible) {
        const isUserNameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'paNF1617686087218kvL');
        if (!isUserNameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042150,
              msg: myResultCode[20042150].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        userName: {
          [Op.substring]: myCommon.specialCharEscape(userName),
        },
      });
    }
  }

  if (Array.isArray(userName)) {
    const userNameReal = [];
    for (let i = 0; i < userName.length; i++) {
      if (typeof userName[i] !== 'string') {
        continue;
      }

      if (userName[i].trim() === '') {
        continue;
      }

      userNameReal.push(userName[i]);
    }

    if (userNameReal.length > 0) {
      if (!isUserAllSearchPossible) {
        const isUserNameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'paNF1617686087218kvL');
        if (!isUserNameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042160,
              msg: myResultCode[20042160].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: userNameReal.map((x) => {
          return {
            userName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // userPhone 체크
  if (typeof userPhone === 'string') {
    if (userPhone.trim() !== '') {
      if (!isUserAllSearchPossible) {
        const isUserPhoneSearchPossible = await db.isActivePermission(loginInfo.userKey, 'EuJg1617686102052Yxd');
        if (!isUserPhoneSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042170,
              msg: myResultCode[20042170].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        userPhone: {
          [Op.substring]: myCommon.specialCharEscape(userPhone),
        },
      });
    }
  }

  if (Array.isArray(userPhone)) {
    const userPhoneReal = [];
    for (let i = 0; i < userPhone.length; i++) {
      if (typeof userPhone[i] !== 'string') {
        continue;
      }

      if (userPhone[i].trim() === '') {
        continue;
      }

      userPhoneReal.push(userPhone[i]);
    }

    if (userPhoneReal.length > 0) {
      if (!isUserAllSearchPossible) {
        const isUserPhoneSearchPossible = await db.isActivePermission(loginInfo.userKey, 'EuJg1617686102052Yxd');
        if (!isUserPhoneSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042180,
              msg: myResultCode[20042180].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: userPhoneReal.map((x) => {
          return {
            userPhone: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // userMemo 체크
  if (typeof userMemo === 'string') {
    if (userMemo.trim() !== '') {
      if (!isUserAllSearchPossible) {
        const isUserMemoSearchPossible = await db.isActivePermission(loginInfo.userKey, 'eP1617687968986kdbbj');
        if (!isUserMemoSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042190,
              msg: myResultCode[20042190].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        userMemo: {
          [Op.substring]: myCommon.specialCharEscape(userMemo),
        },
      });
    }
  }

  if (Array.isArray(userMemo)) {
    const userMemoReal = [];
    for (let i = 0; i < userMemo.length; i++) {
      if (typeof userMemo[i] !== 'string') {
        continue;
      }

      if (userMemo[i].trim() === '') {
        continue;
      }

      userMemoReal.push(userMemo[i]);
    }

    if (userMemoReal.length > 0) {
      if (!isUserAllSearchPossible) {
        const isUserMemoSearchPossible = await db.isActivePermission(loginInfo.userKey, 'eP1617687968986kdbbj');
        if (!isUserMemoSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042200,
              msg: myResultCode[20042200].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: userMemoReal.map((x) => {
          return {
            userMemo: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // userStatus 체크 : optional
  if (typeof userStatus === 'string') {
    if (userStatus.trim() !== '' && userStatus.length === 13) {
      if (!isUserAllSearchPossible) {
        const isUserStatusSearchPossible = await db.isActivePermission(loginInfo.userKey, 'kCdm1619318907675TCu');
        if (!isUserStatusSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042210,
              msg: myResultCode[20042210].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        userStatus: {
          [Op.eq]: userStatus,
        },
      });
    }
  }

  if (Array.isArray(userStatus)) {
    const userStatusReal = [];
    for (let i = 0; i < userStatus.length; i++) {
      if (typeof userStatus[i] !== 'string') {
        continue;
      }

      if (userStatus[i].length !== 13) {
        continue;
      }

      userStatusReal.push(userStatus[i]);
    }

    if (userStatusReal.length > 0) {
      if (!isUserAllSearchPossible) {
        const isUserStatusSearchPossible = await db.isActivePermission(loginInfo.userKey, 'kCdm1619318907675TCu');
        if (!isUserStatusSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042220,
              msg: myResultCode[20042220].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        userStatus: {
          [Op.in]: userStatusReal,
        },
      });
    }
  }

  // createdAtStart 체크
  if (typeof createdAtStart === 'string') {
    if (createdAtStart.trim() !== '' && myDate(createdAtStart).isValid()) {
      if (!isUserAllSearchPossible) {
        const isUserCreatedAtSearchPossible = await db.isActivePermission(loginInfo.userKey, 't1617686115937OSsoBL');
        if (!isUserCreatedAtSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042230,
              msg: myResultCode[20042230].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        createdAt: {
          [Op.gte]: createdAtStart,
        },
      });
    }
  }

  // createdAtEnd 체크
  if (typeof createdAtEnd === 'string') {
    if (createdAtEnd.trim() !== '' && myDate(createdAtEnd).isValid()) {
      if (!isUserAllSearchPossible) {
        const isUserCreatedAtSearchPossible = await db.isActivePermission(loginInfo.userKey, 't1617686115937OSsoBL');
        if (!isUserCreatedAtSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042240,
              msg: myResultCode[20042240].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        createdAt: {
          [Op.lte]: createdAtEnd,
        },
      });
    }
  }

  // updatedAtStart 체크
  if (typeof updatedAtStart === 'string') {
    if (updatedAtStart.trim() !== '' && myDate(updatedAtStart).isValid()) {
      if (!isUserAllSearchPossible) {
        const isUserUpdatedAtSearchPossible = await db.isActivePermission(loginInfo.userKey, 'RGAnz1619319005583xP');
        if (!isUserUpdatedAtSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042250,
              msg: myResultCode[20042250].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        updatedAt: {
          [Op.gte]: updatedAtStart,
        },
      });
    }
  }

  // updatedAtEnd 체크
  if (typeof updatedAtEnd === 'string') {
    if (updatedAtEnd.trim() !== '' && myDate(updatedAtEnd).isValid()) {
      if (!isUserAllSearchPossible) {
        const isUserUpdatedAtSearchPossible = await db.isActivePermission(loginInfo.userKey, 'RGAnz1619319005583xP');
        if (!isUserUpdatedAtSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20042260,
              msg: myResultCode[20042260].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        updatedAt: {
          [Op.lte]: updatedAtEnd,
        },
      });
    }
  }









  // page 체크
  if (page === undefined) {
    pageReal = 1;
  }

  if (typeof page === 'string') {
    if (page.trim() === '') {
      pageReal = 1;
    }

    if (isNaN(Number(page))) {
      pageReal = 1;
    }
  }

  // pageViewCount 체크
  if (pageViewCount === undefined) {
    pageViewCountReal = 10;
  }

  if (typeof pageViewCount === 'string') {
    if (pageViewCount.trim() === '') {
      pageViewCountReal = 10;
    }

    if (isNaN(Number(pageViewCount))) {
      pageViewCountReal = 10;
    }
  }

  // viewCount 체크
  if (viewCount === undefined) {
    viewCountReal = 10;
  }

  if (typeof viewCount === 'string') {
    if (viewCount.trim() === '') {
      viewCountReal = 10;
    }

    if (isNaN(Number(viewCount))) {
      viewCountReal = 10;
    }
  }

  // 리스트 가져오기
  /*
    include (join) 대상에 대한 조건이 없다면, OUTER JOIN
    include (join) 대상에 대한 조건이 있다면, INNER JOIN
  */
  if (parentUserWhereOpAndArray.length > 0) {
    parentUserRequired = true;
  }
  if (companyWhereOpAndArray.length > 0) {
    companyRequired = true;
  }
  if (permissionGroupWhereOpAndArray.length > 0) {
    permissionGroupRequired = true;
  }
  where[Op.and] = OpAndArray;
  where.isDeletedRow = 'N';
  order.push(['createdAt', 'DESC']);

  // 전체 리스트 가져오기 (전체 갯수)
  const totalResult = await db.FmsUsers.findAndCountAll({
    where: where,
    order: order,
    include: [
      {
        model: db.FmsUsers,
        as: 'FmsParentUsers',
        attributes: ['userKey', 'userId', 'userName'],
        required: parentUserRequired,
        where: {
          [Op.and]: parentUserWhereOpAndArray,
        },
      },
      {
        model: db.FmsCodes,
        as: 'FmsUserStatusCodes',
        attributes: ['code', 'codeName'],
      },
      {
        model: db.FmsCodes,
        as: 'FmsUserLevelCodes',
        attributes: ['code', 'codeName'],
      },
      {
        model: db.FmsCompanys,
        attributes: ['companyKey', 'companyName', 'companyCEOName'],
        required: companyRequired,
        where: {
          [Op.and]: companyWhereOpAndArray,
        },
      },
      {
        model: db.FmsPermissionGroups,
        attributes: ['permissionGroupKey', 'permissionGroupName', 'permissionGroupDescription'],
        required: permissionGroupRequired,
        where: {
          [Op.and]: permissionGroupWhereOpAndArray,
        },
      },
    ],
  });
  const totalCount = totalResult.count;

  // (1)
  const getPageGroupInfo = myBoard.getPageGroupInfo({
    req: req,
    page: pageReal,
    pageViewCount: pageViewCountReal,
    viewCount: viewCountReal,
  });
  /*
    getPageGroupInfo.pageStartNumber
    getPageGroupInfo.pageEndNumber
    getPageGroupInfo.startIndex
    getPageGroupInfo.pageLength
  */

  // (2)
  const getBoardCountInfo = myBoard.getBoardCountInfo({
    req: req,
    page: pageReal,
    pageViewCount: pageViewCountReal,
    viewCount: viewCountReal,
    pageGroupTotalCount: 0,
    totalCount: totalCount,
    pageStartNumber: getPageGroupInfo.pageStartNumber,
    pageEndNumber: getPageGroupInfo.pageEndNumber,
  });
  /*
    getBoardCountInfo.showPages
    getBoardCountInfo.isPrevExist
    getBoardCountInfo.isNextExist
    getBoardCountInfo.prevPage
    getBoardCountInfo.nextPage
    getBoardCountInfo.lastPageNum
  */

  // (3)
  const getPageInfo = myBoard.getPageInfo({
    req: req,
    page: pageReal,
    pageViewCount: pageViewCountReal,
    viewCount: viewCountReal,
  });
  /*
    getPageInfo.startIndex
    getPageInfo.pageLength 
  */

  const activePermissionKeys = await db.isActivePermissions(loginInfo.userKey, [
    'iPUUDQ1617686168385p', // seq
    'FXPCTN1619320182255r', // 권한 그룹명
    'gq1617686317373XHpoz', // id
    'MVQ1619319509205FVUg', // 부모 id
    'itn1617686335680DnoA', // 회사명
    'shlE1617686355662Tpk', // 회원명
    'yrHqMW1617686370456X', // 휴대폰 번호
    'AVQ1617688011683veXo', // 메모
    'CKVwoUj1617686385077', // 가입일
    'eBs1617686402027CkkN', // 가입시 ip
    'fddW1617686414741VCr', // 상태
  ]);
  const FmsUsersAttributes = [];
  const FmsParentUsersAttributes = [];
  const FmsUserLevelCodesAttributes = [];
  const FmsCompanysAttributes = [];
  const FmsUserStatusCodesAttributes = [];
  const FmsPermissionGroupsAttributes = [];

  activePermissionKeys.includes('iPUUDQ1617686168385p') ? FmsUsersAttributes.push('seq') : null;
  activePermissionKeys.includes('gq1617686317373XHpoz') ? FmsUsersAttributes.push('userId') : null;
  if (activePermissionKeys.includes('MVQ1619319509205FVUg')) {
    FmsUsersAttributes.push('parentUserKey');
    FmsParentUsersAttributes.push('userKey');
    FmsParentUsersAttributes.push('userId');
  }
  if (activePermissionKeys.includes('itn1617686335680DnoA')) {
    FmsUsersAttributes.push('companyKey');
    FmsCompanysAttributes.push('companyKey');
    FmsCompanysAttributes.push('companyName');
  }
  activePermissionKeys.includes('shlE1617686355662Tpk') ? FmsUsersAttributes.push('userName') : null;
  activePermissionKeys.includes('yrHqMW1617686370456X') ? FmsUsersAttributes.push('userPhone') : null;
  activePermissionKeys.includes('AVQ1617688011683veXo') ? FmsUsersAttributes.push('userMemo') : null;
  activePermissionKeys.includes('CKVwoUj1617686385077') ? FmsUsersAttributes.push('createdAt') : null;
  activePermissionKeys.includes('eBs1617686402027CkkN') ? FmsUsersAttributes.push('createdIp') : null;
  if (activePermissionKeys.includes('fddW1617686414741VCr')) {
    FmsUsersAttributes.push('userStatus');
    FmsUserStatusCodesAttributes.push('code');
    FmsUserStatusCodesAttributes.push('codeName');
  }
  if (activePermissionKeys.includes('FXPCTN1619320182255r')) {
    FmsUsersAttributes.push('permissionGroupKey');
    FmsPermissionGroupsAttributes.push('permissionGroupKey');
    FmsPermissionGroupsAttributes.push('permissionGroupName');
  }


  if (FmsUsersAttributes.length > 0) {
    FmsUsersAttributes.push('userKey');
  }

  const list = await db.FmsUsers.findAll({
    attributes: FmsUsersAttributes,
    // attributes: [
    //   'parentUserKey', 'userKey', 'companyKey', 'permissionGroupKey', 'userLevel', 'userId', 'userName', 'userPhone', 'userMemo',
    //   'createdAt', 'createdIp', 'updatedAt', 'updatedIp', 'userStatus',
    // ],
    include: [
      {
        model: db.FmsUsers,
        as: 'FmsParentUsers',
        attributes: FmsParentUsersAttributes,
        // attributes: ['userKey', 'userId', 'userName'],
        required: parentUserRequired,
        where: {
          [Op.and]: parentUserWhereOpAndArray,
        },
      },
      {
        model: db.FmsCodes,
        as: 'FmsUserStatusCodes',
        attributes: FmsUserStatusCodesAttributes,
        // attributes: ['code', 'codeName'],
      },
      {
        model: db.FmsCodes,
        as: 'FmsUserLevelCodes',
        attributes: FmsUserLevelCodesAttributes,
        // attributes: ['code', 'codeName'],
      },
      {
        model: db.FmsCompanys,
        attributes: FmsCompanysAttributes,
        // attributes: ['companyKey', 'companyName', 'companyCEOName'],
        required: companyRequired,
        where: {
          [Op.and]: companyWhereOpAndArray,
        },
      },
      {
        model: db.FmsPermissionGroups,
        attributes: FmsPermissionGroupsAttributes,
        // attributes: ['permissionGroupKey', 'permissionGroupName', 'permissionGroupDescription'],
        required: permissionGroupRequired,
        where: {
          [Op.and]: permissionGroupWhereOpAndArray,
        },
      },
    ],
    where: where,
    order: order,
    offset: getPageInfo.startIndex,
    limit: getPageInfo.pageLength,
  });

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      list: list,
      totalCount: totalCount,
      getBoardCountInfo: getBoardCountInfo,
    },
  }));
  return;
});

module.exports = getUser;